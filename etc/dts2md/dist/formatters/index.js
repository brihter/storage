'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toIndex = void 0
const render = tpl =>
  tpl
    .split('\n')
    .map(v => v.trimStart())
    .join('\n')
const list = members => members.map(t => `- [${t.name}](#${t.name})`).join('\n')
// TODO check might need to render a few of them (for function type aliases)
const constructor = type => {
  if (type.type !== 'Function') {
    return ''
  }
  return render(`
    ### Constructors

    - [${type.name}](#Constructors)
  `)
}
const members = (membersName, members) => {
  if (members.length === 0) {
    return ''
  }
  return render(`
    ### ${membersName}

    ${list(members)}
  `)
}
// const returns = (type: TypeInfo) : string => {
//   if (type.type !== 'Function') {
//     return ''
//   }
//   return render(`
//     ### Returns
//     - [${type.returnType}](#Returns)
//   `)
// }
const toIndex = type => {
  return render(`
    ## Index

    ${constructor(type)}
    ${members('Properties', type.properties)}
    ${members('Methods', type.methods)}
  `)
}
exports.toIndex = toIndex
