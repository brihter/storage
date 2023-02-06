'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toMembers = void 0
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
const describe = (members, typeLookup) => {
  const renderOne = type => {
    return render(`
      ### ${type.name}

      \`${type.name}: ${type.returnType} \`

      ${type.description}

      ${also(type, typeLookup)}
    `)
  }
  return members.map(renderOne).join('\n')
}
const toMembers = (title, members, typeLookup) => {
  if (members.length === 0) {
    return ''
  }
  return render(`
    ## ${title}

    ${describe(members, typeLookup)}
  `)
}
exports.toMembers = toMembers
