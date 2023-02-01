"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const ts_morph_1 = require("ts-morph");
const tsdoc_1 = require("@microsoft/tsdoc");
const tsdocParser = new tsdoc_1.TSDocParser();
const renderDocNode = (docNode) => {
    let result = '';
    if (docNode) {
        if (docNode instanceof tsdoc_1.DocExcerpt) {
            result += docNode.content.toString();
        }
        for (const childNode of docNode.getChildNodes()) {
            result += renderDocNode(childNode);
        }
    }
    return result;
};
const getTypeName = (node) => {
    let type = node.getType().getText();
    node.forEachDescendant((item) => {
        if (ts_morph_1.Node.isTypeReference(item)) {
            type = item.getText();
        }
    });
    return type;
};
const getPropertySignature = (node) => {
    if (!ts_morph_1.Node.isPropertySignature(node)) {
        return;
    }
    const name = node.getName();
    const returnType = getTypeName(node);
    return {
        name,
        parameters: [],
        callSignature: `${name}: ${returnType}`,
        returnType
    };
};
const getParametersSignature = (node) => {
    return {
        name: node.getName(),
        parameters: [],
        callSignature: '',
        returnType: getTypeName(node)
    };
};
const trim = (input, pattern) => {
    const rtrim = new RegExp(pattern + '\n+$');
    const ltrim = new RegExp('^[' + pattern + ']*');
    input = input.replace(ltrim, '');
    input = input.replace(rtrim, '');
    return input;
};
const getDescription = (node) => {
    const parserContext = tsdocParser.parseString(node.getFullText());
    const output = renderDocNode(parserContext.docComment.summarySection) || '';
    return trim(output, '\n');
};
const getExample = (node) => {
    const parserContext = tsdocParser.parseString(node.getFullText());
    const block = parserContext.docComment.customBlocks.filter(b => b.blockTag.tagName === '@example').pop();
    let output = '';
    if (block)
        output = renderDocNode(block.content);
    return trim(output, '\n');
};
const getType = (node) => {
    if (!ts_morph_1.Node.isTypeAliasDeclaration(node)) {
        return;
    }
    const getMember = (node) => {
        if (!ts_morph_1.Node.isCallSignatureDeclaration(node)) {
            return;
        }
        const parameters = node.getParameters().map(getParametersSignature);
        const returnType = getTypeName(node);
        const callSignature = `(${parameters.map(p => `${p.name}: ${p.returnType}`).join(', ')}): ${returnType}`;
        return {
            name: 'anonymous',
            parameters,
            callSignature,
            returnType
        };
    };
    if (!ts_morph_1.Node.isTypeAliasDeclaration(node)) {
        return;
    }
    const description = getDescription(node);
    const example = getExample(node);
    let parameters = [];
    const callSignatures = [];
    let properties = [];
    let methods = [];
    let returnType = 'unknown';
    node.forEachDescendant((node) => {
        const kind = node.getKind();
        if (kind === ts_morph_1.SyntaxKind.CallSignature) {
            const method = getMember(node);
            if (method) {
                // fill parameters
                parameters = method.parameters.reduce((acc, curr) => {
                    const hasParam = acc.find((el) => el.name === curr.name);
                    if (!hasParam)
                        acc.push(curr);
                    return acc;
                }, new Array());
                // fill callSignatures
                callSignatures.push(method.callSignature);
                returnType = method.returnType;
            }
        }
        if (kind === ts_morph_1.SyntaxKind.PropertySignature) {
            const property = getPropertySignature(node);
            if (property)
                properties.push(property);
        }
    });
    methods = properties.filter(p => p.returnType.endsWith('Function'));
    properties = properties.filter(p => !p.returnType.endsWith('Function'));
    return {
        name: node.getName(),
        type: node.getKindName(),
        callSignatures,
        description,
        parameters,
        properties,
        methods,
        returnType,
        example
    };
};
const getFunction = (node) => {
    var _a;
    if (!ts_morph_1.Node.isFunctionDeclaration(node)) {
        return;
    }
    const name = node.getName() || 'unknown';
    const description = getDescription(node);
    const parameters = node.getParameters().map(getParametersSignature);
    const returnType = ((_a = node.getReturnType().getAliasSymbol()) === null || _a === void 0 ? void 0 : _a.getEscapedName()) || 'unknown';
    const callSignatures = parameters.map(p => `${name}(${p === null || p === void 0 ? void 0 : p.name}: ${p === null || p === void 0 ? void 0 : p.returnType}): ${returnType}`);
    const example = getExample(node);
    return {
        name,
        type: node.getKindName(),
        description,
        callSignatures,
        parameters,
        properties: [],
        methods: [],
        returnType,
        example
    };
};
const parse = (source) => {
    const types = [];
    const functions = [];
    source.forEachDescendant((node, traversal) => {
        const kind = node.getKind();
        if (kind === ts_morph_1.SyntaxKind.TypeAliasDeclaration) {
            const type = getType(node);
            if (type)
                types.push(type);
            traversal.skip();
        }
        if (kind === ts_morph_1.SyntaxKind.FunctionDeclaration) {
            const fn = getFunction(node);
            if (fn)
                functions.push(fn);
            traversal.skip();
        }
        return undefined;
    });
    return {
        types,
        functions
    };
};
exports.parse = parse;
