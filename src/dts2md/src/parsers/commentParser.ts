import { Node } from 'ts-morph'

import { TSDocParser, DocNode, DocExcerpt } from '@microsoft/tsdoc'

const parser = new TSDocParser()

const trim = (input: string, pattern: string): string => {
  const rtrim = new RegExp(pattern + '+$')
  const ltrim = new RegExp('^[' + pattern + ']*')
  input = input.replace(ltrim, '')
  input = input.replace(rtrim, '')
  return input
}

const render = (docNode: DocNode): string => {
  let result = ''
  if (docNode) {
    if (docNode instanceof DocExcerpt) {
      result += docNode.content.toString()
    }
    for (const childNode of docNode.getChildNodes()) {
      result += render(childNode)
    }
  }
  return result
}

const getDescription = (node: Node): string => {
  const ctx = parser.parseString(node.getFullText())
  const output = render(ctx.docComment.summarySection) || ''
  return trim(output, '\n')
}

const getParameterDescription = (node: Node, parameterName: string): string => {
  const ctx = parser.parseString(node.getFullText())
  return ctx.docComment.params.blocks
    .filter(block => block.parameterName === parameterName)
    .map(block => trim(render(block.content), '\n'))
    .join('\n')
}

const getReturnsDescription = (node: Node): string => {
  const ctx = parser.parseString(node.getFullText())
  if (!ctx.docComment.returnsBlock) return ''
  let output = render(ctx.docComment.returnsBlock.content)
  output = trim(output, '\n')
  output = output.trim()
  return output
}

const getExample = (node: Node): string => {
  const ctx = parser.parseString(node.getFullText())
  const block = ctx.docComment.customBlocks
    .filter(b => b.blockTag.tagName === '@example')
    .pop()

  let output = ''
  if (block) output = render(block.content)
  return trim(output, '\n')
}

export {
  getDescription,
  getParameterDescription,
  getExample,
  getReturnsDescription
}
