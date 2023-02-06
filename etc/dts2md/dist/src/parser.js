'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parse = exports.TypeInfo = void 0
const ts_morph_1 = require('ts-morph')
const commentParser_1 = require('./parsers/commentParser')
class TypeInfo {
  constructor(opts) {
    opts = Object.assign(
      {
        description: '',
        example: '',
        name: '',
        returnType: '',
        parameters: [],
        properties: []
      },
      opts
    )
    this.description = opts.description || ''
    this.example = opts.example || ''
    this.name = opts.name || ''
    this.returnType = opts.returnType || ''
    this.parameters = opts.parameters || []
    this.properties = opts.properties || []
  }
}
exports.TypeInfo = TypeInfo
const getReturnType = node => {
  const type = node.getType()
  const aliasSymbol = type.getAliasSymbol()
  if (aliasSymbol) {
    return aliasSymbol.getEscapedName()
  }
  // console.log('---')
  // console.log('aliasSymbol:' + node.getType().getAliasSymbol()?.getEscapedName())
  // console.log('text:' + node.getType().getText(node))
  // console.log('---')
  return node.getType().getText(node)
}
const getParameter = node => {
  return new TypeInfo({
    name: node.getName(),
    returnType: getReturnType(node)
  })
}
const getProperty = node => {
  return new TypeInfo({
    description: (0, commentParser_1.getDescription)(node),
    example: (0, commentParser_1.getExample)(node),
    name: node.getName(),
    returnType: getReturnType(node)
  })
}
const getCallSignature = node => {
  const parameters = node.getParameters().map(getParameter)
  const returnType = node.getReturnType().getText(node)
  const callSignature = `(${parameters
    .map(p => `${p.name}: ${p.returnType}`)
    .join(', ')})`
  return new TypeInfo({
    name: callSignature,
    parameters,
    returnType
  })
}
const getTypeLiteral = node => {
  return new TypeInfo({
    parameters: node
      .getMembers()
      .filter(ts_morph_1.Node.isCallSignatureDeclaration)
      .map(getCallSignature),
    properties: node
      .getMembers()
      .filter(ts_morph_1.Node.isPropertySignature)
      .map(getProperty)
  })
}
const getFunction = node => {
  return new TypeInfo({
    name: node.getName() || 'anonymous',
    description: (0, commentParser_1.getDescription)(node),
    example: (0, commentParser_1.getExample)(node),
    parameters: node.getParameters().map(getParameter),
    returnType: node.getReturnType().getText(node)
  })
}
const getTypeAlias = node => {
  let typeLiteral = new TypeInfo()
  node.forEachDescendant((node, traversal) => {
    if (ts_morph_1.Node.isTypeLiteral(node)) {
      typeLiteral = getTypeLiteral(node)
      traversal.skip()
    }
    return undefined
  })
  return new TypeInfo({
    name: node.getName(),
    description: (0, commentParser_1.getDescription)(node),
    example: (0, commentParser_1.getExample)(node),
    parameters: typeLiteral.parameters,
    properties: typeLiteral.properties,
    returnType: getReturnType(node)
  })
}
const getTypeInfo = node => {
  if (ts_morph_1.Node.isTypeAliasDeclaration(node)) {
    return getTypeAlias(node)
  }
  if (ts_morph_1.Node.isFunctionDeclaration(node)) {
    return getFunction(node)
  }
}
const parse = source => {
  const types = []
  source.forEachDescendant((node, traversal) => {
    const typeInfo = getTypeInfo(node)
    if (typeInfo) {
      types.push(typeInfo)
      traversal.skip()
    }
    return undefined
  })
  return types
}
exports.parse = parse
