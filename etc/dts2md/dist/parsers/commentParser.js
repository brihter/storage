'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getReturnsDescription =
  exports.getExample =
  exports.getParameterDescription =
  exports.getDescription =
    void 0
const tsdoc_1 = require('@microsoft/tsdoc')
const parser = new tsdoc_1.TSDocParser()
const trim = (input, pattern) => {
  const rtrim = new RegExp(pattern + '+$')
  const ltrim = new RegExp('^[' + pattern + ']*')
  input = input.replace(ltrim, '')
  input = input.replace(rtrim, '')
  return input
}
const render = docNode => {
  let result = ''
  if (docNode) {
    if (docNode instanceof tsdoc_1.DocExcerpt) {
      result += docNode.content.toString()
    }
    for (const childNode of docNode.getChildNodes()) {
      result += render(childNode)
    }
  }
  return result
}
const getDescription = node => {
  const ctx = parser.parseString(node.getFullText())
  const output = render(ctx.docComment.summarySection) || ''
  return trim(output, '\n')
}
exports.getDescription = getDescription
const getParameterDescription = (node, parameterName) => {
  const ctx = parser.parseString(node.getFullText())
  return ctx.docComment.params.blocks
    .filter(block => block.parameterName === parameterName)
    .map(block => trim(render(block.content), '\n'))
    .join('\n')
}
exports.getParameterDescription = getParameterDescription
const getReturnsDescription = node => {
  const ctx = parser.parseString(node.getFullText())
  if (!ctx.docComment.returnsBlock) return ''
  let output = render(ctx.docComment.returnsBlock.content)
  output = trim(output, '\n')
  output = output.trim()
  return output
}
exports.getReturnsDescription = getReturnsDescription
const getExample = node => {
  const ctx = parser.parseString(node.getFullText())
  const block = ctx.docComment.customBlocks
    .filter(b => b.blockTag.tagName === '@example')
    .pop()
  let output = ''
  if (block) output = render(block.content)
  return trim(output, '\n')
}
exports.getExample = getExample
