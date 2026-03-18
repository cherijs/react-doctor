//#region src/plugin/constants.ts
const GIANT_COMPONENT_LINE_THRESHOLD = 300;
const CASCADING_SET_STATE_THRESHOLD = 3;
const RELATED_USE_STATE_THRESHOLD = 5;
const DEEP_NESTING_THRESHOLD = 3;
const DUPLICATE_STORAGE_READ_THRESHOLD = 2;
const SEQUENTIAL_AWAIT_THRESHOLD = 3;
const SECRET_MIN_LENGTH_CHARS = 8;
const AUTH_CHECK_LOOKAHEAD_STATEMENTS = 3;
const LAYOUT_PROPERTIES = new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"margin",
	"marginTop",
	"marginRight",
	"marginBottom",
	"marginLeft",
	"borderWidth",
	"fontSize",
	"lineHeight",
	"gap"
]);
const MOTION_ANIMATE_PROPS = new Set([
	"animate",
	"initial",
	"exit",
	"whileHover",
	"whileTap",
	"whileFocus",
	"whileDrag",
	"whileInView"
]);
const HEAVY_LIBRARIES = new Set([
	"@monaco-editor/react",
	"monaco-editor",
	"recharts",
	"@react-pdf/renderer",
	"react-quill",
	"@codemirror/view",
	"@codemirror/state",
	"chart.js",
	"react-chartjs-2",
	"@toast-ui/editor",
	"draft-js"
]);
const FETCH_CALLEE_NAMES = new Set(["fetch"]);
const FETCH_MEMBER_OBJECTS = new Set([
	"axios",
	"ky",
	"got"
]);
const INDEX_PARAMETER_NAMES = new Set([
	"index",
	"idx",
	"i"
]);
const BARREL_INDEX_SUFFIXES = [
	"/index",
	"/index.js",
	"/index.ts",
	"/index.tsx",
	"/index.mjs"
];
const PASSIVE_EVENT_NAMES = new Set([
	"scroll",
	"wheel",
	"touchstart",
	"touchmove",
	"touchend"
]);
const LOOP_TYPES = [
	"ForStatement",
	"ForInStatement",
	"ForOfStatement",
	"WhileStatement",
	"DoWhileStatement"
];
const AUTH_FUNCTION_NAMES = new Set([
	"auth",
	"getSession",
	"getServerSession",
	"getUser",
	"requireAuth",
	"checkAuth",
	"verifyAuth",
	"authenticate",
	"currentUser",
	"getAuth",
	"validateSession"
]);
const SECRET_PATTERNS = [
	/^sk_live_/,
	/^sk_test_/,
	/^AKIA[0-9A-Z]{16}$/,
	/^ghp_[a-zA-Z0-9]{36}$/,
	/^gho_[a-zA-Z0-9]{36}$/,
	/^github_pat_/,
	/^glpat-/,
	/^xox[bporas]-/,
	/^sk-[a-zA-Z0-9]{32,}$/
];
const SECRET_VARIABLE_PATTERN = /(?:api_?key|secret|token|password|credential|auth)/i;
const SECRET_FALSE_POSITIVE_SUFFIXES = new Set([
	"modal",
	"label",
	"text",
	"title",
	"name",
	"id",
	"key",
	"url",
	"path",
	"route",
	"page",
	"param",
	"field",
	"column",
	"header",
	"placeholder",
	"description",
	"type",
	"icon",
	"class",
	"style",
	"variant",
	"event",
	"action",
	"status",
	"state",
	"mode",
	"flag",
	"option",
	"config",
	"message",
	"error",
	"display",
	"view",
	"component",
	"element",
	"container",
	"wrapper",
	"button",
	"link",
	"input",
	"select",
	"dialog",
	"menu",
	"form",
	"step",
	"index",
	"count",
	"length",
	"role",
	"scope",
	"context",
	"provider",
	"ref",
	"handler",
	"query",
	"schema",
	"constant"
]);
const TRIVIAL_INITIALIZER_NAMES = new Set([
	"Boolean",
	"String",
	"Number",
	"Array",
	"Object",
	"parseInt",
	"parseFloat"
]);
const SETTER_PATTERN = /^set[A-Z]/;
const RENDER_FUNCTION_PATTERN = /^render[A-Z]/;
const UPPERCASE_PATTERN = /^[A-Z]/;
const PAGE_FILE_PATTERN = /\/page\.(tsx?|jsx?)$/;
const PAGE_OR_LAYOUT_FILE_PATTERN = /\/(page|layout)\.(tsx?|jsx?)$/;
const INTERNAL_PAGE_PATH_PATTERN = /\/(?:(?:\((?:dashboard|admin|settings|account|internal|manage|console|portal|auth|onboarding|app|ee|protected)\))|(?:dashboard|admin|settings|account|internal|manage|console|portal))\//i;
const TEST_FILE_PATTERN = /\.(?:test|spec|stories)\.[tj]sx?$/;
const OG_ROUTE_PATTERN = /\/og\b/i;
const PAGES_DIRECTORY_PATTERN = /\/pages\//;
const NEXTJS_NAVIGATION_FUNCTIONS = new Set([
	"redirect",
	"permanentRedirect",
	"notFound",
	"forbidden",
	"unauthorized"
]);
const GOOGLE_FONTS_PATTERN = /fonts\.googleapis\.com/;
const POLYFILL_SCRIPT_PATTERN = /polyfill\.io|polyfill\.min\.js|cdn\.polyfill/;
const APP_DIRECTORY_PATTERN = /\/app\//;
const ROUTE_HANDLER_FILE_PATTERN = /\/route\.(tsx?|jsx?)$/;
const MUTATION_METHOD_NAMES = new Set([
	"create",
	"insert",
	"insertInto",
	"update",
	"upsert",
	"delete",
	"remove",
	"destroy",
	"set",
	"append"
]);
const MUTATING_HTTP_METHODS = new Set([
	"POST",
	"PUT",
	"DELETE",
	"PATCH"
]);
const MUTATING_ROUTE_SEGMENTS = new Set([
	"logout",
	"log-out",
	"signout",
	"sign-out",
	"unsubscribe",
	"delete",
	"remove",
	"revoke",
	"cancel",
	"deactivate"
]);
const EFFECT_HOOK_NAMES = new Set(["useEffect", "useLayoutEffect"]);
const HOOKS_WITH_DEPS = new Set([
	"useEffect",
	"useLayoutEffect",
	"useMemo",
	"useCallback"
]);
const CHAINABLE_ITERATION_METHODS = new Set([
	"map",
	"filter",
	"forEach",
	"flatMap"
]);
const STORAGE_OBJECTS = new Set(["localStorage", "sessionStorage"]);
const LARGE_BLUR_THRESHOLD_PX = 10;
const BLUR_VALUE_PATTERN = /blur\((\d+(?:\.\d+)?)px\)/;
const ANIMATION_CALLBACK_NAMES = new Set(["requestAnimationFrame", "setInterval"]);
const RAW_TEXT_PREVIEW_MAX_CHARS = 30;
const REACT_NATIVE_TEXT_COMPONENTS = new Set(["Text", "TextInput"]);
const DEPRECATED_RN_MODULE_REPLACEMENTS = {
	AsyncStorage: "@react-native-async-storage/async-storage",
	Picker: "@react-native-picker/picker",
	PickerIOS: "@react-native-picker/picker",
	DatePickerIOS: "@react-native-community/datetimepicker",
	DatePickerAndroid: "@react-native-community/datetimepicker",
	ProgressBarAndroid: "a community alternative",
	ProgressViewIOS: "a community alternative",
	SafeAreaView: "react-native-safe-area-context",
	Slider: "@react-native-community/slider",
	ViewPagerAndroid: "react-native-pager-view",
	WebView: "react-native-webview",
	NetInfo: "@react-native-community/netinfo",
	CameraRoll: "@react-native-camera-roll/camera-roll",
	Clipboard: "@react-native-clipboard/clipboard",
	ImageEditor: "@react-native-community/image-editor",
	MaskedViewIOS: "@react-native-masked-view/masked-view"
};
const LEGACY_EXPO_PACKAGE_REPLACEMENTS = {
	"expo-av": "expo-audio for audio and expo-video for video",
	"expo-permissions": "the permissions API in each module (e.g. Camera.requestPermissionsAsync())",
	"@expo/vector-icons": "expo-image with sf: source URIs"
};
const REACT_NATIVE_LIST_COMPONENTS = new Set([
	"FlatList",
	"SectionList",
	"VirtualizedList",
	"FlashList"
]);
const LEGACY_SHADOW_STYLE_PROPERTIES = new Set([
	"shadowColor",
	"shadowOffset",
	"shadowOpacity",
	"shadowRadius",
	"elevation"
]);

