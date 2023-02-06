'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toIndex = void 0
const render = tpl =>
  tpl
    .split('\n')
    .map(v => v.trimStart())
    .join('\n')
const list = members => members.map(t => `- [${t.name}](#${t.name})`).join('\n')
const section = (sectionName, members) => {
  if (members.length === 0) {
    return ''
  }
  return render(`
    ### ${sectionName}

    ${list(members)}
  `)
}
const toIndex = type => {
  return render(`
    ## Index

    ${section('Parameters', type.parameters)}
    ${section('Properties', type.properties)}
    ${section('Methods', type.methods)}
  `)
}
exports.toIndex = toIndex
