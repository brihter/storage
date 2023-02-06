'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toReturns = void 0
const render = tpl =>
  tpl
    .split('\n')
    .map(v => v.trimStart())
    .join('\n')
const also = (type, typeLookup) => {
  if (!typeLookup.has(type.returnType)) {
    return ''
  }
  return `See also: [${type.returnType}](${type.returnType}.md)`
}
const toReturns = (type, typeLookup) => {
  if (type.type !== 'Function') {
    return ''
  }
  return render(`
    ## Returns

    \`${type.returnType} \`

    ${also(type, typeLookup)}
  `)
}
exports.toReturns = toReturns