//#endregion
//#region src/plugin/helpers.ts
const walkAst = (node, visitor) => {
	if (!node || typeof node !== "object") return;
	visitor(node);
	for (const key of Object.keys(node)) {
		if (key === "parent") continue;
		const child = node[key];
		if (Array.isArray(child)) {
			for (const item of child) if (item && typeof item === "object" && item.type) walkAst(item, visitor);
		} else if (child && typeof child === "object" && child.type) walkAst(child, visitor);
	}
};
const isSetterIdentifier = (name) => SETTER_PATTERN.test(name);
const isUppercaseName = (name) => UPPERCASE_PATTERN.test(name);
const isMemberProperty = (node, propertyName) => node.type === "MemberExpression" && node.property?.type === "Identifier" && node.property.name === propertyName;
const getEffectCallback = (node) => {
	if (!node.arguments?.length) return null;
	const callback = node.arguments[0];
	if (callback.type === "ArrowFunctionExpression" || callback.type === "FunctionExpression") return callback;
	return null;
};
const getCallbackStatements = (callback) => {
	if (callback.body?.type === "BlockStatement") return callback.body.body ?? [];
	return callback.body ? [callback.body] : [];
};
const countSetStateCalls = (node) => {
	let setStateCallCount = 0;
	walkAst(node, (child) => {
		if (child.type === "CallExpression" && child.callee?.type === "Identifier" && isSetterIdentifier(child.callee.name)) setStateCallCount++;
	});
	return setStateCallCount;
};
const isSimpleExpression = (node) => {
	if (!node) return false;
	switch (node.type) {
		case "Identifier":
		case "Literal":
		case "TemplateLiteral": return true;
		case "BinaryExpression": return isSimpleExpression(node.left) && isSimpleExpression(node.right);
		case "UnaryExpression": return isSimpleExpression(node.argument);
		case "MemberExpression": return !node.computed;
		case "ConditionalExpression": return isSimpleExpression(node.test) && isSimpleExpression(node.consequent) && isSimpleExpression(node.alternate);
		default: return false;
	}
};
const isComponentDeclaration = (node) => node.type === "FunctionDeclaration" && Boolean(node.id?.name) && isUppercaseName(node.id.name);
const isComponentAssignment = (node) => node.type === "VariableDeclarator" && node.id?.type === "Identifier" && isUppercaseName(node.id.name) && Boolean(node.init) && (node.init.type === "ArrowFunctionExpression" || node.init.type === "FunctionExpression");
const isHookCall = (node, hookName) => node.type === "CallExpression" && node.callee?.type === "Identifier" && (typeof hookName === "string" ? node.callee.name === hookName : hookName.has(node.callee.name));
const hasDirective = (programNode, directive) => Boolean(programNode.body?.some((statement) => statement.type === "ExpressionStatement" && statement.expression?.type === "Literal" && statement.expression.value === directive));
const hasUseServerDirective = (node) => {
	if (node.body?.type !== "BlockStatement") return false;
	return Boolean(node.body.body?.some((statement) => statement.type === "ExpressionStatement" && statement.directive === "use server"));
};
const containsFetchCall = (node) => {
	let didFindFetchCall = false;
	walkAst(node, (child) => {
		if (didFindFetchCall || child.type !== "CallExpression") return;
		if (child.callee?.type === "Identifier" && FETCH_CALLEE_NAMES.has(child.callee.name)) didFindFetchCall = true;
		if (child.callee?.type === "MemberExpression" && child.callee.object?.type === "Identifier" && FETCH_MEMBER_OBJECTS.has(child.callee.object.name)) didFindFetchCall = true;
	});
	return didFindFetchCall;
};
const findJsxAttribute = (attributes, attributeName) => attributes?.find((attr) => attr.type === "JSXAttribute" && attr.name?.type === "JSXIdentifier" && attr.name.name === attributeName);
const hasJsxAttribute = (attributes, attributeName) => Boolean(findJsxAttribute(attributes, attributeName));
const createLoopAwareVisitors = (innerVisitors) => {
	let loopDepth = 0;
	const incrementLoopDepth = () => {
		loopDepth++;
	};
	const decrementLoopDepth = () => {
		loopDepth--;
	};
	const visitors = {};
	for (const loopType of LOOP_TYPES) {
		visitors[loopType] = incrementLoopDepth;
		visitors[`${loopType}:exit`] = decrementLoopDepth;
	}
	for (const [nodeType, handler] of Object.entries(innerVisitors)) visitors[nodeType] = (node) => {
		if (loopDepth > 0) handler(node);
	};
	return visitors;
};
const isCookiesOrHeadersCall = (node, methodName) => {
	if (node.type !== "CallExpression" || node.callee?.type !== "MemberExpression") return false;
	const { object, property } = node.callee;
	if (property?.type !== "Identifier" || !MUTATION_METHOD_NAMES.has(property.name)) return false;
	if (object?.type !== "CallExpression" || object.callee?.type !== "Identifier") return false;
	return object.callee.name === methodName;
};
const isMutatingDbCall = (node) => {
	if (node.type !== "CallExpression" || node.callee?.type !== "MemberExpression") return false;
	const { property } = node.callee;
	return property?.type === "Identifier" && MUTATION_METHOD_NAMES.has(property.name);
};
const isMutatingFetchCall = (node) => {
	if (node.type !== "CallExpression") return false;
	if (node.callee?.type !== "Identifier" || node.callee.name !== "fetch") return false;
	const optionsArgument = node.arguments?.[1];
	if (!optionsArgument || optionsArgument.type !== "ObjectExpression") return false;
	return optionsArgument.properties?.some((property) => property.type === "Property" && property.key?.type === "Identifier" && property.key.name === "method" && property.value?.type === "Literal" && typeof property.value.value === "string" && MUTATING_HTTP_METHODS.has(property.value.value.toUpperCase()));
};
const findSideEffect = (node) => {
	let sideEffectDescription = null;
	walkAst(node, (child) => {
		if (sideEffectDescription) return;
		if (isCookiesOrHeadersCall(child, "cookies")) sideEffectDescription = `cookies().${child.callee.property.name}()`;
		else if (isCookiesOrHeadersCall(child, "headers")) sideEffectDescription = `headers().${child.callee.property.name}()`;
		else if (isMutatingFetchCall(child)) sideEffectDescription = `fetch() with method ${child.arguments[1].properties.find((property) => property.key?.type === "Identifier" && property.key.name === "method").value.value}`;
		else if (isMutatingDbCall(child)) {
			const methodName = child.callee.property.name;
			const objectName = child.callee.object?.type === "Identifier" ? child.callee.object.name : null;
			sideEffectDescription = objectName ? `${objectName}.${methodName}()` : `.${methodName}()`;
		}
	});
	return sideEffectDescription;
};
const extractDestructuredPropNames = (params) => {
	const propNames = /* @__PURE__ */ new Set();
	for (const param of params) if (param.type === "ObjectPattern") {
		for (const property of param.properties ?? []) if (property.type === "Property" && property.key?.type === "Identifier") propNames.add(property.key.name);
	} else if (param.type === "Identifier") propNames.add(param.name);
	return propNames;
};

//#endregion
//#region src/plugin/rules/architecture.ts
const noGiantComponent = { create: (context) => {
	const reportOversizedComponent = (nameNode, componentName, bodyNode) => {
		if (!bodyNode.loc) return;
		const lineCount = bodyNode.loc.end.line - bodyNode.loc.start.line + 1;
		if (lineCount > GIANT_COMPONENT_LINE_THRESHOLD) context.report({
			node: nameNode,
			message: `Component "${componentName}" is ${lineCount} lines — consider breaking it into smaller focused components`
		});
	};
	return {
		FunctionDeclaration(node) {
			if (!node.id?.name || !isUppercaseName(node.id.name)) return;
			reportOversizedComponent(node.id, node.id.name, node);
		},
		VariableDeclarator(node) {
			if (!isComponentAssignment(node)) return;
			reportOversizedComponent(node.id, node.id.name, node.init);
		}
	};
} };
const noRenderInRender = { create: (context) => ({ JSXExpressionContainer(node) {
	const expression = node.expression;
	if (expression?.type !== "CallExpression") return;
	let calleeName = null;
	if (expression.callee?.type === "Identifier") calleeName = expression.callee.name;
	else if (expression.callee?.type === "MemberExpression" && expression.callee.property?.type === "Identifier") calleeName = expression.callee.property.name;
	if (calleeName && RENDER_FUNCTION_PATTERN.test(calleeName)) context.report({
		node: expression,
		message: `Inline render function "${calleeName}()" — extract to a separate component for proper reconciliation`
	});
} }) };
const noNestedComponentDefinition = { create: (context) => {
	const componentStack = [];
	return {
		FunctionDeclaration(node) {
			if (!isComponentDeclaration(node)) return;
			if (componentStack.length > 0) context.report({
				node: node.id,
				message: `Component "${node.id.name}" defined inside "${componentStack[componentStack.length - 1]}" — creates new instance every render, destroying state`
			});
			componentStack.push(node.id.name);
		},
		"FunctionDeclaration:exit"(node) {
			if (isComponentDeclaration(node)) componentStack.pop();
		},
		VariableDeclarator(node) {
			if (!isComponentAssignment(node)) return;
			if (componentStack.length > 0) context.report({
				node: node.id,
				message: `Component "${node.id.name}" defined inside "${componentStack[componentStack.length - 1]}" — creates new instance every render, destroying state`
			});
			componentStack.push(node.id.name);
		},
		"VariableDeclarator:exit"(node) {
			if (isComponentAssignment(node)) componentStack.pop();
		}
	};
} };

