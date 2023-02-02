import {
  Node,
  SyntaxKind,
  ParameterDeclaration,
  SourceFile,
  Type
} from 'ts-morph'
import {
  TSDocParser,
  ParserContext,
  DocNode,
  DocExcerpt
} from '@microsoft/tsdoc'

const tsdocParser: TSDocParser = new TSDocParser()

export type Parameter = {
  name: string
  returnType: string
}

export type Member = {
  name: string
  parameters: Parameter[]
  callSignature: string
  returnType: string
}

export type TypeInfo = {
  name: string
  type: string
  description: string
  callSignatures: string[]
  parameters: Parameter[]
  properties: Member[]
  methods: Member[]
  returnType: string
  example: string
}

const renderDocNode = (docNode: DocNode): string => {
  let result: string = ''
  if (docNode) {
    if (docNode instanceof DocExcerpt) {
      result += docNode.content.toString()
    }
    for (const childNode of docNode.getChildNodes()) {
      result += renderDocNode(childNode)
    }
  }
  return result
}

const getTypeName = (node: Node): string => {
  let type = node.getType().getText()
  node.forEachDescendant(item => {
    if (Node.isTypeReference(item)) {
      type = item.getText()
    }
  })

  return type
}

const getPropertySignature = (node: Node): Member | undefined => {
  if (!Node.isPropertySignature(node)) {
    return
  }

  const name = node.getName()
  const returnType = getTypeName(node)

  return {
    name,
    parameters: [],
    callSignature: `${name}: ${returnType}`,
    returnType
  }
}

const getParametersSignature = (node: ParameterDeclaration): Member => {
  return {
    name: node.getName(),
    parameters: [],
    callSignature: '',
    returnType: getTypeName(node)
  }
}

const trim = (input: string, pattern: string): string => {
  const rtrim = new RegExp(pattern + '\n+$')
  const ltrim = new RegExp('^[' + pattern + ']*')
  input = input.replace(ltrim, '')
  input = input.replace(rtrim, '')
  return input
}

const getDescription = (node: Node): string => {
  const parserContext: ParserContext = tsdocParser.parseString(
    node.getFullText()
  )
  const output = renderDocNode(parserContext.docComment.summarySection) || ''
  return trim(output, '\n')
}

const getExample = (node: Node): string => {
  const parserContext: ParserContext = tsdocParser.parseString(
    node.getFullText()
  )
  const block = parserContext.docComment.customBlocks
    .filter(b => b.blockTag.tagName === '@example')
    .pop()

  let output = ''
  if (block) output = renderDocNode(block.content)
  return trim(output, '\n')
}

const getType = (node: Node): TypeInfo | undefined => {
  if (!Node.isTypeAliasDeclaration(node)) {
    return
  }

  const getMember = (node: Node): Member | undefined => {
    if (!Node.isCallSignatureDeclaration(node)) {
      return
    }

    const parameters = node.getParameters().map(getParametersSignature)
    const returnType = getTypeName(node)
    const callSignature = `(${parameters
      .map(p => `${p.name}: ${p.returnType}`)
      .join(', ')}): ${returnType}`

    return {
      name: 'anonymous',
      parameters,
      callSignature,
      returnType
    }
  }

  if (!Node.isTypeAliasDeclaration(node)) {
    return
  }

  const description = getDescription(node)
  const example = getExample(node)
  let parameters: Parameter[] = []
  const callSignatures: string[] = []
  let properties: Member[] = []
  let methods: Member[] = []
  let returnType = 'unknown'
  node.forEachDescendant(node => {
    const kind = node.getKind()
    if (kind === SyntaxKind.CallSignature) {
      const method = getMember(node)
      if (method) {
        // fill parameters
        parameters = method.parameters.reduce((acc, curr) => {
          const hasParam = acc.find(el => el.name === curr.name)
          if (!hasParam) acc.push(curr)
          return acc
        }, new Array<Parameter>())

        // fill callSignatures
        callSignatures.push(method.callSignature)

        returnType = method.returnType
      }
    }

    if (kind === SyntaxKind.PropertySignature) {
      const property = getPropertySignature(node)
      if (property) properties.push(property)
    }
  })

  methods = properties.filter(p => p.returnType.endsWith('Function'))
  properties = properties.filter(p => !p.returnType.endsWith('Function'))

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
  }
}

const getFunction = (node: Node): TypeInfo | undefined => {
  if (!Node.isFunctionDeclaration(node)) {
    return
  }

  const name = node.getName() || 'unknown'
  const description = getDescription(node)
  const parameters = node.getParameters().map(getParametersSignature)
  const returnType =
    node.getReturnType().getAliasSymbol()?.getEscapedName() || 'unknown'
  const callSignatures = parameters.map(
    p => `${name}(${p?.name}: ${p?.returnType}): ${returnType}`
  )
  const example = getExample(node)

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
  }
}

export type Definitions = {
  functions: TypeInfo[]
  types: TypeInfo[]
}

const parse = (source: SourceFile): Definitions => {
  const types: TypeInfo[] = []
  const functions: TypeInfo[] = []

  source.forEachDescendant((node, traversal) => {
    const kind = node.getKind()
    if (kind === SyntaxKind.TypeAliasDeclaration) {
      const type = getType(node)
      if (type) types.push(type)
      traversal.skip()
    }

    if (kind === SyntaxKind.FunctionDeclaration) {
      const fn = getFunction(node)
      if (fn) functions.push(fn)
      traversal.skip()
    }

    return undefined
  })

  return {
    types,
    functions
  }
}

export { parse }
