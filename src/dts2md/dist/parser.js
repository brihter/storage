"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.TypeInfo = void 0;
const ts_morph_1 = require("ts-morph");
const commentParser_1 = require("./parsers/commentParser");
class TypeInfo {
    constructor(opts) {
        opts = Object.assign({
            type: '',
            description: '',
            example: '',
            name: '',
            valueType: '',
            returnType: '',
            parameters: [],
            properties: [],
            methods: []
        }, opts);
        this.type = opts.type || '';
        this.description = opts.description || '';
        this.example = opts.example || '';
        this.name = opts.name || '';
        this.valueType = opts.valueType || '';
        this.returnType = opts.returnType;
        this.parameters = opts.parameters || [];
        this.properties = opts.properties || [];
        this.methods = opts.methods || [];
    }
}
exports.TypeInfo = TypeInfo;
const getNodeType = (nodeType, parentNode) => {
    var _a;
    let valueType = nodeType.getText();
    if (nodeType.getAliasSymbol()) {
        valueType = ((_a = nodeType.getAliasSymbol()) === null || _a === void 0 ? void 0 : _a.getEscapedName()) || valueType;
    }
    const result = new TypeInfo({
        valueType
    });
    let prevPtr = result;
    let ptr = result;
    parentNode.forEachDescendant((node, traversal) => {
        if (node.getType() !== nodeType) {
            traversal.skip();
        }
        if (ts_morph_1.Node.isAnyKeyword(node)) {
            ptr.valueType = 'any';
            ptr.description = (0, commentParser_1.getReturnsDescription)(parentNode);
            traversal.skip();
        }
        if (ts_morph_1.Node.isTypeReference(node)) {
            ptr.valueType = node.getText();
            ptr.description = (0, commentParser_1.getReturnsDescription)(parentNode);
            ptr.returnType = new TypeInfo();
            prevPtr = ptr;
            ptr = ptr.returnType;
        }
        return undefined;
    });
    delete prevPtr.returnType;
    return result;
};
const getParameter = (parameterNode, node) => {
    const name = parameterNode.getName();
    return new TypeInfo({
        type: 'Parameter',
        name,
        description: (0, commentParser_1.getParameterDescription)(node, name),
        valueType: getNodeType(parameterNode.getType(), parameterNode).valueType
    });
};
const getProperty = (node) => {
    return new TypeInfo({
        type: 'Property',
        description: (0, commentParser_1.getDescription)(node),
        example: (0, commentParser_1.getExample)(node),
        name: node.getName(),
        valueType: getNodeType(node.getType(), node).valueType
    });
};
const getCallSignature = (node) => {
    const parameters = node
        .getParameters()
        .map(parameterNode => getParameter(parameterNode, node));
    return new TypeInfo({
        parameters,
        returnType: getNodeType(node.getReturnType(), node)
    });
};
const getTypeLiteral = (node, types) => {
    const typesLookup = types.reduce((acc, type) => {
        const types = acc.get(type.name) || [];
        types.push(type);
        return acc.set(type.name, types);
    }, new Map());
    const members = node
        .getMembers()
        .filter(ts_morph_1.Node.isPropertySignature)
        .map(getProperty);
    const properties = members.filter(m => {
        const type = typesLookup.get(m.valueType);
        if (!type) {
            return true;
        }
        const isFunction = type.reduce((acc, curr) => {
            if (acc === true)
                return acc;
            if (curr.parameters.length > 0)
                acc = true;
            return acc;
        }, false);
        return !isFunction;
    });
    const methods = members.filter(m => {
        const type = typesLookup.get(m.valueType);
        if (!type) {
            return false;
        }
        const isFunction = type.reduce((acc, curr) => {
            if (acc === true)
                return acc;
            if (curr.parameters.length > 0)
                acc = true;
            return acc;
        }, false);
        return isFunction;
    });
    return new TypeInfo({
        parameters: node
            .getMembers()
            .filter(ts_morph_1.Node.isCallSignatureDeclaration)
            .map(getCallSignature),
        properties,
        methods
    });
};
const getFunction = (node) => {
    return new TypeInfo({
        type: 'Function',
        name: node.getName() || 'anonymous',
        description: (0, commentParser_1.getDescription)(node),
        example: (0, commentParser_1.getExample)(node),
        parameters: node
            .getParameters()
            .map(parameterNode => getParameter(parameterNode, node)),
        returnType: getNodeType(node.getReturnType(), node)
    });
};
const getTypeAlias = (node, types) => {
    let typeLiteral = new TypeInfo();
    node.forEachDescendant((node, traversal) => {
        if (ts_morph_1.Node.isTypeLiteral(node)) {
            typeLiteral = getTypeLiteral(node, types);
            traversal.skip();
        }
        return undefined;
    });
    if (typeLiteral.parameters.length === 0) {
        // type alias
        return [
            new TypeInfo({
                type: 'TypeAlias',
                name: node.getName(),
                description: (0, commentParser_1.getDescription)(node),
                example: (0, commentParser_1.getExample)(node),
                properties: typeLiteral.properties,
                methods: typeLiteral.methods
            })
        ];
    }
    else {
        // function type alias
        return typeLiteral.parameters.map(parameter => new TypeInfo({
            type: 'TypeAlias',
            name: node.getName(),
            description: (0, commentParser_1.getDescription)(node),
            example: (0, commentParser_1.getExample)(node),
            parameters: parameter.parameters,
            returnType: parameter.returnType
        }));
    }
};
const getTypeInfo = (node, types) => {
    if (ts_morph_1.Node.isTypeAliasDeclaration(node)) {
        return getTypeAlias(node, types);
    }
    if (ts_morph_1.Node.isFunctionDeclaration(node)) {
        return [getFunction(node)];
    }
    return [];
};
const parse = (source) => {
    const types = [];
    source.forEachDescendant((node, traversal) => {
        const typeInfo = getTypeInfo(node, types);
        if (typeInfo.length > 0) {
            types.push(...typeInfo);
            traversal.skip();
        }
        return undefined;
    });
    return types;
};
exports.parse = parse;