//#endregion
//#region src/plugin/rules/bundle-size.ts
const noBarrelImport = { create: (context) => {
	let didReportForFile = false;
	return { ImportDeclaration(node) {
		if (didReportForFile) return;
		const source = node.source?.value;
		if (typeof source !== "string" || !source.startsWith(".")) return;
		if (BARREL_INDEX_SUFFIXES.some((suffix) => source.endsWith(suffix))) {
			didReportForFile = true;
			context.report({
				node,
				message: "Import from barrel/index file — import directly from the source module for better tree-shaking"
			});
		}
	} };
} };
const noFullLodashImport = { create: (context) => ({ ImportDeclaration(node) {
	const source = node.source?.value;
	if (source === "lodash" || source === "lodash-es") context.report({
		node,
		message: "Importing entire lodash library — import from 'lodash/functionName' instead"
	});
} }) };
const noMoment = { create: (context) => ({ ImportDeclaration(node) {
	if (node.source?.value === "moment") context.report({
		node,
		message: "moment.js is 300kb+ — use \"date-fns\" or \"dayjs\" instead"
	});
} }) };
const preferDynamicImport = { create: (context) => ({ ImportDeclaration(node) {
	const source = node.source?.value;
	if (typeof source === "string" && HEAVY_LIBRARIES.has(source)) context.report({
		node,
		message: `"${source}" is a heavy library — use React.lazy() or next/dynamic for code splitting`
	});
} }) };
const useLazyMotion = { create: (context) => ({ ImportDeclaration(node) {
	const source = node.source?.value;
	if (source !== "framer-motion" && source !== "motion/react") return;
	if (node.specifiers?.some((specifier) => specifier.type === "ImportSpecifier" && specifier.imported?.name === "motion")) context.report({
		node,
		message: "Import \"m\" with LazyMotion instead of \"motion\" — saves ~30kb in bundle size"
	});
} }) };
const noUndeferredThirdParty = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "script") return;
	const attributes = node.attributes ?? [];
	if (!findJsxAttribute(attributes, "src")) return;
	if (!hasJsxAttribute(attributes, "defer") && !hasJsxAttribute(attributes, "async")) context.report({
		node,
		message: "Synchronous <script> with src — add defer or async to avoid blocking first paint"
	});
} }) };

//#endregion
//#region src/plugin/rules/client.ts
const clientPassiveEventListeners = { create: (context) => ({ CallExpression(node) {
	if (!isMemberProperty(node.callee, "addEventListener")) return;
	if (node.arguments?.length < 2) return;
	const eventNameNode = node.arguments[0];
	if (eventNameNode.type !== "Literal" || !PASSIVE_EVENT_NAMES.has(eventNameNode.value)) return;
	const eventName = eventNameNode.value;
	const optionsArgument = node.arguments[2];
	if (!optionsArgument) {
		context.report({
			node,
			message: `"${eventName}" listener without { passive: true } — blocks scrolling performance`
		});
		return;
	}
	if (optionsArgument.type !== "ObjectExpression") return;
	if (!optionsArgument.properties?.some((property) => property.type === "Property" && property.key?.type === "Identifier" && property.key.name === "passive" && property.value?.type === "Literal" && property.value.value === true)) context.report({
		node,
		message: `"${eventName}" listener without { passive: true } — blocks scrolling performance`
	});
} }) };

//#endregion
//#region src/plugin/rules/correctness.ts
const extractIndexName = (node) => {
	if (node.type === "Identifier" && INDEX_PARAMETER_NAMES.has(node.name)) return node.name;
	if (node.type === "TemplateLiteral") {
		const indexExpression = node.expressions?.find((expression) => expression.type === "Identifier" && INDEX_PARAMETER_NAMES.has(expression.name));
		if (indexExpression) return indexExpression.name;
	}
	if (node.type === "CallExpression" && node.callee?.type === "MemberExpression" && node.callee.object?.type === "Identifier" && INDEX_PARAMETER_NAMES.has(node.callee.object.name) && node.callee.property?.type === "Identifier" && node.callee.property.name === "toString") return node.callee.object.name;
	if (node.type === "CallExpression" && node.callee?.type === "Identifier" && node.callee.name === "String" && node.arguments?.[0]?.type === "Identifier" && INDEX_PARAMETER_NAMES.has(node.arguments[0].name)) return node.arguments[0].name;
	return null;
};
const isInsideStaticPlaceholderMap = (node) => {
	let current = node;
	while (current.parent) {
		current = current.parent;
		if (current.type === "CallExpression" && current.callee?.type === "MemberExpression" && current.callee.property?.name === "map") {
			const receiver = current.callee.object;
			if (receiver?.type === "CallExpression") {
				const callee = receiver.callee;
				if (callee?.type === "MemberExpression" && callee.object?.type === "Identifier" && callee.object.name === "Array" && callee.property?.name === "from") return true;
			}
			if (receiver?.type === "NewExpression" && receiver.callee?.type === "Identifier" && receiver.callee.name === "Array") return true;
		}
	}
	return false;
};
const noArrayIndexAsKey = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "key") return;
	if (!node.value || node.value.type !== "JSXExpressionContainer") return;
	const indexName = extractIndexName(node.value.expression);
	if (!indexName) return;
	if (isInsideStaticPlaceholderMap(node)) return;
	context.report({
		node,
		message: `Array index "${indexName}" used as key — causes bugs when list is reordered or filtered`
	});
} }) };
const PREVENT_DEFAULT_ELEMENTS = {
	form: "onSubmit",
	a: "onClick"
};
const containsPreventDefaultCall = (node) => {
	let didFindPreventDefault = false;
	walkAst(node, (child) => {
		if (didFindPreventDefault) return;
		if (child.type === "CallExpression" && child.callee?.type === "MemberExpression" && child.callee.property?.type === "Identifier" && child.callee.property.name === "preventDefault") didFindPreventDefault = true;
	});
	return didFindPreventDefault;
};
const noPreventDefault = { create: (context) => ({ JSXOpeningElement(node) {
	const elementName = node.name?.type === "JSXIdentifier" ? node.name.name : null;
	if (!elementName) return;
	const targetEventProp = PREVENT_DEFAULT_ELEMENTS[elementName];
	if (!targetEventProp) return;
	const eventAttribute = findJsxAttribute(node.attributes ?? [], targetEventProp);
	if (!eventAttribute?.value || eventAttribute.value.type !== "JSXExpressionContainer") return;
	const expression = eventAttribute.value.expression;
	if (expression?.type !== "ArrowFunctionExpression" && expression?.type !== "FunctionExpression") return;
	if (!containsPreventDefaultCall(expression)) return;
	const message = elementName === "form" ? "preventDefault() on <form> onSubmit — form won't work without JavaScript. Consider using a server action for progressive enhancement" : "preventDefault() on <a> onClick — use a <button> or routing component instead";
	context.report({
		node,
		message
	});
} }) };
const renderingConditionalRender = { create: (context) => ({ LogicalExpression(node) {
	if (node.operator !== "&&") return;
	if (!(node.right?.type === "JSXElement" || node.right?.type === "JSXFragment")) return;
	if (node.left?.type === "MemberExpression" && node.left.property?.type === "Identifier" && node.left.property.name === "length") context.report({
		node,
		message: "Conditional rendering with .length can render '0' — use .length > 0 or Boolean(.length)"
	});
} }) };

