import {
  Node,
  ParameterDeclaration,
  SourceFile,
  TypeAliasDeclaration,
  FunctionDeclaration,
  TypeLiteralNode,
  PropertySignature,
  CallSignatureDeclaration,
  Type
} from 'ts-morph'

import {
  getDescription,
  getParameterDescription,
  getReturnsDescription,
  getExample
} from './parsers/commentParser'

type TypeInfoOpts = {
  type?: string
  description?: string
  example?: string
  name?: string
  valueType?: string
  returnType?: TypeInfo
  parameters?: TypeInfo[]
  properties?: TypeInfo[]
  methods?: TypeInfo[]
}

class TypeInfo {
  type: string
  description: string
  example: string
  name: string
  valueType: string
  returnType?: TypeInfo
  parameters: TypeInfo[]
  properties: TypeInfo[]
  methods: TypeInfo[]

  constructor(opts?: TypeInfoOpts) {
    opts = Object.assign(
      {
        type: '',
        description: '',
        example: '',
        name: '',
        valueType: '',
        returnType: '',
        parameters: [],
        properties: [],
        methods: []
      },
      opts
    )

    this.type = opts.type || ''
    this.description = opts.description || ''
    this.example = opts.example || ''
    this.name = opts.name || ''
    this.valueType = opts.valueType || ''
    this.returnType = opts.returnType
    this.parameters = opts.parameters || []
    this.properties = opts.properties || []
    this.methods = opts.methods || []
  }
}

const getNodeType = (nodeType: Type, parentNode: Node): TypeInfo => {
  let valueType = nodeType.getText()
  if (nodeType.getAliasSymbol()) {
    valueType = nodeType.getAliasSymbol()?.getEscapedName() || valueType
  }

  const result = new TypeInfo({
    valueType
  })

  let prevPtr = result
  let ptr = result
  parentNode.forEachDescendant((node, traversal) => {
    if (node.getType() !== nodeType) {
      traversal.skip()
    }

    if (Node.isAnyKeyword(node)) {
      ptr.valueType = 'any'
      ptr.description = getReturnsDescription(parentNode)
      traversal.skip()
    }

    if (Node.isTypeReference(node)) {
      ptr.valueType = node.getText()
      ptr.description = getReturnsDescription(parentNode)
      ptr.returnType = new TypeInfo()
      prevPtr = ptr
      ptr = ptr.returnType
    }

    return undefined
  })

  delete prevPtr.returnType

  return result
}

const getParameter = (
  parameterNode: ParameterDeclaration,
  node: Node
): TypeInfo => {
  const name = parameterNode.getName()

  return new TypeInfo({
    type: 'Parameter',
    name,
    description: getParameterDescription(node, name),
    valueType: getNodeType(parameterNode.getType(), parameterNode).valueType
  })
}

const getProperty = (node: PropertySignature): TypeInfo => {
  return new TypeInfo({
    type: 'Property',
    description: getDescription(node),
    example: getExample(node),
    name: node.getName(),
    valueType: getNodeType(node.getType(), node).valueType
  })
}

const getCallSignature = (node: CallSignatureDeclaration): TypeInfo => {
  const parameters = node
    .getParameters()
    .map(parameterNode => getParameter(parameterNode, node))
  return new TypeInfo({
    parameters,
    returnType: getNodeType(node.getReturnType(), node)
  })
}

const getTypeLiteral = (node: TypeLiteralNode, types: TypeInfo[]): TypeInfo => {
  const typesLookup = types.reduce((acc, type) => {
    const types = acc.get(type.name) || []
    types.push(type)
    return acc.set(type.name, types)
  }, new Map<string, TypeInfo[]>())

  const members = node
    .getMembers()
    .filter(Node.isPropertySignature)
    .map(getProperty)

  const properties = members.filter(m => {
    const type = typesLookup.get(m.valueType)
    if (!type) {
      return true
    }

    const isFunction = type.reduce((acc, curr) => {
      if (acc === true) return acc
      if (curr.parameters.length > 0) acc = true
      return acc
    }, false)

    return !isFunction
  })

  const methods = members.filter(m => {
    const type = typesLookup.get(m.valueType)
    if (!type) {
      return false
    }

    const isFunction = type.reduce((acc, curr) => {
      if (acc === true) return acc
      if (curr.parameters.length > 0) acc = true
      return acc
    }, false)

    return isFunction
  })

  return new TypeInfo({
    parameters: node
      .getMembers()
      .filter(Node.isCallSignatureDeclaration)
      .map(getCallSignature),
    properties,
    methods
  })
}

const getFunction = (node: FunctionDeclaration): TypeInfo => {
  return new TypeInfo({
    type: 'Function',
    name: node.getName() || 'anonymous',
    description: getDescription(node),
    example: getExample(node),
    parameters: node
      .getParameters()
      .map(parameterNode => getParameter(parameterNode, node)),
    returnType: getNodeType(node.getReturnType(), node)
  })
}

const getTypeAlias = (
  node: TypeAliasDeclaration,
  types: TypeInfo[]
): TypeInfo[] => {
  let typeLiteral: TypeInfo = new TypeInfo()
  node.forEachDescendant((node, traversal) => {
    if (Node.isTypeLiteral(node)) {
      typeLiteral = getTypeLiteral(node, types)
      traversal.skip()
    }
    return undefined
  })

  if (typeLiteral.parameters.length === 0) {
    // type alias
    return [
      new TypeInfo({
        type: 'TypeAlias',
        name: node.getName(),
        description: getDescription(node),
        example: getExample(node),
        properties: typeLiteral.properties,
        methods: typeLiteral.methods
      })
    ]
  } else {
    // function type alias
    return typeLiteral.parameters.map(
      parameter =>
        new TypeInfo({
          type: 'TypeAlias',
          name: node.getName(),
          description: getDescription(node),
          example: getExample(node),
          parameters: parameter.parameters,
          returnType: parameter.returnType
        })
    )
  }
}

const getTypeInfo = (node: Node, types: TypeInfo[]): TypeInfo[] => {
  if (Node.isTypeAliasDeclaration(node)) {
    return getTypeAlias(node, types)
  }

  if (Node.isFunctionDeclaration(node)) {
    return [getFunction(node)]
  }

  return []
}

const parse = (source: SourceFile): TypeInfo[] => {
  const types: TypeInfo[] = []

  source.forEachDescendant((node, traversal) => {
    const typeInfo = getTypeInfo(node, types)
    if (typeInfo.length > 0) {
      types.push(...typeInfo)
      traversal.skip()
    }
    return undefined
  })

  return types
}

export { TypeInfo, parse }
