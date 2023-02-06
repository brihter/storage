'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getDescription = void 0
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
  const parserContext = parser.parseString(node.getFullText())
  const output = render(parserContext.docComment.summarySection) || ''
  return trim(output, '\n')
}
exports.getDescription = getDescription