//#endregion
//#region src/plugin/rules/js-performance.ts
const jsCombineIterations = { create: (context) => ({ CallExpression(node) {
	if (node.callee?.type !== "MemberExpression" || node.callee.property?.type !== "Identifier") return;
	const outerMethod = node.callee.property.name;
	if (!CHAINABLE_ITERATION_METHODS.has(outerMethod)) return;
	const innerCall = node.callee.object;
	if (innerCall?.type !== "CallExpression" || innerCall.callee?.type !== "MemberExpression" || innerCall.callee.property?.type !== "Identifier") return;
	const innerMethod = innerCall.callee.property.name;
	if (!CHAINABLE_ITERATION_METHODS.has(innerMethod)) return;
	context.report({
		node,
		message: `.${innerMethod}().${outerMethod}() iterates the array twice — combine into a single loop with .reduce() or for...of`
	});
} }) };
const jsTosortedImmutable = { create: (context) => ({ CallExpression(node) {
	if (!isMemberProperty(node.callee, "sort")) return;
	const receiver = node.callee.object;
	if (receiver?.type === "ArrayExpression" && receiver.elements?.length === 1 && receiver.elements[0]?.type === "SpreadElement") context.report({
		node,
		message: "[...array].sort() — use array.toSorted() for immutable sorting (ES2023)"
	});
} }) };
const jsHoistRegexp = { create: (context) => createLoopAwareVisitors({ NewExpression(node) {
	if (node.callee?.type === "Identifier" && node.callee.name === "RegExp") context.report({
		node,
		message: "new RegExp() inside a loop — hoist to a module-level constant"
	});
} }) };
const jsMinMaxLoop = { create: (context) => ({ MemberExpression(node) {
	if (!node.computed) return;
	const object = node.object;
	if (object?.type !== "CallExpression" || !isMemberProperty(object.callee, "sort")) return;
	const isFirstElement = node.property?.type === "Literal" && node.property.value === 0;
	const isLastElement = node.property?.type === "BinaryExpression" && node.property.operator === "-" && node.property.right?.type === "Literal" && node.property.right.value === 1;
	if (isFirstElement || isLastElement) {
		const targetFunction = isFirstElement ? "min" : "max";
		context.report({
			node,
			message: `array.sort()[${isFirstElement ? "0" : "length-1"}] for min/max — use Math.${targetFunction}(...array) instead (O(n) vs O(n log n))`
		});
	}
} }) };
const jsSetMapLookups = { create: (context) => createLoopAwareVisitors({ CallExpression(node) {
	if (node.callee?.type !== "MemberExpression" || node.callee.property?.type !== "Identifier") return;
	const methodName = node.callee.property.name;
	if (methodName === "includes" || methodName === "indexOf") context.report({
		node,
		message: `array.${methodName}() in a loop is O(n) per call — convert to a Set for O(1) lookups`
	});
} }) };
const jsBatchDomCss = { create: (context) => {
	const isStyleAssignment = (node) => node.type === "ExpressionStatement" && node.expression?.type === "AssignmentExpression" && node.expression.left?.type === "MemberExpression" && node.expression.left.object?.type === "MemberExpression" && node.expression.left.object.property?.type === "Identifier" && node.expression.left.object.property.name === "style";
	return { BlockStatement(node) {
		const statements = node.body ?? [];
		for (let statementIndex = 1; statementIndex < statements.length; statementIndex++) if (isStyleAssignment(statements[statementIndex]) && isStyleAssignment(statements[statementIndex - 1])) context.report({
			node: statements[statementIndex],
			message: "Multiple sequential element.style assignments — batch with cssText or classList for fewer reflows"
		});
	} };
} };
const jsIndexMaps = { create: (context) => createLoopAwareVisitors({ CallExpression(node) {
	if (node.callee?.type !== "MemberExpression" || node.callee.property?.type !== "Identifier") return;
	const methodName = node.callee.property.name;
	if (methodName === "find" || methodName === "findIndex") context.report({
		node,
		message: `array.${methodName}() in a loop is O(n*m) — build a Map for O(1) lookups`
	});
} }) };
const jsCacheStorage = { create: (context) => {
	const storageReadCounts = /* @__PURE__ */ new Map();
	return { CallExpression(node) {
		if (!isMemberProperty(node.callee, "getItem")) return;
		if (node.callee.object?.type !== "Identifier" || !STORAGE_OBJECTS.has(node.callee.object.name)) return;
		if (node.arguments?.[0]?.type !== "Literal") return;
		const storageKey = String(node.arguments[0].value);
		const readCount = (storageReadCounts.get(storageKey) ?? 0) + 1;
		storageReadCounts.set(storageKey, readCount);
		if (readCount === DUPLICATE_STORAGE_READ_THRESHOLD) {
			const storageName = node.callee.object.name;
			context.report({
				node,
				message: `${storageName}.getItem("${storageKey}") called multiple times — cache the result in a variable`
			});
		}
	} };
} };
const jsEarlyExit = { create: (context) => ({ IfStatement(node) {
	if (node.consequent?.type !== "BlockStatement" || !node.consequent.body) return;
	let nestingDepth = 0;
	let currentBlock = node.consequent;
	while (currentBlock?.type === "BlockStatement" && currentBlock.body?.length === 1) {
		const innerStatement = currentBlock.body[0];
		if (innerStatement.type !== "IfStatement") break;
		nestingDepth++;
		currentBlock = innerStatement.consequent;
	}
	if (nestingDepth >= DEEP_NESTING_THRESHOLD) context.report({
		node,
		message: `${nestingDepth + 1} levels of nested if statements — use early returns to flatten`
	});
} }) };
const asyncParallel = { create: (context) => {
	const filename = context.getFilename?.() ?? "";
	const isTestFile = TEST_FILE_PATTERN.test(filename);
	return { BlockStatement(node) {
		if (isTestFile) return;
		const consecutiveAwaitStatements = [];
		const flushConsecutiveAwaits = () => {
			if (consecutiveAwaitStatements.length >= SEQUENTIAL_AWAIT_THRESHOLD) reportIfIndependent(consecutiveAwaitStatements, context);
			consecutiveAwaitStatements.length = 0;
		};
		for (const statement of node.body ?? []) if (statement.type === "VariableDeclaration" && statement.declarations?.length === 1 && statement.declarations[0].init?.type === "AwaitExpression" || statement.type === "ExpressionStatement" && statement.expression?.type === "AwaitExpression") consecutiveAwaitStatements.push(statement);
		else flushConsecutiveAwaits();
		flushConsecutiveAwaits();
	} };
} };
const reportIfIndependent = (statements, context) => {
	const declaredNames = /* @__PURE__ */ new Set();
	for (const statement of statements) {
		if (statement.type !== "VariableDeclaration") continue;
		const declarator = statement.declarations[0];
		const awaitArgument = declarator.init?.argument;
		let referencesEarlierResult = false;
		walkAst(awaitArgument, (child) => {
			if (child.type === "Identifier" && declaredNames.has(child.name)) referencesEarlierResult = true;
		});
		if (referencesEarlierResult) return;
		if (declarator.id?.type === "Identifier") declaredNames.add(declarator.id.name);
	}
	context.report({
		node: statements[0],
		message: `${statements.length} sequential await statements that appear independent — use Promise.all() for parallel execution`
	});
};

//#endregion
//#region src/plugin/rules/nextjs.ts
const nextjsNoImgElement = { create: (context) => {
	const filename = context.getFilename?.() ?? "";
	const isOgRoute = OG_ROUTE_PATTERN.test(filename);
	return { JSXOpeningElement(node) {
		if (isOgRoute) return;
		if (node.name?.type === "JSXIdentifier" && node.name.name === "img") context.report({
			node,
			message: "Use next/image instead of <img> — provides automatic optimization, lazy loading, and responsive srcset"
		});
	} };
} };
const nextjsAsyncClientComponent = { create: (context) => {
	let fileHasUseClient = false;
	return {
		Program(programNode) {
			fileHasUseClient = hasDirective(programNode, "use client");
		},
		FunctionDeclaration(node) {
			if (!fileHasUseClient || !node.async) return;
			if (!node.id?.name || !isUppercaseName(node.id.name)) return;
			context.report({
				node,
				message: `Async client component "${node.id.name}" — client components cannot be async`
			});
		},
		VariableDeclarator(node) {
			if (!fileHasUseClient) return;
			if (!isComponentAssignment(node) || !node.init?.async) return;
			context.report({
				node,
				message: `Async client component "${node.id.name}" — client components cannot be async`
			});
		}
	};
} };
const nextjsNoAElement = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "a") return;
	const hrefAttribute = findJsxAttribute(node.attributes ?? [], "href");
	if (!hrefAttribute?.value) return;
	let hrefValue = null;
	if (hrefAttribute.value.type === "Literal") hrefValue = hrefAttribute.value.value;
	else if (hrefAttribute.value.type === "JSXExpressionContainer" && hrefAttribute.value.expression?.type === "Literal") hrefValue = hrefAttribute.value.expression.value;
	if (typeof hrefValue === "string" && hrefValue.startsWith("/")) context.report({
		node,
		message: "Use next/link instead of <a> for internal links — enables client-side navigation and prefetching"
	});
} }) };
const nextjsNoUseSearchParamsWithoutSuspense = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, "useSearchParams")) return;
	context.report({
		node,
		message: "useSearchParams() requires a <Suspense> boundary — without one, the entire page bails out to client-side rendering"
	});
} }) };
const nextjsNoClientFetchForServerData = { create: (context) => {
	let fileHasUseClient = false;
	return {
		Program(programNode) {
			fileHasUseClient = hasDirective(programNode, "use client");
		},
		CallExpression(node) {
			if (!fileHasUseClient || !isHookCall(node, EFFECT_HOOK_NAMES)) return;
			const callback = getEffectCallback(node);
			if (!callback || !containsFetchCall(callback)) return;
			const filename = context.getFilename?.() ?? "";
			if (PAGE_OR_LAYOUT_FILE_PATTERN.test(filename) || PAGES_DIRECTORY_PATTERN.test(filename)) context.report({
				node,
				message: "useEffect + fetch in a page/layout — fetch data server-side with a server component instead"
			});
		}
	};
} };
const nextjsMissingMetadata = { create: (context) => ({ Program(programNode) {
	const filename = context.getFilename?.() ?? "";
	if (!PAGE_FILE_PATTERN.test(filename)) return;
	if (INTERNAL_PAGE_PATH_PATTERN.test(filename)) return;
	if (!programNode.body?.some((statement) => {
		if (statement.type !== "ExportNamedDeclaration") return false;
		const declaration = statement.declaration;
		if (declaration?.type === "VariableDeclaration") return declaration.declarations?.some((declarator) => declarator.id?.type === "Identifier" && (declarator.id.name === "metadata" || declarator.id.name === "generateMetadata"));
		if (declaration?.type === "FunctionDeclaration") return declaration.id?.name === "generateMetadata";
		return false;
	})) context.report({
		node: programNode,
		message: "Page without metadata or generateMetadata export — hurts SEO"
	});
} }) };
const isClientSideRedirect = (node) => {
	if (node.type === "CallExpression" && node.callee?.type === "MemberExpression") {
		if ((node.callee.object?.type === "Identifier" ? node.callee.object.name : null) === "router" && (isMemberProperty(node.callee, "push") || isMemberProperty(node.callee, "replace"))) return true;
	}
	if (node.type === "AssignmentExpression" && node.left?.type === "MemberExpression") {
		const objectName = node.left.object?.type === "Identifier" ? node.left.object.name : null;
		const propertyName = node.left.property?.type === "Identifier" ? node.left.property.name : null;
		if (objectName === "window" && propertyName === "location") return true;
		if (objectName === "location" && propertyName === "href") return true;
	}
	return false;
};
const nextjsNoClientSideRedirect = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES)) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	walkAst(callback, (child) => {
		if (isClientSideRedirect(child)) context.report({
			node: child,
			message: "Client-side redirect in useEffect — use redirect() in a server component or middleware instead"
		});
	});
} }) };
const nextjsNoRedirectInTryCatch = { create: (context) => {
	let tryCatchDepth = 0;
	return {
		TryStatement() {
			tryCatchDepth++;
		},
		"TryStatement:exit"() {
			tryCatchDepth--;
		},
		CallExpression(node) {
			if (tryCatchDepth === 0) return;
			if (node.callee?.type !== "Identifier") return;
			if (!NEXTJS_NAVIGATION_FUNCTIONS.has(node.callee.name)) return;
			context.report({
				node,
				message: `${node.callee.name}() inside try-catch — this throws a special error Next.js handles internally. Move it outside the try block or use unstable_rethrow() in the catch`
			});
		}
	};
} };
const nextjsImageMissingSizes = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "Image") return;
	const attributes = node.attributes ?? [];
	if (!hasJsxAttribute(attributes, "fill")) return;
	if (hasJsxAttribute(attributes, "sizes")) return;
	context.report({
		node,
		message: "next/image with fill but no sizes — the browser downloads the largest image. Add a sizes attribute for responsive behavior"
	});
} }) };
const nextjsNoNativeScript = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "script") return;
	context.report({
		node,
		message: "Use next/script <Script> instead of <script> — provides loading strategy optimization and deferred loading"
	});
} }) };
const nextjsInlineScriptMissingId = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "Script") return;
	const attributes = node.attributes ?? [];
	if (hasJsxAttribute(attributes, "src")) return;
	if (hasJsxAttribute(attributes, "id")) return;
	context.report({
		node,
		message: "Inline <Script> without id — Next.js requires an id attribute to track inline scripts"
	});
} }) };
const nextjsNoFontLink = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "link") return;
	const hrefAttribute = findJsxAttribute(node.attributes ?? [], "href");
	if (!hrefAttribute?.value) return;
	const hrefValue = hrefAttribute.value.type === "Literal" ? hrefAttribute.value.value : null;
	if (typeof hrefValue === "string" && GOOGLE_FONTS_PATTERN.test(hrefValue)) context.report({
		node,
		message: "Loading Google Fonts via <link> — use next/font instead for self-hosting, zero layout shift, and no render-blocking requests"
	});
} }) };
const nextjsNoCssLink = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "link") return;
	const attributes = node.attributes ?? [];
	const relAttribute = findJsxAttribute(attributes, "rel");
	if (!relAttribute?.value) return;
	if ((relAttribute.value.type === "Literal" ? relAttribute.value.value : null) !== "stylesheet") return;
	const hrefAttribute = findJsxAttribute(attributes, "href");
	if (!hrefAttribute?.value) return;
	const hrefValue = hrefAttribute.value.type === "Literal" ? hrefAttribute.value.value : null;
	if (typeof hrefValue === "string" && GOOGLE_FONTS_PATTERN.test(hrefValue)) return;
	context.report({
		node,
		message: "<link rel=\"stylesheet\"> tag — import CSS directly for bundling and optimization"
	});
} }) };
const nextjsNoPolyfillScript = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier") return;
	if (node.name.name !== "script" && node.name.name !== "Script") return;
	const srcAttribute = findJsxAttribute(node.attributes ?? [], "src");
	if (!srcAttribute?.value) return;
	const srcValue = srcAttribute.value.type === "Literal" ? srcAttribute.value.value : null;
	if (typeof srcValue === "string" && POLYFILL_SCRIPT_PATTERN.test(srcValue)) context.report({
		node,
		message: "Polyfill CDN script — Next.js includes polyfills for fetch, Promise, Object.assign, and 50+ others automatically"
	});
} }) };
const nextjsNoHeadImport = { create: (context) => ({ ImportDeclaration(node) {
	if (node.source?.value !== "next/head") return;
	const filename = context.getFilename?.() ?? "";
	if (!APP_DIRECTORY_PATTERN.test(filename)) return;
	context.report({
		node,
		message: "next/head is not supported in the App Router — use the Metadata API instead"
	});
} }) };
const extractMutatingRouteSegment = (filename) => {
	const segments = filename.split("/");
	for (const segment of segments) {
		const cleaned = segment.replace(/^\[.*\]$/, "");
		if (MUTATING_ROUTE_SEGMENTS.has(cleaned)) return cleaned;
	}
	return null;
};
const getExportedGetHandlerBody = (node) => {
	if (node.type !== "ExportNamedDeclaration") return null;
	const declaration = node.declaration;
	if (!declaration) return null;
	if (declaration.type === "FunctionDeclaration" && declaration.id?.name === "GET") return declaration.body;
	if (declaration.type === "VariableDeclaration") {
		const declarator = declaration.declarations?.[0];
		if (declarator?.id?.type === "Identifier" && declarator.id.name === "GET" && declarator.init && (declarator.init.type === "ArrowFunctionExpression" || declarator.init.type === "FunctionExpression")) return declarator.init.body;
	}
	return null;
};
const nextjsNoSideEffectInGetHandler = { create: (context) => ({ ExportNamedDeclaration(node) {
	const filename = context.getFilename?.() ?? "";
	if (!ROUTE_HANDLER_FILE_PATTERN.test(filename)) return;
	const handlerBody = getExportedGetHandlerBody(node);
	if (!handlerBody) return;
	const mutatingSegment = extractMutatingRouteSegment(filename);
	if (mutatingSegment) {
		context.report({
			node,
			message: `GET handler on "/${mutatingSegment}" route — use POST to prevent CSRF and unintended prefetch triggers`
		});
		return;
	}
	const sideEffect = findSideEffect(handlerBody);
	if (sideEffect) context.report({
		node,
		message: `GET handler has side effects (${sideEffect}) — use POST to prevent CSRF and unintended prefetch triggers`
	});
} }) };

