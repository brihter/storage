import { Definitions, TypeInfo, Parameter } from './parser'

const toParameterList = (parameters: Parameter[]): string => {
  const list = parameters
    .map(p => `- \`${p.name}: ${p.returnType}\``)
    .join('\n')
  return `
Parameters:

${list}
`
}

const toReturn = (type: string): string => {
  return `
Returns:

- \`${type}\`
`
}

const toExample = (input: string): string => {
  return `
Example:

${input}
`
}

// const flatten = () => {

// }

const format = (definitions: Definitions): string => {
  const constructor = definitions.functions
    .filter(f => f.name === 'Storage')
    .pop()

  const contract = definitions.types
    .filter(t => t.name === 'StorageProvider')
    .pop()

  const types = definitions.types.reduce(
    (acc, type) => acc.set(type.name, type),
    new Map<string, TypeInfo>()
  )

  // console.log(constructor)
  // console.log(types.get('RemoveFunction'))
  // console.log(types.get('RemoveFunctionOpts'))

  if (!constructor) return ''
  if (!contract) return ''

  return `
## Documentation

### Index

Constructors

- [${constructor.name}](#constructor)

Properties

${contract.properties.map(v => `- [${v.name}](#${v.name})`).join('\n')}

Methods

${contract.methods.map(v => `- [${v.name}](#${v.name})`).join('\n')}

### Constructors

#### constructor

${constructor.callSignatures.map(v => `- \`${v}\``).join('\n')}

${constructor.description}
${toParameterList(constructor.parameters)}
${toReturn(constructor.returnType)}
${toExample(constructor.example)}

### Properties

${contract.properties
  .map(
    p => `
#### ${p.name}

- \`${p.callSignature}\`

`
  )
  .join('\n')}

### Methods

${contract.methods
  .map(m => {
    const type = types.get(m.returnType)
    if (!type) return ''

    return `#### ${m.name}

${type?.callSignatures
  .map(signature => `- \`${m.name}${signature}\``)
  .join('\n')}

${type.description}
${toParameterList(type.parameters)}
${toReturn(type.returnType)}
${toExample(type.example)}
`
  })
  .join('\n')}
`
}

export { format }
