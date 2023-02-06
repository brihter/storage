'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Formatter = void 0
const Formatter = types => {
  const typeLookup = types.reduce(
    (acc, type) => acc.set(type.name, type),
    new Map()
  )
  const isTypeUserDefined = type => {
    return typeLookup.has(type)
  }
  const formatReturnType = type => {
    if (!isTypeUserDefined(type)) {
      return type
    }
    return `[${type}](${type}.md)`
  }
  const toParameters = parameters => {
    const formatParameter = p =>
      `- \`${p.name}: ${formatReturnType(p.returnType)}\``
    const formatSeeAlso = type => `[${type}](${type}.md)`
    if (parameters.length === 0) return ''
    const formattedParams = parameters.map(formatParameter).join('\n')
    const formattedSeeAlso = parameters
      .map(p => p.name)
      .filter(isTypeUserDefined)
      .map(formatSeeAlso)
      .join(', ')
    return `
## Constructor:

${formattedParams}

See also: ${formattedSeeAlso}
    `
  }
  const toProperties = properties => {
    const formatDescription = description =>
      description.length === 0 ? '' : ` - ${description}`
    if (properties.length === 0) {
      return ''
    }
    const formatOne = p =>
      `- ${p.name}: ${formatReturnType(p.returnType)}${formatDescription(
        p.description
      )}`
    return `
## Properties:

${properties.map(formatOne).join('\n')}
    `
  }
  const toReturn = returnType => {
    if (returnType.length === 0) {
      return ''
    }
    return `
## Returns:

- ${formatReturnType(returnType)}
    `
  }
  const toExample = example => {
    if (example.length === 0) {
      return ''
    }
    return `
## Example:

${example}
    `
  }
  const formatType = type => {
    return `
# ${type.name}

${type.description}

${toParameters(type.parameters)}
${toProperties(type.properties)}
${toReturn(type.returnType)}
${toExample(type.example)}
    `
  }
  return {
    formatType
  }
}
exports.Formatter = Formatter