//#endregion
//#region src/plugin/rules/performance.ts
const isMemoCall = (node) => {
	if (node.type !== "CallExpression") return false;
	if (node.callee?.type === "Identifier" && node.callee.name === "memo") return true;
	if (node.callee?.type === "MemberExpression" && node.callee.object?.type === "Identifier" && node.callee.object.name === "React" && node.callee.property?.type === "Identifier" && node.callee.property.name === "memo") return true;
	return false;
};
const isInlineReference = (node) => {
	if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression" || node.type === "CallExpression" && node.callee?.type === "MemberExpression" && node.callee.property?.name === "bind") return "functions";
	if (node.type === "ObjectExpression") return "objects";
	if (node.type === "ArrayExpression") return "Arrays";
	if (node.type === "JSXElement" || node.type === "JSXFragment") return "JSX";
	return null;
};
const noInlinePropOnMemoComponent = { create: (context) => {
	const memoizedComponentNames = /* @__PURE__ */ new Set();
	return {
		VariableDeclarator(node) {
			if (node.id?.type !== "Identifier" || !node.init) return;
			if (isMemoCall(node.init)) memoizedComponentNames.add(node.id.name);
		},
		ExportDefaultDeclaration(node) {
			if (node.declaration && isMemoCall(node.declaration)) {
				const innerArgument = node.declaration.arguments?.[0];
				if (innerArgument?.type === "Identifier") memoizedComponentNames.add(innerArgument.name);
			}
		},
		JSXAttribute(node) {
			if (!node.value || node.value.type !== "JSXExpressionContainer") return;
			const openingElement = node.parent;
			if (!openingElement || openingElement.type !== "JSXOpeningElement") return;
			let elementName = null;
			if (openingElement.name?.type === "JSXIdentifier") elementName = openingElement.name.name;
			if (!elementName || !memoizedComponentNames.has(elementName)) return;
			const propType = isInlineReference(node.value.expression);
			if (propType) context.report({
				node: node.value.expression,
				message: `JSX attribute values should not contain ${propType} created in the same scope — ${elementName} is wrapped in memo(), so new references cause unnecessary re-renders`
			});
		}
	};
} };
const noUsememoSimpleExpression = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, "useMemo")) return;
	const callback = node.arguments?.[0];
	if (!callback) return;
	if (callback.type !== "ArrowFunctionExpression" && callback.type !== "FunctionExpression") return;
	let returnExpression = null;
	if (callback.body?.type !== "BlockStatement") returnExpression = callback.body;
	else if (callback.body.body?.length === 1 && callback.body.body[0].type === "ReturnStatement") returnExpression = callback.body.body[0].argument;
	if (returnExpression && isSimpleExpression(returnExpression)) context.report({
		node,
		message: "useMemo wrapping a trivially cheap expression — memo overhead exceeds the computation"
	});
} }) };
const isMotionElement = (attributeNode) => {
	const openingElement = attributeNode.parent;
	if (!openingElement || openingElement.type !== "JSXOpeningElement") return false;
	const elementName = openingElement.name;
	if (elementName?.type === "JSXMemberExpression" && elementName.object?.type === "JSXIdentifier" && (elementName.object.name === "motion" || elementName.object.name === "m")) return true;
	if (elementName?.type === "JSXIdentifier" && elementName.name.startsWith("Motion")) return true;
	return false;
};
const noLayoutPropertyAnimation = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier" || !MOTION_ANIMATE_PROPS.has(node.name.name)) return;
	if (!node.value || node.value.type !== "JSXExpressionContainer") return;
	if (isMotionElement(node)) return;
	const expression = node.value.expression;
	if (expression?.type !== "ObjectExpression") return;
	for (const property of expression.properties ?? []) {
		if (property.type !== "Property") continue;
		let propertyName = null;
		if (property.key?.type === "Identifier") propertyName = property.key.name;
		else if (property.key?.type === "Literal") propertyName = property.key.value;
		if (propertyName && LAYOUT_PROPERTIES.has(propertyName)) context.report({
			node: property,
			message: `Animating layout property "${propertyName}" triggers layout recalculation every frame — use transform/scale or the layout prop`
		});
	}
} }) };
const noTransitionAll = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "style") return;
	if (node.value?.type !== "JSXExpressionContainer") return;
	const expression = node.value.expression;
	if (expression?.type !== "ObjectExpression") return;
	for (const property of expression.properties ?? []) {
		if (property.type !== "Property") continue;
		if ((property.key?.type === "Identifier" ? property.key.name : null) !== "transition") continue;
		if (property.value?.type === "Literal" && typeof property.value.value === "string" && property.value.value.startsWith("all")) context.report({
			node: property,
			message: "transition: \"all\" animates every property including layout — list only the properties you animate"
		});
	}
} }) };
const noGlobalCssVariableAnimation = { create: (context) => ({ CallExpression(node) {
	if (node.callee?.type !== "Identifier") return;
	if (!ANIMATION_CALLBACK_NAMES.has(node.callee.name)) return;
	const callback = node.arguments?.[0];
	if (!callback) return;
	const calleeName = node.callee.name;
	walkAst(callback, (child) => {
		if (child.type !== "CallExpression") return;
		if (!isMemberProperty(child.callee, "setProperty")) return;
		if (child.arguments?.[0]?.type !== "Literal") return;
		const variableName = child.arguments[0].value;
		if (typeof variableName !== "string" || !variableName.startsWith("--")) return;
		context.report({
			node: child,
			message: `CSS variable "${variableName}" updated in ${calleeName} — forces style recalculation on all inheriting elements every frame`
		});
	});
} }) };
const noLargeAnimatedBlur = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier") return;
	if (node.name.name !== "style" && !MOTION_ANIMATE_PROPS.has(node.name.name)) return;
	if (node.value?.type !== "JSXExpressionContainer") return;
	const expression = node.value.expression;
	if (expression?.type !== "ObjectExpression") return;
	for (const property of expression.properties ?? []) {
		if (property.type !== "Property") continue;
		const key = property.key?.type === "Identifier" ? property.key.name : null;
		if (key !== "filter" && key !== "backdropFilter" && key !== "WebkitBackdropFilter") continue;
		if (property.value?.type !== "Literal" || typeof property.value.value !== "string") continue;
		const match = BLUR_VALUE_PATTERN.exec(property.value.value);
		if (!match) continue;
		const blurRadius = Number.parseFloat(match[1]);
		if (blurRadius > LARGE_BLUR_THRESHOLD_PX) context.report({
			node: property,
			message: `blur(${blurRadius}px) is expensive — cost escalates with radius and layer size, can exceed GPU memory on mobile`
		});
	}
} }) };
const noScaleFromZero = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier") return;
	if (node.name.name !== "initial" && node.name.name !== "exit") return;
	if (node.value?.type !== "JSXExpressionContainer") return;
	const expression = node.value.expression;
	if (expression?.type !== "ObjectExpression") return;
	for (const property of expression.properties ?? []) {
		if (property.type !== "Property") continue;
		if ((property.key?.type === "Identifier" ? property.key.name : null) !== "scale") continue;
		if (property.value?.type === "Literal" && property.value.value === 0) context.report({
			node: property,
			message: "scale: 0 makes elements appear from nowhere — use scale: 0.95 with opacity: 0 for natural entrance"
		});
	}
} }) };
const noPermanentWillChange = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "style") return;
	if (node.value?.type !== "JSXExpressionContainer") return;
	const expression = node.value.expression;
	if (expression?.type !== "ObjectExpression") return;
	for (const property of expression.properties ?? []) {
		if (property.type !== "Property") continue;
		if ((property.key?.type === "Identifier" ? property.key.name : null) !== "willChange") continue;
		context.report({
			node: property,
			message: "Permanent will-change wastes GPU memory — apply only during active animation and remove after"
		});
	}
} }) };
const rerenderMemoWithDefaultValue = { create: (context) => {
	const checkDefaultProps = (params) => {
		for (const param of params) {
			if (param.type !== "ObjectPattern") continue;
			for (const property of param.properties ?? []) {
				if (property.type !== "Property" || property.value?.type !== "AssignmentPattern") continue;
				const defaultValue = property.value.right;
				if (defaultValue?.type === "ObjectExpression" && defaultValue.properties?.length === 0) context.report({
					node: defaultValue,
					message: "Default prop value {} creates a new object reference every render — extract to a module-level constant"
				});
				if (defaultValue?.type === "ArrayExpression" && defaultValue.elements?.length === 0) context.report({
					node: defaultValue,
					message: "Default prop value [] creates a new array reference every render — extract to a module-level constant"
				});
			}
		}
	};
	return {
		FunctionDeclaration(node) {
			if (!node.id?.name || !isUppercaseName(node.id.name)) return;
			checkDefaultProps(node.params ?? []);
		},
		VariableDeclarator(node) {
			if (!isComponentAssignment(node)) return;
			checkDefaultProps(node.init.params ?? []);
		}
	};
} };
const renderingAnimateSvgWrapper = { create: (context) => ({ JSXOpeningElement(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "svg") return;
	if (node.attributes?.some((attribute) => attribute.type === "JSXAttribute" && attribute.name?.type === "JSXIdentifier" && MOTION_ANIMATE_PROPS.has(attribute.name.name))) context.report({
		node,
		message: "Animation props directly on <svg> — wrap in a <div> or <motion.div> for better rendering performance"
	});
} }) };
const renderingHydrationNoFlicker = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES) || node.arguments?.length < 2) return;
	const depsNode = node.arguments[1];
	if (depsNode.type !== "ArrayExpression" || depsNode.elements?.length !== 0) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	const bodyStatements = callback.body?.type === "BlockStatement" ? callback.body.body : [callback.body];
	if (!bodyStatements || bodyStatements.length !== 1) return;
	const soleStatement = bodyStatements[0];
	if (soleStatement?.type === "ExpressionStatement" && soleStatement.expression?.type === "CallExpression" && soleStatement.expression.callee?.type === "Identifier" && SETTER_PATTERN.test(soleStatement.expression.callee.name)) context.report({
		node,
		message: "useEffect(setState, []) on mount causes a flash — consider useSyncExternalStore or suppressHydrationWarning"
	});
} }) };

