import { createRequire } from "node:module";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { execSync, spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import { main } from "knip";
import { createOptions } from "knip/session";
import os from "node:os";
import { fileURLToPath } from "node:url";

//#region src/constants.ts
const SOURCE_FILE_PATTERN = /\.(tsx?|jsx?)$/;
const JSX_FILE_PATTERN = /\.(tsx|jsx)$/;
const ERROR_PREVIEW_LENGTH_CHARS = 200;
const PERFECT_SCORE = 100;
const SCORE_GOOD_THRESHOLD = 75;
const SCORE_OK_THRESHOLD = 50;
const GIT_LS_FILES_MAX_BUFFER_BYTES = 50 * 1024 * 1024;
const SPAWN_ARGS_MAX_LENGTH_CHARS = 24e3;
const DEFAULT_BRANCH_CANDIDATES = ["main", "master"];
const ERROR_RULE_PENALTY = 1.5;
const WARNING_RULE_PENALTY = .75;
const MAX_KNIP_RETRIES = 5;

//#endregion
//#region src/utils/calculate-score.ts
const getScoreLabel = (score) => {
	if (score >= SCORE_GOOD_THRESHOLD) return "Great";
	if (score >= SCORE_OK_THRESHOLD) return "Needs work";
	return "Critical";
};
const countUniqueRules = (diagnostics) => {
	const errorRules = /* @__PURE__ */ new Set();
	const warningRules = /* @__PURE__ */ new Set();
	for (const diagnostic of diagnostics) {
		const ruleKey = `${diagnostic.plugin}/${diagnostic.rule}`;
		if (diagnostic.severity === "error") errorRules.add(ruleKey);
		else warningRules.add(ruleKey);
	}
	return {
		errorRuleCount: errorRules.size,
		warningRuleCount: warningRules.size
	};
};
const scoreFromRuleCounts = (errorRuleCount, warningRuleCount) => {
	const penalty = errorRuleCount * ERROR_RULE_PENALTY + warningRuleCount * WARNING_RULE_PENALTY;
	return Math.max(0, Math.round(PERFECT_SCORE - penalty));
};
const calculateScore = async (diagnostics) => {
	const { errorRuleCount, warningRuleCount } = countUniqueRules(diagnostics);
	const score = scoreFromRuleCounts(errorRuleCount, warningRuleCount);
	return {
		score,
		label: getScoreLabel(score)
	};
};

//#endregion
//#region src/plugin/constants.ts
const MOTION_LIBRARY_PACKAGES = new Set(["framer-motion", "motion"]);

//#endregion
//#region src/utils/read-package-json.ts
const readPackageJson = (packageJsonPath) => JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

//#endregion
//#region src/utils/check-reduced-motion.ts
const REDUCED_MOTION_GREP_PATTERN = "prefers-reduced-motion|useReducedMotion";
const REDUCED_MOTION_FILE_GLOBS = "\"*.ts\" \"*.tsx\" \"*.js\" \"*.jsx\" \"*.css\" \"*.scss\"";
const MISSING_REDUCED_MOTION_DIAGNOSTIC = {
	filePath: "package.json",
	plugin: "react-doctor",
	rule: "require-reduced-motion",
	severity: "error",
	message: "Project uses a motion library but has no prefers-reduced-motion handling — required for accessibility (WCAG 2.3.3)",
	help: "Add `useReducedMotion()` from your animation library, or a `@media (prefers-reduced-motion: reduce)` CSS query",
	line: 0,
	column: 0,
	category: "Accessibility",
	weight: 2
};
const checkReducedMotion = (rootDirectory) => {
	const packageJsonPath = path.join(rootDirectory, "package.json");
	if (!fs.existsSync(packageJsonPath)) return [];
	let hasMotionLibrary = false;
	try {
		const packageJson = readPackageJson(packageJsonPath);
		const allDependencies = {
			...packageJson.dependencies,
			...packageJson.devDependencies
		};
		hasMotionLibrary = Object.keys(allDependencies).some((packageName) => MOTION_LIBRARY_PACKAGES.has(packageName));
	} catch {
		return [];
	}
	if (!hasMotionLibrary) return [];
	try {
		execSync(`git grep -ql -E "${REDUCED_MOTION_GREP_PATTERN}" -- ${REDUCED_MOTION_FILE_GLOBS}`, {
			cwd: rootDirectory,
			stdio: "pipe"
		});
		return [];
	} catch {
		return [MISSING_REDUCED_MOTION_DIAGNOSTIC];
	}
};

//#endregion
//#region src/utils/match-glob-pattern.ts
const REGEX_SPECIAL_CHARACTERS = /[.+^${}()|[\]\\]/g;
const compileGlobPattern = (pattern) => {
	const normalizedPattern = pattern.replace(/\\/g, "/");
	let regexSource = "^";
	let characterIndex = 0;
	while (characterIndex < normalizedPattern.length) if (normalizedPattern[characterIndex] === "*" && normalizedPattern[characterIndex + 1] === "*") if (normalizedPattern[characterIndex + 2] === "/") {
		regexSource += "(?:.+/)?";
		characterIndex += 3;
	} else {
		regexSource += ".*";
		characterIndex += 2;
	}
	else if (normalizedPattern[characterIndex] === "*") {
		regexSource += "[^/]*";
		characterIndex++;
	} else if (normalizedPattern[characterIndex] === "?") {
		regexSource += "[^/]";
		characterIndex++;
	} else {
		regexSource += normalizedPattern[characterIndex].replace(REGEX_SPECIAL_CHARACTERS, "\\$&");
		characterIndex++;
	}
	regexSource += "$";
	return new RegExp(regexSource);
};

//#endregion
//#region src/utils/filter-diagnostics.ts
const filterIgnoredDiagnostics = (diagnostics, config) => {
	const ignoredRules = new Set(Array.isArray(config.ignore?.rules) ? config.ignore.rules : []);
	const ignoredFilePatterns = Array.isArray(config.ignore?.files) ? config.ignore.files.map(compileGlobPattern) : [];
	if (ignoredRules.size === 0 && ignoredFilePatterns.length === 0) return diagnostics;
	return diagnostics.filter((diagnostic) => {
		const ruleIdentifier = `${diagnostic.plugin}/${diagnostic.rule}`;
		if (ignoredRules.has(ruleIdentifier)) return false;
		const normalizedPath = diagnostic.filePath.replace(/\\/g, "/").replace(/^\.\//, "");
		if (ignoredFilePatterns.some((pattern) => pattern.test(normalizedPath))) return false;
		return true;
	});
};

//#endregion
//#region src/utils/combine-diagnostics.ts
const computeJsxIncludePaths = (includePaths) => includePaths.length > 0 ? includePaths.filter((filePath) => JSX_FILE_PATTERN.test(filePath)) : void 0;
const combineDiagnostics = (lintDiagnostics, deadCodeDiagnostics, directory, isDiffMode, userConfig) => {
	const allDiagnostics = [
		...lintDiagnostics,
		...deadCodeDiagnostics,
		...isDiffMode ? [] : checkReducedMotion(directory)
	];
	return userConfig ? filterIgnoredDiagnostics(allDiagnostics, userConfig) : allDiagnostics;
};

//#endregion
//#region src/utils/find-monorepo-root.ts
const isMonorepoRoot = (directory) => {
	if (fs.existsSync(path.join(directory, "pnpm-workspace.yaml"))) return true;
	const packageJsonPath = path.join(directory, "package.json");
	if (!fs.existsSync(packageJsonPath)) return false;
	const packageJson = readPackageJson(packageJsonPath);
	return Array.isArray(packageJson.workspaces) || Boolean(packageJson.workspaces?.packages);
};
const findMonorepoRoot = (startDirectory) => {
	let currentDirectory = path.dirname(startDirectory);
	while (currentDirectory !== path.dirname(currentDirectory)) {
		if (isMonorepoRoot(currentDirectory)) return currentDirectory;
		currentDirectory = path.dirname(currentDirectory);
	}
	return null;
};

//#endregion
//#region src/utils/discover-project.ts
const REACT_COMPILER_PACKAGES = new Set([
	"babel-plugin-react-compiler",
	"react-compiler-runtime",
	"eslint-plugin-react-compiler"
]);
const NEXT_CONFIG_FILENAMES = [
	"next.config.js",
	"next.config.mjs",
	"next.config.ts",
	"next.config.cjs"
];
const BABEL_CONFIG_FILENAMES = [
	".babelrc",
	".babelrc.json",
	"babel.config.js",
	"babel.config.json",
	"babel.config.cjs",
	"babel.config.mjs"
];
const VITE_CONFIG_FILENAMES = [
	"vite.config.js",
	"vite.config.ts",
	"vite.config.mjs",
	"vite.config.cjs"
];
const EXPO_APP_CONFIG_FILENAMES = [
	"app.json",
	"app.config.js",
	"app.config.ts"
];
const REACT_COMPILER_CONFIG_PATTERN = /react-compiler|reactCompiler/;
const FRAMEWORK_PACKAGES = {
	next: "nextjs",
	vite: "vite",
	"react-scripts": "cra",
	"@remix-run/react": "remix",
	gatsby: "gatsby"
};
const countSourceFiles = (rootDirectory) => {
	const result = spawnSync("git", [
		"ls-files",
		"--cached",
		"--others",
		"--exclude-standard"
	], {
		cwd: rootDirectory,
		encoding: "utf-8",
		maxBuffer: GIT_LS_FILES_MAX_BUFFER_BYTES
	});
	if (result.error || result.status !== 0) return 0;
	return result.stdout.split("\n").filter((filePath) => filePath.length > 0 && SOURCE_FILE_PATTERN.test(filePath)).length;
};
const collectAllDependencies = (packageJson) => ({
	...packageJson.peerDependencies,
	...packageJson.dependencies,
	...packageJson.devDependencies
});
const detectFramework = (dependencies) => {
	for (const [packageName, frameworkName] of Object.entries(FRAMEWORK_PACKAGES)) if (dependencies[packageName]) return frameworkName;
	return "unknown";
};
const extractDependencyInfo = (packageJson) => {
	const allDependencies = collectAllDependencies(packageJson);
	return {
		reactVersion: allDependencies.react ?? null,
		framework: detectFramework(allDependencies)
	};
};
const parsePnpmWorkspacePatterns = (rootDirectory) => {
	const workspacePath = path.join(rootDirectory, "pnpm-workspace.yaml");
	if (!fs.existsSync(workspacePath)) return [];
	const content = fs.readFileSync(workspacePath, "utf-8");
	const patterns = [];
	let isInsidePackagesBlock = false;
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (trimmed === "packages:") {
			isInsidePackagesBlock = true;
			continue;
		}
		if (isInsidePackagesBlock && trimmed.startsWith("-")) patterns.push(trimmed.replace(/^-\s*/, "").replace(/["']/g, ""));
		else if (isInsidePackagesBlock && trimmed.length > 0 && !trimmed.startsWith("#")) isInsidePackagesBlock = false;
	}
	return patterns;
};
const getWorkspacePatterns = (rootDirectory, packageJson) => {
	const pnpmPatterns = parsePnpmWorkspacePatterns(rootDirectory);
	if (pnpmPatterns.length > 0) return pnpmPatterns;
	if (Array.isArray(packageJson.workspaces)) return packageJson.workspaces;
	if (packageJson.workspaces?.packages) return packageJson.workspaces.packages;
	return [];
};
const resolveWorkspaceDirectories = (rootDirectory, pattern) => {
	const cleanPattern = pattern.replace(/["']/g, "").replace(/\/\*\*$/, "/*");
	if (!cleanPattern.includes("*")) {
		const directoryPath = path.join(rootDirectory, cleanPattern);
		if (fs.existsSync(directoryPath) && fs.existsSync(path.join(directoryPath, "package.json"))) return [directoryPath];
		return [];
	}
	const wildcardIndex = cleanPattern.indexOf("*");
	const baseDirectory = path.join(rootDirectory, cleanPattern.slice(0, wildcardIndex));
	const suffixAfterWildcard = cleanPattern.slice(wildcardIndex + 1);
	if (!fs.existsSync(baseDirectory) || !fs.statSync(baseDirectory).isDirectory()) return [];
	return fs.readdirSync(baseDirectory).map((entry) => path.join(baseDirectory, entry, suffixAfterWildcard)).filter((entryPath) => fs.existsSync(entryPath) && fs.statSync(entryPath).isDirectory() && fs.existsSync(path.join(entryPath, "package.json")));
};
const findDependencyInfoFromMonorepoRoot = (directory) => {
	const monorepoRoot = findMonorepoRoot(directory);
	if (!monorepoRoot) return {
		reactVersion: null,
		framework: "unknown"
	};
	const rootPackageJson = readPackageJson(path.join(monorepoRoot, "package.json"));
	const rootInfo = extractDependencyInfo(rootPackageJson);
	const workspaceInfo = findReactInWorkspaces(monorepoRoot, rootPackageJson);
	return {
		reactVersion: rootInfo.reactVersion ?? workspaceInfo.reactVersion,
		framework: rootInfo.framework !== "unknown" ? rootInfo.framework : workspaceInfo.framework
	};
};
const findReactInWorkspaces = (rootDirectory, packageJson) => {
	const patterns = getWorkspacePatterns(rootDirectory, packageJson);
	const result = {
		reactVersion: null,
		framework: "unknown"
	};
	for (const pattern of patterns) {
		const directories = resolveWorkspaceDirectories(rootDirectory, pattern);
		for (const workspaceDirectory of directories) {
			const info = extractDependencyInfo(readPackageJson(path.join(workspaceDirectory, "package.json")));
			if (info.reactVersion && !result.reactVersion) result.reactVersion = info.reactVersion;
			if (info.framework !== "unknown" && result.framework === "unknown") result.framework = info.framework;
			if (result.reactVersion && result.framework !== "unknown") return result;
		}
	}
	return result;
};
const hasCompilerPackage = (packageJson) => {
	const allDependencies = collectAllDependencies(packageJson);
	return Object.keys(allDependencies).some((packageName) => REACT_COMPILER_PACKAGES.has(packageName));
};
const fileContainsPattern = (filePath, pattern) => {
	if (!fs.existsSync(filePath)) return false;
	const content = fs.readFileSync(filePath, "utf-8");
	return pattern.test(content);
};
const hasCompilerInConfigFiles = (directory, filenames) => filenames.some((filename) => fileContainsPattern(path.join(directory, filename), REACT_COMPILER_CONFIG_PATTERN));
const detectReactCompiler = (directory, packageJson) => {
	if (hasCompilerPackage(packageJson)) return true;
	if (hasCompilerInConfigFiles(directory, NEXT_CONFIG_FILENAMES)) return true;
	if (hasCompilerInConfigFiles(directory, BABEL_CONFIG_FILENAMES)) return true;
	if (hasCompilerInConfigFiles(directory, VITE_CONFIG_FILENAMES)) return true;
	if (hasCompilerInConfigFiles(directory, EXPO_APP_CONFIG_FILENAMES)) return true;
	let ancestorDirectory = path.dirname(directory);
	while (ancestorDirectory !== path.dirname(ancestorDirectory)) {
		const ancestorPackagePath = path.join(ancestorDirectory, "package.json");
		if (fs.existsSync(ancestorPackagePath)) {
			if (hasCompilerPackage(readPackageJson(ancestorPackagePath))) return true;
		}
		ancestorDirectory = path.dirname(ancestorDirectory);
	}
	return false;
};
const discoverProject = (directory) => {
	const packageJsonPath = path.join(directory, "package.json");
	if (!fs.existsSync(packageJsonPath)) throw new Error(`No package.json found in ${directory}`);
	const packageJson = readPackageJson(packageJsonPath);
	let { reactVersion, framework } = extractDependencyInfo(packageJson);
	if (!reactVersion || framework === "unknown") {
		const workspaceInfo = findReactInWorkspaces(directory, packageJson);
		if (!reactVersion && workspaceInfo.reactVersion) reactVersion = workspaceInfo.reactVersion;
		if (framework === "unknown" && workspaceInfo.framework !== "unknown") framework = workspaceInfo.framework;
	}
	if ((!reactVersion || framework === "unknown") && !isMonorepoRoot(directory)) {
		const monorepoInfo = findDependencyInfoFromMonorepoRoot(directory);
		if (!reactVersion) reactVersion = monorepoInfo.reactVersion;
		if (framework === "unknown") framework = monorepoInfo.framework;
	}
	const projectName = packageJson.name ?? path.basename(directory);
	const hasTypeScript = fs.existsSync(path.join(directory, "tsconfig.json"));
	const sourceFileCount = countSourceFiles(directory);
	const hasReactCompiler = detectReactCompiler(directory, packageJson);
	return {
		rootDirectory: directory,
		projectName,
		reactVersion,
		framework,
		hasTypeScript,
		hasReactCompiler,
		sourceFileCount
	};
};

//#endregion
//#region src/utils/load-config.ts
const CONFIG_FILENAME = "react-doctor.config.json";
const PACKAGE_JSON_CONFIG_KEY = "reactDoctor";
const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const loadConfig = (rootDirectory) => {
	const configFilePath = path.join(rootDirectory, CONFIG_FILENAME);
	if (fs.existsSync(configFilePath)) try {
		const fileContent = fs.readFileSync(configFilePath, "utf-8");
		const parsed = JSON.parse(fileContent);
		if (!isPlainObject(parsed)) {
			console.warn(`Warning: ${CONFIG_FILENAME} must be a JSON object, ignoring.`);
			return null;
		}
		return parsed;
	} catch (error) {
		console.warn(`Warning: Failed to parse ${CONFIG_FILENAME}: ${error instanceof Error ? error.message : String(error)}`);
		return null;
	}
	const packageJsonPath = path.join(rootDirectory, "package.json");
	if (fs.existsSync(packageJsonPath)) try {
		const fileContent = fs.readFileSync(packageJsonPath, "utf-8");
		const embeddedConfig = JSON.parse(fileContent)[PACKAGE_JSON_CONFIG_KEY];
		if (isPlainObject(embeddedConfig)) return embeddedConfig;
	} catch {
		return null;
	}
	return null;
};

//#endregion
//#region src/utils/run-knip.ts
const KNIP_CATEGORY_MAP = {
	files: "Dead Code",
	exports: "Dead Code",
	types: "Dead Code",
	duplicates: "Dead Code"
};
const KNIP_MESSAGE_MAP = {
	files: "Unused file",
	exports: "Unused export",
	types: "Unused type",
	duplicates: "Duplicate export"
};
const KNIP_SEVERITY_MAP = {
	files: "warning",
	exports: "warning",
	types: "warning",
	duplicates: "warning"
};
const collectIssueRecords = (records, issueType, rootDirectory) => {
	const diagnostics = [];
	for (const issues of Object.values(records)) for (const issue of Object.values(issues)) diagnostics.push({
		filePath: path.relative(rootDirectory, issue.filePath),
		plugin: "knip",
		rule: issueType,
		severity: KNIP_SEVERITY_MAP[issueType] ?? "warning",
		message: `${KNIP_MESSAGE_MAP[issueType]}: ${issue.symbol}`,
		help: "",
		line: 0,
		column: 0,
		category: KNIP_CATEGORY_MAP[issueType] ?? "Dead Code",
		weight: 1
	});
	return diagnostics;
};
const silenced = async (fn) => {
	const originalLog = console.log;
	const originalInfo = console.info;
	const originalWarn = console.warn;
	const originalError = console.error;
	console.log = () => {};
	console.info = () => {};
	console.warn = () => {};
	console.error = () => {};
	try {
		return await fn();
	} finally {
		console.log = originalLog;
		console.info = originalInfo;
		console.warn = originalWarn;
		console.error = originalError;
	}
};
const CONFIG_LOADING_ERROR_PATTERN = /Error loading .*\/([a-z-]+)\.config\./;
const extractFailedPluginName = (error) => {
	return String(error).match(CONFIG_LOADING_ERROR_PATTERN)?.[1] ?? null;
};
const runKnipWithOptions = async (knipCwd, workspaceName) => {
	const options = await silenced(() => createOptions({
		cwd: knipCwd,
		isShowProgress: false,
		...workspaceName ? { workspace: workspaceName } : {}
	}));
	const parsedConfig = options.parsedConfig;
	for (let attempt = 0; attempt <= MAX_KNIP_RETRIES; attempt++) try {
		return await silenced(() => main(options));
	} catch (error) {
		const failedPlugin = extractFailedPluginName(error);
		if (!failedPlugin || attempt === MAX_KNIP_RETRIES) throw error;
		parsedConfig[failedPlugin] = false;
	}
	throw new Error("Unreachable");
};
const hasNodeModules = (directory) => {
	const nodeModulesPath = path.join(directory, "node_modules");
	return fs.existsSync(nodeModulesPath) && fs.statSync(nodeModulesPath).isDirectory();
};
const runKnip = async (rootDirectory) => {
	const monorepoRoot = findMonorepoRoot(rootDirectory);
	if (!(hasNodeModules(rootDirectory) || monorepoRoot !== null && hasNodeModules(monorepoRoot))) return [];
	let knipResult;
	if (monorepoRoot) {
		const packageJsonPath = path.join(rootDirectory, "package.json");
		const workspaceName = (fs.existsSync(packageJsonPath) ? JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) : {}).name ?? path.basename(rootDirectory);
		try {
			knipResult = await runKnipWithOptions(monorepoRoot, workspaceName);
		} catch {
			knipResult = await runKnipWithOptions(rootDirectory);
		}
	} else knipResult = await runKnipWithOptions(rootDirectory);
	const { issues } = knipResult;
	const diagnostics = [];
	for (const unusedFile of issues.files) diagnostics.push({
		filePath: path.relative(rootDirectory, unusedFile),
		plugin: "knip",
		rule: "files",
		severity: KNIP_SEVERITY_MAP["files"],
		message: KNIP_MESSAGE_MAP["files"],
		help: "This file is not imported by any other file in the project.",
		line: 0,
		column: 0,
		category: KNIP_CATEGORY_MAP["files"],
		weight: 1
	});
	for (const issueType of [
		"exports",
		"types",
		"duplicates"
	]) diagnostics.push(...collectIssueRecords(issues[issueType], issueType, rootDirectory));
	return diagnostics;
};

//#endregion
//#region src/oxlint-config.ts
const esmRequire$1 = createRequire(import.meta.url);
const NEXTJS_RULES = {
	"react-doctor/nextjs-no-img-element": "warn",
	"react-doctor/nextjs-async-client-component": "error",
	"react-doctor/nextjs-no-a-element": "warn",
	"react-doctor/nextjs-no-use-search-params-without-suspense": "warn",
	"react-doctor/nextjs-no-client-fetch-for-server-data": "warn",
	"react-doctor/nextjs-missing-metadata": "warn",
	"react-doctor/nextjs-no-client-side-redirect": "warn",
	"react-doctor/nextjs-no-redirect-in-try-catch": "warn",
	"react-doctor/nextjs-image-missing-sizes": "warn",
	"react-doctor/nextjs-no-native-script": "warn",
	"react-doctor/nextjs-inline-script-missing-id": "warn",
	"react-doctor/nextjs-no-font-link": "warn",
	"react-doctor/nextjs-no-css-link": "warn",
	"react-doctor/nextjs-no-polyfill-script": "warn",
	"react-doctor/nextjs-no-head-import": "error",
	"react-doctor/nextjs-no-side-effect-in-get-handler": "error"
};
const REACT_COMPILER_RULES = {
	"react-hooks-js/set-state-in-render": "error",
	"react-hooks-js/immutability": "error",
	"react-hooks-js/refs": "error",
	"react-hooks-js/purity": "error",
	"react-hooks-js/hooks": "error",
	"react-hooks-js/set-state-in-effect": "error",
	"react-hooks-js/globals": "error",
	"react-hooks-js/error-boundaries": "error",
	"react-hooks-js/preserve-manual-memoization": "error",
	"react-hooks-js/unsupported-syntax": "error",
	"react-hooks-js/component-hook-factories": "error",
	"react-hooks-js/static-components": "error",
	"react-hooks-js/use-memo": "error",
	"react-hooks-js/void-use-memo": "error",
	"react-hooks-js/incompatible-library": "error",
	"react-hooks-js/todo": "error"
};
const createOxlintConfig = ({ pluginPath, framework, hasReactCompiler }) => ({
	categories: {
		correctness: "off",
		suspicious: "off",
		pedantic: "off",
		perf: "off",
		restriction: "off",
		style: "off",
		nursery: "off"
	},
	plugins: [
		"react",
		"jsx-a11y",
		...hasReactCompiler ? [] : ["react-perf"]
	],
	jsPlugins: [...hasReactCompiler ? [{
		name: "react-hooks-js",
		specifier: esmRequire$1.resolve("eslint-plugin-react-hooks")
	}] : [], pluginPath],
	rules: {
		"react/rules-of-hooks": "error",
		"react/no-direct-mutation-state": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-key": "error",
		"react/no-children-prop": "warn",
		"react/no-danger": "warn",
		"react/jsx-no-script-url": "error",
		"react/no-render-return-value": "warn",
		"react/no-string-refs": "warn",
		"react/no-is-mounted": "warn",
		"react/require-render-return": "error",
		"react/no-unknown-property": "warn",
		"jsx-a11y/alt-text": "error",
		"jsx-a11y/anchor-is-valid": "warn",
		"jsx-a11y/click-events-have-key-events": "warn",
		"jsx-a11y/no-static-element-interactions": "warn",
		"jsx-a11y/no-noninteractive-element-interactions": "warn",
		"jsx-a11y/role-has-required-aria-props": "error",
		"jsx-a11y/no-autofocus": "warn",
		"jsx-a11y/heading-has-content": "warn",
		"jsx-a11y/html-has-lang": "warn",
		"jsx-a11y/no-redundant-roles": "warn",
		"jsx-a11y/scope": "warn",
		"jsx-a11y/tabindex-no-positive": "warn",
		"jsx-a11y/label-has-associated-control": "warn",
		"jsx-a11y/no-distracting-elements": "error",
		"jsx-a11y/iframe-has-title": "warn",
		...hasReactCompiler ? REACT_COMPILER_RULES : {},
		"react-doctor/no-derived-state-effect": "error",
		"react-doctor/no-fetch-in-effect": "error",
		"react-doctor/no-cascading-set-state": "warn",
		"react-doctor/no-effect-event-handler": "warn",
		"react-doctor/no-derived-useState": "warn",
		"react-doctor/prefer-useReducer": "warn",
		"react-doctor/rerender-lazy-state-init": "warn",
		"react-doctor/rerender-functional-setstate": "warn",
		"react-doctor/rerender-dependencies": "error",
		"react-doctor/no-giant-component": "warn",
		"react-doctor/no-render-in-render": "warn",
		"react-doctor/no-nested-component-definition": "error",
		"react-doctor/no-usememo-simple-expression": "warn",
		"react-doctor/no-layout-property-animation": "error",
		"react-doctor/rerender-memo-with-default-value": "warn",
		"react-doctor/rendering-animate-svg-wrapper": "warn",
		"react-doctor/no-inline-prop-on-memo-component": "warn",
		"react-doctor/rendering-hydration-no-flicker": "warn",
		"react-doctor/no-transition-all": "warn",
		"react-doctor/no-global-css-variable-animation": "error",
		"react-doctor/no-large-animated-blur": "warn",
		"react-doctor/no-scale-from-zero": "warn",
		"react-doctor/no-permanent-will-change": "warn",
		"react-doctor/no-secrets-in-client-code": "error",
		"react-doctor/no-barrel-import": "warn",
		"react-doctor/no-full-lodash-import": "warn",
		"react-doctor/no-moment": "warn",
		"react-doctor/prefer-dynamic-import": "warn",
		"react-doctor/use-lazy-motion": "warn",
		"react-doctor/no-undeferred-third-party": "warn",
		"react-doctor/no-array-index-as-key": "warn",
		"react-doctor/rendering-conditional-render": "warn",
		"react-doctor/no-prevent-default": "warn",
		"react-doctor/server-auth-actions": "error",
		"react-doctor/server-after-nonblocking": "warn",
		"react-doctor/client-passive-event-listeners": "warn",
		"react-doctor/async-parallel": "warn",
		...framework === "nextjs" ? NEXTJS_RULES : {}
	}
});

//#endregion
//#region src/utils/neutralize-disable-directives.ts
const findFilesWithDisableDirectives = (rootDirectory) => {
	const result = spawnSync("git", [
		"grep",
		"-l",
		"--untracked",
		"-E",
		"(eslint|oxlint)-disable"
	], {
		cwd: rootDirectory,
		encoding: "utf-8",
		maxBuffer: GIT_LS_FILES_MAX_BUFFER_BYTES
	});
	if (result.error || result.status === null) return [];
	return result.stdout.split("\n").filter((filePath) => filePath.length > 0 && SOURCE_FILE_PATTERN.test(filePath));
};
const neutralizeContent = (content) => content.replaceAll("eslint-disable", "eslint_disable").replaceAll("oxlint-disable", "oxlint_disable");
const neutralizeDisableDirectives = (rootDirectory) => {
	const filePaths = findFilesWithDisableDirectives(rootDirectory);
	const originalContents = /* @__PURE__ */ new Map();
	for (const relativePath of filePaths) {
		const absolutePath = path.join(rootDirectory, relativePath);
		let originalContent;
		try {
			originalContent = fs.readFileSync(absolutePath, "utf-8");
		} catch {
			continue;
		}
		const neutralizedContent = neutralizeContent(originalContent);
		if (neutralizedContent !== originalContent) {
			originalContents.set(absolutePath, originalContent);
			fs.writeFileSync(absolutePath, neutralizedContent);
		}
	}
	return () => {
		for (const [absolutePath, originalContent] of originalContents) fs.writeFileSync(absolutePath, originalContent);
	};
};

//#endregion
//#region src/utils/run-oxlint.ts
const esmRequire = createRequire(import.meta.url);
const PLUGIN_CATEGORY_MAP = {
	react: "Correctness",
	"react-hooks": "Correctness",
	"react-hooks-js": "React Compiler",
	"react-perf": "Performance",
	"jsx-a11y": "Accessibility"
};
const RULE_CATEGORY_MAP = {
	"react-doctor/no-derived-state-effect": "State & Effects",
	"react-doctor/no-fetch-in-effect": "State & Effects",
	"react-doctor/no-cascading-set-state": "State & Effects",
	"react-doctor/no-effect-event-handler": "State & Effects",
	"react-doctor/no-derived-useState": "State & Effects",
	"react-doctor/prefer-useReducer": "State & Effects",
	"react-doctor/rerender-lazy-state-init": "Performance",
	"react-doctor/rerender-functional-setstate": "Performance",
	"react-doctor/rerender-dependencies": "State & Effects",
	"react-doctor/no-generic-handler-names": "Architecture",
	"react-doctor/no-giant-component": "Architecture",
	"react-doctor/no-render-in-render": "Architecture",
	"react-doctor/no-nested-component-definition": "Correctness",
	"react-doctor/no-usememo-simple-expression": "Performance",
	"react-doctor/no-layout-property-animation": "Performance",
	"react-doctor/rerender-memo-with-default-value": "Performance",
	"react-doctor/rendering-animate-svg-wrapper": "Performance",
	"react-doctor/rendering-usetransition-loading": "Performance",
	"react-doctor/rendering-hydration-no-flicker": "Performance",
	"react-doctor/no-transition-all": "Performance",
	"react-doctor/no-global-css-variable-animation": "Performance",
	"react-doctor/no-large-animated-blur": "Performance",
	"react-doctor/no-scale-from-zero": "Performance",
	"react-doctor/no-permanent-will-change": "Performance",
	"react-doctor/no-secrets-in-client-code": "Security",
	"react-doctor/no-barrel-import": "Bundle Size",
	"react-doctor/no-full-lodash-import": "Bundle Size",
	"react-doctor/no-moment": "Bundle Size",
	"react-doctor/prefer-dynamic-import": "Bundle Size",
	"react-doctor/use-lazy-motion": "Bundle Size",
	"react-doctor/no-undeferred-third-party": "Bundle Size",
	"react-doctor/no-array-index-as-key": "Correctness",
	"react-doctor/rendering-conditional-render": "Correctness",
	"react-doctor/no-prevent-default": "Correctness",
	"react-doctor/nextjs-no-img-element": "Next.js",
	"react-doctor/nextjs-async-client-component": "Next.js",
	"react-doctor/nextjs-no-a-element": "Next.js",
	"react-doctor/nextjs-no-use-search-params-without-suspense": "Next.js",
	"react-doctor/nextjs-no-client-fetch-for-server-data": "Next.js",
	"react-doctor/nextjs-missing-metadata": "Next.js",
	"react-doctor/nextjs-no-client-side-redirect": "Next.js",
	"react-doctor/nextjs-no-redirect-in-try-catch": "Next.js",
	"react-doctor/nextjs-image-missing-sizes": "Next.js",
	"react-doctor/nextjs-no-native-script": "Next.js",
	"react-doctor/nextjs-inline-script-missing-id": "Next.js",
	"react-doctor/nextjs-no-font-link": "Next.js",
	"react-doctor/nextjs-no-css-link": "Next.js",
	"react-doctor/nextjs-no-polyfill-script": "Next.js",
	"react-doctor/nextjs-no-head-import": "Next.js",
	"react-doctor/nextjs-no-side-effect-in-get-handler": "Security",
	"react-doctor/server-auth-actions": "Server",
	"react-doctor/server-after-nonblocking": "Server",
	"react-doctor/client-passive-event-listeners": "Performance",
	"react-doctor/async-parallel": "Performance"
};
const RULE_HELP_MAP = {
	"no-derived-state-effect": "For derived state, compute inline: `const x = fn(dep)`. For state resets on prop change, use a key prop: `<Component key={prop} />`",
	"no-fetch-in-effect": "Use `useQuery()` from @tanstack/react-query, `useSWR()`, or fetch in a Server Component instead",
	"no-cascading-set-state": "Combine into useReducer: `const [state, dispatch] = useReducer(reducer, initialState)`",
	"no-effect-event-handler": "Move the conditional logic into onClick, onChange, or onSubmit handlers directly",
	"no-derived-useState": "Remove useState and compute the value inline: `const value = transform(propName)`",
	"prefer-useReducer": "Group related state: `const [state, dispatch] = useReducer(reducer, { field1, field2, ... })`",
	"rerender-lazy-state-init": "Wrap in an arrow function so it only runs once: `useState(() => expensiveComputation())`",
	"rerender-functional-setstate": "Use the callback form: `setState(prev => prev + 1)` to always read the latest value",
	"rerender-dependencies": "Extract to a useMemo, useRef, or module-level constant so the reference is stable",
	"no-generic-handler-names": "Rename to describe the action: e.g. `handleSubmit` → `saveUserProfile`, `handleClick` → `toggleSidebar`",
	"no-giant-component": "Extract logical sections into focused components: `<UserHeader />`, `<UserActions />`, etc.",
	"no-render-in-render": "Extract to a named component: `const ListItem = ({ item }) => <div>{item.name}</div>`",
	"no-nested-component-definition": "Move to a separate file or to module scope above the parent component",
	"no-usememo-simple-expression": "Remove useMemo — property access, math, and ternaries are already cheap without memoization",
	"no-layout-property-animation": "Use `transform: translateX()` or `scale()` instead — they run on the compositor and skip layout/paint",
	"rerender-memo-with-default-value": "Move to module scope: `const EMPTY_ITEMS: Item[] = []` then use as the default value",
	"rendering-animate-svg-wrapper": "Wrap the SVG: `<motion.div animate={...}><svg>...</svg></motion.div>`",
	"rendering-usetransition-loading": "Replace with `const [isPending, startTransition] = useTransition()` — avoids a re-render for the loading state",
	"rendering-hydration-no-flicker": "Use `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` or add `suppressHydrationWarning` to the element",
	"no-transition-all": "List specific properties: `transition: \"opacity 200ms, transform 200ms\"` — or in Tailwind use `transition-colors`, `transition-opacity`, or `transition-transform`",
	"no-global-css-variable-animation": "Set the variable on the nearest element instead of a parent, or use `@property` with `inherits: false` to prevent cascade. Better yet, use targeted `element.style.transform` updates",
	"no-large-animated-blur": "Keep blur radius under 10px, or apply blur to a smaller element. Large blurs multiply GPU memory usage with layer size",
	"no-scale-from-zero": "Use `initial={{ scale: 0.95, opacity: 0 }}` — elements should deflate like a balloon, not vanish into a point",
	"no-permanent-will-change": "Add will-change on animation start (`onMouseEnter`) and remove on end (`onAnimationEnd`). Permanent promotion wastes GPU memory and can degrade performance",
	"no-secrets-in-client-code": "Move to server-side `process.env.SECRET_NAME`. Only `NEXT_PUBLIC_*` vars are safe for the client (and should not contain secrets)",
	"no-barrel-import": "Import from the direct path: `import { Button } from './components/Button'` instead of `./components`",
	"no-full-lodash-import": "Import the specific function: `import debounce from 'lodash/debounce'` — saves ~70kb",
	"no-moment": "Replace with `import { format } from 'date-fns'` (tree-shakeable) or `import dayjs from 'dayjs'` (2kb)",
	"prefer-dynamic-import": "Use `const Component = dynamic(() => import('library'), { ssr: false })` from next/dynamic or React.lazy()",
	"use-lazy-motion": "Use `import { LazyMotion, m } from \"framer-motion\"` with `domAnimation` features — saves ~30kb",
	"no-undeferred-third-party": "Use `next/script` with `strategy=\"lazyOnload\"` or add the `defer` attribute",
	"no-array-index-as-key": "Use a stable unique identifier: `key={item.id}` or `key={item.slug}` — index keys break on reorder/filter",
	"rendering-conditional-render": "Change to `{items.length > 0 && <List />}` or use a ternary: `{items.length ? <List /> : null}`",
	"no-prevent-default": "Use `<form action={serverAction}>` (works without JS) or `<button>` instead of `<a>` with preventDefault",
	"nextjs-no-img-element": "`import Image from 'next/image'` — provides automatic WebP/AVIF, lazy loading, and responsive srcset",
	"nextjs-async-client-component": "Fetch data in a parent Server Component and pass it as props, or use useQuery/useSWR in the client component",
	"nextjs-no-a-element": "`import Link from 'next/link'` — enables client-side navigation, prefetching, and preserves scroll position",
	"nextjs-no-use-search-params-without-suspense": "Wrap the component using useSearchParams: `<Suspense fallback={<Skeleton />}><SearchComponent /></Suspense>`",
	"nextjs-no-client-fetch-for-server-data": "Remove 'use client' and fetch directly in the Server Component — no API round-trip, secrets stay on server",
	"nextjs-missing-metadata": "Add `export const metadata = { title: '...', description: '...' }` or `export async function generateMetadata()`",
	"nextjs-no-client-side-redirect": "Use `redirect('/path')` from 'next/navigation' in a Server Component, or handle in middleware",
	"nextjs-no-redirect-in-try-catch": "Move the redirect/notFound call outside the try block, or add `unstable_rethrow(error)` in the catch",
	"nextjs-image-missing-sizes": "Add sizes for responsive behavior: `sizes=\"(max-width: 768px) 100vw, 50vw\"` matching your layout breakpoints",
	"nextjs-no-native-script": "`import Script from \"next/script\"` — use `strategy=\"afterInteractive\"` for analytics or `\"lazyOnload\"` for widgets",
	"nextjs-inline-script-missing-id": "Add `id=\"descriptive-name\"` so Next.js can track, deduplicate, and re-execute the script correctly",
	"nextjs-no-font-link": "`import { Inter } from \"next/font/google\"` — self-hosted, zero layout shift, no render-blocking requests",
	"nextjs-no-css-link": "Import CSS directly: `import './styles.css'` or use CSS Modules: `import styles from './Button.module.css'`",
	"nextjs-no-polyfill-script": "Next.js includes polyfills for fetch, Promise, Object.assign, Array.from, and 50+ others automatically",
	"nextjs-no-head-import": "Use the Metadata API instead: `export const metadata = { title: '...' }` or `export async function generateMetadata()`",
	"nextjs-no-side-effect-in-get-handler": "Move the side effect to a POST handler and use a <form> or fetch with method POST — GET requests can be triggered by prefetching and are vulnerable to CSRF",
	"server-auth-actions": "Add `const session = await auth()` at the top and throw/redirect if unauthorized before any data access",
	"server-after-nonblocking": "`import { after } from 'next/server'` then wrap: `after(() => analytics.track(...))` — response isn't blocked",
	"client-passive-event-listeners": "Add `{ passive: true }` as the third argument: `addEventListener('scroll', handler, { passive: true })`",
	"async-parallel": "Use `const [a, b] = await Promise.all([fetchA(), fetchB()])` to run independent operations concurrently"
};
const FILEPATH_WITH_LOCATION_PATTERN = /\S+\.\w+:\d+:\d+[\s\S]*$/;
const REACT_COMPILER_MESSAGE = "React Compiler can't optimize this code";
const cleanDiagnosticMessage = (message, help, plugin, rule) => {
	if (plugin === "react-hooks-js") return {
		message: REACT_COMPILER_MESSAGE,
		help: message.replace(FILEPATH_WITH_LOCATION_PATTERN, "").trim() || help
	};
	return {
		message: message.replace(FILEPATH_WITH_LOCATION_PATTERN, "").trim() || message,
		help: help || RULE_HELP_MAP[rule] || ""
	};
};
const parseRuleCode = (code) => {
	const match = code.match(/^(.+)\((.+)\)$/);
	if (!match) return {
		plugin: "unknown",
		rule: code
	};
	return {
		plugin: match[1].replace(/^eslint-plugin-/, ""),
		rule: match[2]
	};
};
const resolveOxlintBinary = () => {
	const oxlintMainPath = esmRequire.resolve("oxlint");
	const oxlintPackageDirectory = path.resolve(path.dirname(oxlintMainPath), "..");
	return path.join(oxlintPackageDirectory, "bin", "oxlint");
};
const resolvePluginPath = () => {
	const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
	const pluginPath = path.join(currentDirectory, "react-doctor-plugin.js");
	if (fs.existsSync(pluginPath)) return pluginPath;
	const distPluginPath = path.resolve(currentDirectory, "../../dist/react-doctor-plugin.js");
	if (fs.existsSync(distPluginPath)) return distPluginPath;
	return pluginPath;
};
const resolveDiagnosticCategory = (plugin, rule) => {
	return RULE_CATEGORY_MAP[`${plugin}/${rule}`] ?? PLUGIN_CATEGORY_MAP[plugin] ?? "Other";
};
const estimateArgsLength = (args) => args.reduce((total, argument) => total + argument.length + 1, 0);
const batchIncludePaths = (baseArgs, includePaths) => {
	const baseArgsLength = estimateArgsLength(baseArgs);
	const batches = [];
	let currentBatch = [];
	let currentBatchLength = baseArgsLength;
	for (const filePath of includePaths) {
		const entryLength = filePath.length + 1;
		if (currentBatch.length > 0 && currentBatchLength + entryLength > SPAWN_ARGS_MAX_LENGTH_CHARS) {
			batches.push(currentBatch);
			currentBatch = [];
			currentBatchLength = baseArgsLength;
		}
		currentBatch.push(filePath);
		currentBatchLength += entryLength;
	}
	if (currentBatch.length > 0) batches.push(currentBatch);
	return batches;
};
const spawnOxlint = (args, rootDirectory, nodeBinaryPath) => new Promise((resolve, reject) => {
	const child = spawn(nodeBinaryPath, args, { cwd: rootDirectory });
	const stdoutBuffers = [];
	const stderrBuffers = [];
	child.stdout.on("data", (buffer) => stdoutBuffers.push(buffer));
	child.stderr.on("data", (buffer) => stderrBuffers.push(buffer));
	child.on("error", (error) => reject(/* @__PURE__ */ new Error(`Failed to run oxlint: ${error.message}`)));
	child.on("close", () => {
		const output = Buffer.concat(stdoutBuffers).toString("utf-8").trim();
		if (!output) {
			const stderrOutput = Buffer.concat(stderrBuffers).toString("utf-8").trim();
			if (stderrOutput) {
				reject(/* @__PURE__ */ new Error(`Failed to run oxlint: ${stderrOutput}`));
				return;
			}
		}
		resolve(output);
	});
});
const parseOxlintOutput = (stdout) => {
	if (!stdout) return [];
	let output;
	try {
		output = JSON.parse(stdout);
	} catch {
		throw new Error(`Failed to parse oxlint output: ${stdout.slice(0, ERROR_PREVIEW_LENGTH_CHARS)}`);
	}
	return output.diagnostics.filter((diagnostic) => diagnostic.code && JSX_FILE_PATTERN.test(diagnostic.filename)).map((diagnostic) => {
		const { plugin, rule } = parseRuleCode(diagnostic.code);
		const primaryLabel = diagnostic.labels[0];
		const cleaned = cleanDiagnosticMessage(diagnostic.message, diagnostic.help, plugin, rule);
		return {
			filePath: diagnostic.filename,
			plugin,
			rule,
			severity: diagnostic.severity,
			message: cleaned.message,
			help: cleaned.help,
			line: primaryLabel?.span.line ?? 0,
			column: primaryLabel?.span.column ?? 0,
			category: resolveDiagnosticCategory(plugin, rule)
		};
	});
};
const runOxlint = async (rootDirectory, hasTypeScript, framework, hasReactCompiler, includePaths, nodeBinaryPath = process.execPath) => {
	if (includePaths !== void 0 && includePaths.length === 0) return [];
	const configPath = path.join(os.tmpdir(), `react-doctor-oxlintrc-${process.pid}.json`);
	const config = createOxlintConfig({
		pluginPath: resolvePluginPath(),
		framework,
		hasReactCompiler
	});
	const restoreDisableDirectives = neutralizeDisableDirectives(rootDirectory);
	try {
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		const baseArgs = [
			resolveOxlintBinary(),
			"-c",
			configPath,
			"--format",
			"json"
		];
		if (hasTypeScript) baseArgs.push("--tsconfig", "./tsconfig.json");
		const fileBatches = includePaths !== void 0 ? batchIncludePaths(baseArgs, includePaths) : [["."]];
		const allDiagnostics = [];
		for (const batch of fileBatches) {
			const stdout = await spawnOxlint([...baseArgs, ...batch], rootDirectory, nodeBinaryPath);
			allDiagnostics.push(...parseOxlintOutput(stdout));
		}
		return allDiagnostics;
	} finally {
		restoreDisableDirectives();
		if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
	}
};

//#endregion
//#region src/utils/get-diff-files.ts
const getCurrentBranch = (directory) => {
	try {
		const branch = execSync("git rev-parse --abbrev-ref HEAD", {
			cwd: directory,
			stdio: "pipe"
		}).toString().trim();
		return branch === "HEAD" ? null : branch;
	} catch {
		return null;
	}
};
const detectDefaultBranch = (directory) => {
	try {
		return execSync("git symbolic-ref refs/remotes/origin/HEAD", {
			cwd: directory,
			stdio: "pipe"
		}).toString().trim().replace("refs/remotes/origin/", "");
	} catch {
		for (const candidate of DEFAULT_BRANCH_CANDIDATES) try {
			execSync(`git rev-parse --verify ${candidate}`, {
				cwd: directory,
				stdio: "pipe"
			});
			return candidate;
		} catch {}
		return null;
	}
};
const getChangedFilesSinceBranch = (directory, baseBranch) => {
	try {
		const output = execSync(`git diff --name-only --diff-filter=ACMR --relative ${execSync(`git merge-base ${baseBranch} HEAD`, {
			cwd: directory,
			stdio: "pipe"
		}).toString().trim()}`, {
			cwd: directory,
			stdio: "pipe"
		}).toString().trim();
		if (!output) return [];
		return output.split("\n").filter(Boolean);
	} catch {
		return [];
	}
};
const getUncommittedChangedFiles = (directory) => {
	try {
		const output = execSync("git diff --name-only --diff-filter=ACMR --relative HEAD", {
			cwd: directory,
			stdio: "pipe"
		}).toString().trim();
		if (!output) return [];
		return output.split("\n").filter(Boolean);
	} catch {
		return [];
	}
};
const getDiffInfo = (directory, explicitBaseBranch) => {
	const currentBranch = getCurrentBranch(directory);
	if (!currentBranch) return null;
	const baseBranch = explicitBaseBranch ?? detectDefaultBranch(directory);
	if (!baseBranch) return null;
	if (currentBranch === baseBranch) {
		const uncommittedFiles = getUncommittedChangedFiles(directory);
		if (uncommittedFiles.length === 0) return null;
		return {
			currentBranch,
			baseBranch,
			changedFiles: uncommittedFiles,
			isCurrentChanges: true
		};
	}
	return {
		currentBranch,
		baseBranch,
		changedFiles: getChangedFilesSinceBranch(directory, baseBranch)
	};
};
const filterSourceFiles = (filePaths) => filePaths.filter((filePath) => SOURCE_FILE_PATTERN.test(filePath));

//#endregion
//#region src/index.ts
const diagnose = async (directory, options = {}) => {
	const { includePaths = [] } = options;
	const isDiffMode = includePaths.length > 0;
	const startTime = performance.now();
	const resolvedDirectory = path.resolve(directory);
	const projectInfo = discoverProject(resolvedDirectory);
	const userConfig = loadConfig(resolvedDirectory);
	const effectiveLint = options.lint ?? userConfig?.lint ?? true;
	const effectiveDeadCode = options.deadCode ?? userConfig?.deadCode ?? true;
	if (!projectInfo.reactVersion) throw new Error("No React dependency found in package.json");
	const jsxIncludePaths = computeJsxIncludePaths(includePaths);
	const emptyDiagnostics = [];
	const lintPromise = effectiveLint ? runOxlint(resolvedDirectory, projectInfo.hasTypeScript, projectInfo.framework, projectInfo.hasReactCompiler, jsxIncludePaths).catch((error) => {
		console.error("Lint failed:", error);
		return emptyDiagnostics;
	}) : Promise.resolve(emptyDiagnostics);
	const deadCodePromise = effectiveDeadCode && !isDiffMode ? runKnip(resolvedDirectory).catch((error) => {
		console.error("Dead code analysis failed:", error);
		return emptyDiagnostics;
	}) : Promise.resolve(emptyDiagnostics);
	const [lintDiagnostics, deadCodeDiagnostics] = await Promise.all([lintPromise, deadCodePromise]);
	const diagnostics = combineDiagnostics(lintDiagnostics, deadCodeDiagnostics, resolvedDirectory, isDiffMode, userConfig);
	const elapsedMilliseconds = performance.now() - startTime;
	return {
		diagnostics,
		score: await calculateScore(diagnostics),
		project: projectInfo,
		elapsedMilliseconds
	};
};

//#endregion
export { diagnose, filterSourceFiles, getDiffInfo };
//# sourceMappingURL=index.js.map