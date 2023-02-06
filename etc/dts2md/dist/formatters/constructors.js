'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toConstructors = void 0
const render = tpl =>
  tpl
    .split('\n')
    .map(v => v.trimStart())
    .join('\n')
const also = (type, typeLookup) => {
  if (!typeLookup.has(type.returnType)) {
    return ''
  }
  return `See: [${type.returnType}](${type.returnType}.md)`
}
const list = type => {
  const listOne = parameter => {
    return `- ${type.name}(todo: TODO): ${type.returnType}`
  }
  return type.parameters.map(listOne).join('\n')
}
const toConstructors = (type, typeLookup) => {
  if (type.parameters.length === 0) {
    return ''
  }
  return render(`
    ## Constructors

    ${list(type)}
  `)
}
exports.toConstructors = toConstructors