//#endregion
//#region src/plugin/rules/react-native.ts
const resolveJsxElementName = (openingElement) => {
	const elementName = openingElement?.name;
	if (!elementName) return null;
	if (elementName.type === "JSXIdentifier") return elementName.name;
	if (elementName.type === "JSXMemberExpression") return elementName.property?.name ?? null;
	return null;
};
const truncateText = (text) => text.length > RAW_TEXT_PREVIEW_MAX_CHARS ? `${text.slice(0, RAW_TEXT_PREVIEW_MAX_CHARS)}...` : text;
const isRawTextContent = (child) => {
	if (child.type === "JSXText") return Boolean(child.value?.trim());
	if (child.type !== "JSXExpressionContainer" || !child.expression) return false;
	const expression = child.expression;
	return expression.type === "Literal" && (typeof expression.value === "string" || typeof expression.value === "number") || expression.type === "TemplateLiteral";
};
const getRawTextDescription = (child) => {
	if (child.type === "JSXText") return `"${truncateText(child.value.trim())}"`;
	if (child.type === "JSXExpressionContainer" && child.expression) {
		const expression = child.expression;
		if (expression.type === "Literal" && typeof expression.value === "string") return `"${truncateText(expression.value)}"`;
		if (expression.type === "Literal" && typeof expression.value === "number") return `{${expression.value}}`;
		if (expression.type === "TemplateLiteral") return "template literal";
	}
	return "text content";
};
const rnNoRawText = { create: (context) => {
	let isDomComponentFile = false;
	return {
		Program(programNode) {
			isDomComponentFile = hasDirective(programNode, "use dom");
		},
		JSXElement(node) {
			if (isDomComponentFile) return;
			const elementName = resolveJsxElementName(node.openingElement);
			if (elementName && REACT_NATIVE_TEXT_COMPONENTS.has(elementName)) return;
			for (const child of node.children ?? []) {
				if (!isRawTextContent(child)) continue;
				context.report({
					node: child,
					message: `Raw ${getRawTextDescription(child)} outside a <Text> component — this will crash on React Native`
				});
			}
		}
	};
} };
const rnNoDeprecatedModules = { create: (context) => ({ ImportDeclaration(node) {
	if (node.source?.value !== "react-native") return;
	for (const specifier of node.specifiers ?? []) {
		if (specifier.type !== "ImportSpecifier") continue;
		const importedName = specifier.imported?.name;
		if (!importedName) continue;
		const replacement = DEPRECATED_RN_MODULE_REPLACEMENTS[importedName];
		if (!replacement) continue;
		context.report({
			node: specifier,
			message: `"${importedName}" was removed from react-native — use ${replacement} instead`
		});
	}
} }) };
const rnNoLegacyExpoPackages = { create: (context) => ({ ImportDeclaration(node) {
	const source = node.source?.value;
	if (typeof source !== "string") return;
	for (const [packageName, replacement] of Object.entries(LEGACY_EXPO_PACKAGE_REPLACEMENTS)) if (source === packageName || source.startsWith(`${packageName}/`)) {
		context.report({
			node,
			message: `"${packageName}" is deprecated — use ${replacement}`
		});
		return;
	}
} }) };
const rnNoDimensionsGet = { create: (context) => ({ CallExpression(node) {
	if (node.callee?.type !== "MemberExpression") return;
	if (node.callee.object?.type !== "Identifier" || node.callee.object.name !== "Dimensions") return;
	if (isMemberProperty(node.callee, "get")) context.report({
		node,
		message: "Dimensions.get() does not update on screen rotation or resize — use useWindowDimensions() for reactive layout"
	});
	if (isMemberProperty(node.callee, "addEventListener")) context.report({
		node,
		message: "Dimensions.addEventListener() was removed in React Native 0.72 — use useWindowDimensions() instead"
	});
} }) };
const rnNoInlineFlatlistRenderitem = { create: (context) => ({ JSXAttribute(node) {
	if (node.name?.type !== "JSXIdentifier" || node.name.name !== "renderItem") return;
	if (!node.value || node.value.type !== "JSXExpressionContainer") return;
	const openingElement = node.parent;
	if (!openingElement || openingElement.type !== "JSXOpeningElement") return;
	const listComponentName = resolveJsxElementName(openingElement);
	if (!listComponentName || !REACT_NATIVE_LIST_COMPONENTS.has(listComponentName)) return;
	const expression = node.value.expression;
	if (expression?.type !== "ArrowFunctionExpression" && expression?.type !== "FunctionExpression") return;
	context.report({
		node: expression,
		message: `Inline renderItem on <${listComponentName}> creates a new function reference every render — extract to a named function or wrap in useCallback`
	});
} }) };
const reportLegacyShadowProperties = (objectExpression, context) => {
	const legacyShadowPropertyNames = [];
	for (const property of objectExpression.properties ?? []) {
		if (property.type !== "Property") continue;
		const propertyName = property.key?.type === "Identifier" ? property.key.name : null;
		if (propertyName && LEGACY_SHADOW_STYLE_PROPERTIES.has(propertyName)) legacyShadowPropertyNames.push(propertyName);
	}
	if (legacyShadowPropertyNames.length === 0) return;
	const quotedPropertyNames = legacyShadowPropertyNames.map((name) => `"${name}"`).join(", ");
	context.report({
		node: objectExpression,
		message: `Legacy shadow style${legacyShadowPropertyNames.length > 1 ? "s" : ""} ${quotedPropertyNames} — use boxShadow for cross-platform shadows on the new architecture`
	});
};
const rnNoLegacyShadowStyles = { create: (context) => ({
	JSXAttribute(node) {
		if (node.name?.type !== "JSXIdentifier" || node.name.name !== "style") return;
		if (node.value?.type !== "JSXExpressionContainer") return;
		const expression = node.value.expression;
		if (expression?.type === "ObjectExpression") reportLegacyShadowProperties(expression, context);
		else if (expression?.type === "ArrayExpression") {
			for (const element of expression.elements ?? []) if (element?.type === "ObjectExpression") reportLegacyShadowProperties(element, context);
		}
	},
	CallExpression(node) {
		if (node.callee?.type !== "MemberExpression") return;
		if (node.callee.object?.type !== "Identifier" || node.callee.object.name !== "StyleSheet") return;
		if (!isMemberProperty(node.callee, "create")) return;
		const stylesArgument = node.arguments?.[0];
		if (stylesArgument?.type !== "ObjectExpression") return;
		for (const styleDefinition of stylesArgument.properties ?? []) {
			if (styleDefinition.type !== "Property") continue;
			if (styleDefinition.value?.type !== "ObjectExpression") continue;
			reportLegacyShadowProperties(styleDefinition.value, context);
		}
	}
}) };
const rnPreferReanimated = { create: (context) => ({ ImportDeclaration(node) {
	if (node.source?.value !== "react-native") return;
	for (const specifier of node.specifiers ?? []) {
		if (specifier.type !== "ImportSpecifier") continue;
		if (specifier.imported?.name !== "Animated") continue;
		context.report({
			node: specifier,
			message: "Animated from react-native runs animations on the JS thread — use react-native-reanimated for performant UI-thread animations"
		});
	}
} }) };
const rnNoSingleElementStyleArray = { create: (context) => ({ JSXAttribute(node) {
	const propName = node.name?.type === "JSXIdentifier" ? node.name.name : null;
	if (!propName) return;
	if (propName !== "style" && !propName.endsWith("Style")) return;
	if (node.value?.type !== "JSXExpressionContainer") return;
	const expression = node.value.expression;
	if (expression?.type !== "ArrayExpression") return;
	if (expression.elements?.length !== 1) return;
	context.report({
		node: expression,
		message: `Single-element style array on "${propName}" — use ${propName}={value} instead of ${propName}={[value]} to avoid unnecessary array allocation`
	});
} }) };

