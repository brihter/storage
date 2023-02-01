"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const tsdoc_1 = require("@microsoft/tsdoc");
const tsdocParser = new tsdoc_1.TSDocParser();
const project = new ts_morph_1.Project();
project.addSourceFilesAtPaths(process.argv[2]);
const source = project.getSourceFileOrThrow(process.argv[2]);
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
const getPropertySignature = (node) => {
    var _a;
    if (!ts_morph_1.Node.isPropertySignature(node)) {
        return;
    }
    return {
        name: node.getName(),
        returnType: ((_a = node.getType().getAliasSymbol()) === null || _a === void 0 ? void 0 : _a.getName()) || 'unknown'
    };
};
const getParametersSignature = (node) => {
    var _a;
    let returnType = (_a = node.getType().getAliasSymbol()) === null || _a === void 0 ? void 0 : _a.getName();
    if (!returnType)
        returnType = node.getType().getText();
    return {
        name: node.getName(),
        returnType
    };
};
const getDescription = (node) => {
    const parserContext = tsdocParser.parseString(node.getFullText());
    const output = renderDocNode(parserContext.docComment.summarySection) || '';
    return output.replace(/\n+$/, '');
};
const getExample = (node) => {
    const parserContext = tsdocParser.parseString(node.getFullText());
    const block = parserContext.docComment.customBlocks.filter(b => b.blockTag.tagName === '@example').pop();
    if (block)
        return renderDocNode(block.content);
    return '';
};
const getType = (node) => {
    if (!ts_morph_1.Node.isTypeAliasDeclaration(node)) {
        return;
    }
    const getMethod = (node) => {
        if (!ts_morph_1.Node.isCallSignatureDeclaration(node)) {
            return;
        }
        const parameters = node.getParameters().map(getParametersSignature);
        const returnType = node.getReturnType().getText();
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
    const properties = [];
    const methods = [];
    let returnType = 'unknown';
    node.forEachDescendant((node) => {
        const kind = node.getKind();
        if (kind === ts_morph_1.SyntaxKind.CallSignature) {
            const method = getMethod(node);
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
const output = [
    // ...types.filter(t => t.name === 'ListFunction'),
    // ...types.filter(t => t.name === 'StorageProvider'),
    ...functions
];
console.log(JSON.stringify(output, null, 4));