//#endregion
//#region src/plugin/rules/security.ts
const noEval = { create: (context) => ({
	CallExpression(node) {
		if (node.callee?.type === "Identifier" && node.callee.name === "eval") {
			context.report({
				node,
				message: "eval() is a code injection risk — avoid dynamic code execution"
			});
			return;
		}
		if (node.callee?.type === "Identifier" && (node.callee.name === "setTimeout" || node.callee.name === "setInterval") && node.arguments?.[0]?.type === "Literal" && typeof node.arguments[0].value === "string") context.report({
			node,
			message: `${node.callee.name}() with string argument executes code dynamically — use a function instead`
		});
	},
	NewExpression(node) {
		if (node.callee?.type === "Identifier" && node.callee.name === "Function") context.report({
			node,
			message: "new Function() is a code injection risk — avoid dynamic code execution"
		});
	}
}) };
const noSecretsInClientCode = { create: (context) => ({ VariableDeclarator(node) {
	if (node.id?.type !== "Identifier") return;
	if (node.init?.type !== "Literal" || typeof node.init.value !== "string") return;
	const variableName = node.id.name;
	const literalValue = node.init.value;
	const trailingSuffix = variableName.split("_").pop()?.toLowerCase() ?? "";
	const isUiConstant = SECRET_FALSE_POSITIVE_SUFFIXES.has(trailingSuffix);
	if (SECRET_VARIABLE_PATTERN.test(variableName) && !isUiConstant && literalValue.length > SECRET_MIN_LENGTH_CHARS) {
		context.report({
			node,
			message: `Possible hardcoded secret in "${variableName}" — use environment variables instead`
		});
		return;
	}
	if (SECRET_PATTERNS.some((pattern) => pattern.test(literalValue))) context.report({
		node,
		message: "Hardcoded secret detected — use environment variables instead"
	});
} }) };

//#endregion
//#region src/plugin/rules/server.ts
const containsAuthCheck = (statements) => {
	let foundAuthCall = false;
	for (const statement of statements) walkAst(statement, (child) => {
		if (foundAuthCall) return;
		let callNode = null;
		if (child.type === "CallExpression") callNode = child;
		else if (child.type === "AwaitExpression" && child.argument?.type === "CallExpression") callNode = child.argument;
		if (callNode?.callee?.type === "Identifier" && AUTH_FUNCTION_NAMES.has(callNode.callee.name)) foundAuthCall = true;
	});
	return foundAuthCall;
};
const serverAuthActions = { create: (context) => {
	let fileHasUseServerDirective = false;
	return {
		Program(programNode) {
			fileHasUseServerDirective = hasDirective(programNode, "use server");
		},
		ExportNamedDeclaration(node) {
			const declaration = node.declaration;
			if (declaration?.type !== "FunctionDeclaration" || !declaration?.async) return;
			if (!(fileHasUseServerDirective || hasUseServerDirective(declaration))) return;
			if (!containsAuthCheck((declaration.body?.body ?? []).slice(0, AUTH_CHECK_LOOKAHEAD_STATEMENTS))) {
				const functionName = declaration.id?.name ?? "anonymous";
				context.report({
					node: declaration.id ?? node,
					message: `Server action "${functionName}" — add auth check (auth(), getSession(), etc.) at the top`
				});
			}
		}
	};
} };
const serverAfterNonblocking = { create: (context) => {
	let fileHasUseServerDirective = false;
	return {
		Program(programNode) {
			fileHasUseServerDirective = hasDirective(programNode, "use server");
		},
		CallExpression(node) {
			if (!fileHasUseServerDirective) return;
			if (node.callee?.type !== "MemberExpression") return;
			if (node.callee.property?.type !== "Identifier") return;
			const objectName = node.callee.object?.type === "Identifier" ? node.callee.object.name : null;
			if (!objectName) return;
			const methodName = node.callee.property.name;
			if (!(objectName === "console" && (methodName === "log" || methodName === "info" || methodName === "warn") || objectName === "analytics" && (methodName === "track" || methodName === "identify" || methodName === "page"))) return;
			context.report({
				node,
				message: `${objectName}.${methodName}() in server action — use after() for non-blocking logging/analytics`
			});
		}
	};
} };

//#endregion
//#region src/plugin/rules/state-and-effects.ts
const noDerivedStateEffect = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES) || node.arguments.length < 2) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	const depsNode = node.arguments[1];
	if (depsNode.type !== "ArrayExpression" || !depsNode.elements?.length) return;
	const dependencyNames = new Set(depsNode.elements.filter((element) => element?.type === "Identifier").map((element) => element.name));
	if (dependencyNames.size === 0) return;
	const statements = getCallbackStatements(callback);
	if (statements.length === 0) return;
	if (!statements.every((statement) => statement.type === "ExpressionStatement" && statement.expression?.type === "CallExpression" && statement.expression.callee?.type === "Identifier" && isSetterIdentifier(statement.expression.callee.name))) return;
	let allArgumentsDeriveFromDeps = true;
	let hasAnyDependencyReference = false;
	for (const statement of statements) {
		const setStateArguments = statement.expression.arguments;
		if (!setStateArguments?.length) continue;
		const referencedIdentifiers = [];
		walkAst(setStateArguments[0], (child) => {
			if (child.type === "Identifier") referencedIdentifiers.push(child.name);
		});
		const nonSetterIdentifiers = referencedIdentifiers.filter((name) => !isSetterIdentifier(name));
		if (nonSetterIdentifiers.some((name) => dependencyNames.has(name))) hasAnyDependencyReference = true;
		if (nonSetterIdentifiers.some((name) => !dependencyNames.has(name))) {
			allArgumentsDeriveFromDeps = false;
			break;
		}
	}
	if (allArgumentsDeriveFromDeps) context.report({
		node,
		message: hasAnyDependencyReference ? "Derived state in useEffect — compute during render instead" : "State reset in useEffect — use a key prop to reset component state when props change"
	});
} }) };
const noFetchInEffect = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES)) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	if (containsFetchCall(callback)) context.report({
		node,
		message: "fetch() inside useEffect — use a data fetching library (react-query, SWR) or server component"
	});
} }) };
const noCascadingSetState = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES)) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	const setStateCallCount = countSetStateCalls(callback);
	if (setStateCallCount >= CASCADING_SET_STATE_THRESHOLD) context.report({
		node,
		message: `${setStateCallCount} setState calls in a single useEffect — consider using useReducer or deriving state`
	});
} }) };
const noEffectEventHandler = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, EFFECT_HOOK_NAMES) || node.arguments.length < 2) return;
	const callback = getEffectCallback(node);
	if (!callback) return;
	const depsNode = node.arguments[1];
	if (depsNode.type !== "ArrayExpression" || !depsNode.elements?.length) return;
	const dependencyNames = new Set(depsNode.elements.filter((element) => element?.type === "Identifier").map((element) => element.name));
	const statements = getCallbackStatements(callback);
	if (statements.length !== 1) return;
	const soleStatement = statements[0];
	if (soleStatement.type === "IfStatement" && soleStatement.test?.type === "Identifier" && dependencyNames.has(soleStatement.test.name)) context.report({
		node,
		message: "useEffect simulating an event handler — move logic to an actual event handler instead"
	});
} }) };
const noDerivedUseState = { create: (context) => {
	const componentPropNames = /* @__PURE__ */ new Set();
	return {
		FunctionDeclaration(node) {
			if (!node.id?.name || !isUppercaseName(node.id.name)) return;
			for (const name of extractDestructuredPropNames(node.params ?? [])) componentPropNames.add(name);
		},
		VariableDeclarator(node) {
			if (!isComponentAssignment(node)) return;
			for (const name of extractDestructuredPropNames(node.init?.params ?? [])) componentPropNames.add(name);
		},
		CallExpression(node) {
			if (!isHookCall(node, "useState") || !node.arguments?.length) return;
			const initializer = node.arguments[0];
			if (initializer.type !== "Identifier") return;
			if (componentPropNames.has(initializer.name)) context.report({
				node,
				message: `useState initialized from prop "${initializer.name}" — if this value should stay in sync with the prop, derive it during render instead`
			});
		}
	};
} };
const preferUseReducer = { create: (context) => {
	const reportExcessiveUseState = (body, componentName) => {
		if (body.type !== "BlockStatement") return;
		let useStateCount = 0;
		for (const statement of body.body ?? []) {
			if (statement.type !== "VariableDeclaration") continue;
			for (const declarator of statement.declarations ?? []) if (isHookCall(declarator.init, "useState")) useStateCount++;
		}
		if (useStateCount >= RELATED_USE_STATE_THRESHOLD) context.report({
			node: body,
			message: `Component "${componentName}" has ${useStateCount} useState calls — consider useReducer for related state`
		});
	};
	return {
		FunctionDeclaration(node) {
			if (!node.id?.name || !isUppercaseName(node.id.name)) return;
			reportExcessiveUseState(node.body, node.id.name);
		},
		VariableDeclarator(node) {
			if (!isComponentAssignment(node)) return;
			reportExcessiveUseState(node.init.body, node.id.name);
		}
	};
} };
const rerenderLazyStateInit = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, "useState") || !node.arguments?.length) return;
	const initializer = node.arguments[0];
	if (initializer.type !== "CallExpression") return;
	const calleeName = initializer.callee?.type === "Identifier" ? initializer.callee.name : initializer.callee?.property?.name ?? "fn";
	if (TRIVIAL_INITIALIZER_NAMES.has(calleeName)) return;
	context.report({
		node: initializer,
		message: `useState(${calleeName}()) calls initializer on every render — use useState(() => ${calleeName}()) for lazy initialization`
	});
} }) };
const rerenderFunctionalSetstate = { create: (context) => ({ CallExpression(node) {
	if (node.callee?.type !== "Identifier" || !isSetterIdentifier(node.callee.name)) return;
	if (!node.arguments?.length) return;
	const argument = node.arguments[0];
	if (argument.type === "BinaryExpression" && (argument.operator === "+" || argument.operator === "-") && argument.left?.type === "Identifier") context.report({
		node,
		message: `${node.callee.name}(${argument.left.name} ${argument.operator} ...) — use functional update to avoid stale closures`
	});
} }) };
const rerenderDependencies = { create: (context) => ({ CallExpression(node) {
	if (!isHookCall(node, HOOKS_WITH_DEPS) || node.arguments.length < 2) return;
	const depsNode = node.arguments[1];
	if (depsNode.type !== "ArrayExpression") return;
	for (const element of depsNode.elements ?? []) {
		if (!element) continue;
		if (element.type === "ObjectExpression") context.report({
			node: element,
			message: "Object literal in useEffect deps — creates new reference every render, causing infinite re-runs"
		});
		if (element.type === "ArrayExpression") context.report({
			node: element,
			message: "Array literal in useEffect deps — creates new reference every render, causing infinite re-runs"
		});
	}
} }) };

//#endregion
//#region src/plugin/index.ts
const plugin = {
	meta: { name: "react-doctor" },
	rules: {
		"no-derived-state-effect": noDerivedStateEffect,
		"no-fetch-in-effect": noFetchInEffect,
		"no-cascading-set-state": noCascadingSetState,
		"no-effect-event-handler": noEffectEventHandler,
		"no-derived-useState": noDerivedUseState,
		"prefer-useReducer": preferUseReducer,
		"rerender-lazy-state-init": rerenderLazyStateInit,
		"rerender-functional-setstate": rerenderFunctionalSetstate,
		"rerender-dependencies": rerenderDependencies,
		"no-giant-component": noGiantComponent,
		"no-render-in-render": noRenderInRender,
		"no-nested-component-definition": noNestedComponentDefinition,
		"no-usememo-simple-expression": noUsememoSimpleExpression,
		"no-layout-property-animation": noLayoutPropertyAnimation,
		"rerender-memo-with-default-value": rerenderMemoWithDefaultValue,
		"rendering-animate-svg-wrapper": renderingAnimateSvgWrapper,
		"no-inline-prop-on-memo-component": noInlinePropOnMemoComponent,
		"rendering-hydration-no-flicker": renderingHydrationNoFlicker,
		"no-transition-all": noTransitionAll,
		"no-global-css-variable-animation": noGlobalCssVariableAnimation,
		"no-large-animated-blur": noLargeAnimatedBlur,
		"no-scale-from-zero": noScaleFromZero,
		"no-permanent-will-change": noPermanentWillChange,
		"no-eval": noEval,
		"no-secrets-in-client-code": noSecretsInClientCode,
		"no-barrel-import": noBarrelImport,
		"no-full-lodash-import": noFullLodashImport,
		"no-moment": noMoment,
		"prefer-dynamic-import": preferDynamicImport,
		"use-lazy-motion": useLazyMotion,
		"no-undeferred-third-party": noUndeferredThirdParty,
		"no-array-index-as-key": noArrayIndexAsKey,
		"rendering-conditional-render": renderingConditionalRender,
		"no-prevent-default": noPreventDefault,
		"nextjs-no-img-element": nextjsNoImgElement,
		"nextjs-async-client-component": nextjsAsyncClientComponent,
		"nextjs-no-a-element": nextjsNoAElement,
		"nextjs-no-use-search-params-without-suspense": nextjsNoUseSearchParamsWithoutSuspense,
		"nextjs-no-client-fetch-for-server-data": nextjsNoClientFetchForServerData,
		"nextjs-missing-metadata": nextjsMissingMetadata,
		"nextjs-no-client-side-redirect": nextjsNoClientSideRedirect,
		"nextjs-no-redirect-in-try-catch": nextjsNoRedirectInTryCatch,
		"nextjs-image-missing-sizes": nextjsImageMissingSizes,
		"nextjs-no-native-script": nextjsNoNativeScript,
		"nextjs-inline-script-missing-id": nextjsInlineScriptMissingId,
		"nextjs-no-font-link": nextjsNoFontLink,
		"nextjs-no-css-link": nextjsNoCssLink,
		"nextjs-no-polyfill-script": nextjsNoPolyfillScript,
		"nextjs-no-head-import": nextjsNoHeadImport,
		"nextjs-no-side-effect-in-get-handler": nextjsNoSideEffectInGetHandler,
		"server-auth-actions": serverAuthActions,
		"server-after-nonblocking": serverAfterNonblocking,
		"client-passive-event-listeners": clientPassiveEventListeners,
		"js-combine-iterations": jsCombineIterations,
		"js-tosorted-immutable": jsTosortedImmutable,
		"js-hoist-regexp": jsHoistRegexp,
		"js-min-max-loop": jsMinMaxLoop,
		"js-set-map-lookups": jsSetMapLookups,
		"js-batch-dom-css": jsBatchDomCss,
		"js-index-maps": jsIndexMaps,
		"js-cache-storage": jsCacheStorage,
		"js-early-exit": jsEarlyExit,
		"async-parallel": asyncParallel,
		"rn-no-raw-text": rnNoRawText,
		"rn-no-deprecated-modules": rnNoDeprecatedModules,
		"rn-no-legacy-expo-packages": rnNoLegacyExpoPackages,
		"rn-no-dimensions-get": rnNoDimensionsGet,
		"rn-no-inline-flatlist-renderitem": rnNoInlineFlatlistRenderitem,
		"rn-no-legacy-shadow-styles": rnNoLegacyShadowStyles,
		"rn-prefer-reanimated": rnPreferReanimated,
		"rn-no-single-element-style-array": rnNoSingleElementStyleArray
	}
};

//#endregion
export { plugin as default };
//# sourceMappingURL=react-doctor-plugin.js.map