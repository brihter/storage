import { TypeInfo } from '../parser'

const TypeFormatter = (typesLookup: Map<string, TypeInfo[]>) => {
  const render = (tpl: string): string =>
    tpl
      .split('\n')
      .map(v => v.trimStart())
      .join('\n')

  const see = (members: TypeInfo[]): string => {
    const traverse = (types: TypeInfo[], visit: Function) => {
      types.forEach(type => {
        if (type.valueType.length > 0) {
          visit(type)
        }

        if (type.returnType) {
          visit(type.returnType)
          traverse([type.returnType], visit)
        }
      })
    }

    const types: string[] = []
    traverse(members, (returnType: TypeInfo) => {
      types.push(returnType.valueType)
    })

    const customTypes = Array.from(new Set(types))
      .filter(t => t.length > 0)
      .filter(t => typesLookup.has(t))

    if (customTypes.length === 0) {
      return ''
    }

    return (
      'See: ' +
      customTypes.map(typeName => `[${typeName}](${typeName}.md)`).join(', ')
    )
  }

  const getTitle = (typeDefinitions: TypeInfo[]): string =>
    typeDefinitions.reduce((_, type) => `# ${type.name}\n`, '')

  const getDescription = (typeDefinitions: TypeInfo[]): string =>
    typeDefinitions.reduce((_, type) => type.description, '')

  const hasParameters = (typeDefinitions: TypeInfo[]): boolean =>
    typeDefinitions.reduce((acc, type) => {
      if (acc === true) return acc
      acc = type.parameters.length > 0
      return acc
    }, false)

  const hasProperties = (typeDefinitions: TypeInfo[]): boolean =>
    typeDefinitions.reduce((acc, type) => {
      if (acc === true) return acc
      acc = type.properties.length > 0
      return acc
    }, false)

  const hasMethods = (typeDefinitions: TypeInfo[]): boolean =>
    typeDefinitions.reduce((acc, type) => {
      if (acc === true) return acc
      acc = type.methods.length > 0
      return acc
    }, false)

  const hasExample = (typeDefinitions: TypeInfo[]): boolean =>
    typeDefinitions.reduce((acc, type) => {
      if (acc === true) return acc
      acc = type.example.length > 0
      return acc
    }, false)

  const getIndex = (typeDefinitions: TypeInfo[]): string => {
    const constructors = (): string => {
      if (!hasParameters(typeDefinitions)) return ''

      const list = () =>
        typeDefinitions
          .map(type => {
            const name = `${type.name}(${type.parameters
              .map(p => p.name)
              .join(', ')})`
            const nameAnchor = `${type.name}(${type.parameters
              .map(p => `${p.name}: ${p.valueType}`)
              .join(', ')})`
            let anchor = nameAnchor.toLowerCase()
            anchor = anchor.replace(/\(|\)|\:|\,|\|/g, '')
            anchor = anchor.replace(/\s/g, '-')
            return `- [${name}](#${anchor})`
          })
          .join('\n')

      return render(`
        Constructors:
  
        ${list()}
      `)
    }

    const properties = (): string => {
      if (!hasProperties(typeDefinitions)) return ''

      const properties = typeDefinitions
        .flatMap(t => t.properties)
        .map(p => p.name)

      const list = () =>
        Array.from(new Set(properties))
          .map(v => `- [${v}](#${v})`)
          .join('\n')

      return render(`
        Properties:
  
        ${list()}
      `)
    }

    const methods = (): string => {
      if (!hasMethods(typeDefinitions)) return ''

      const methods = typeDefinitions.flatMap(t => t.methods).map(p => p.name)

      const list = () =>
        Array.from(new Set(methods))
          .map(v => `- [${v}](#${v})`)
          .join('\n')

      return render(`
        Methods:
  
        ${list()}
      `)
    }

    return render(`
      ${getTitle(typeDefinitions)}
  
      ${getDescription(typeDefinitions)}
  
      ## Index
  
      ${constructors()}
      ${properties()}
      ${methods()}
    `)
  }

  const getConstructors = (typeDefinitions: TypeInfo[]): string => {
    if (!hasParameters(typeDefinitions)) return ''

    const signatures = typeDefinitions.map(t => {
      return {
        name: t.name,
        parameters: t.parameters
          .map(p => `${p.name}: ${p.valueType}`)
          .join(', '),

        returnType: t.returnType?.valueType
      }
    })

    const list = () =>
      Array.from(new Set(signatures))
        .map(
          signature =>
            `- \`${signature.name}(${signature.parameters}): ${signature.returnType}\``
        )
        .join('\n')

    const describeOne = (type: TypeInfo): string => {
      let returns = ''
      returns += `- \`${type.returnType?.valueType}\``
      if (
        type.returnType?.description &&
        type.returnType?.description.length > 0
      ) {
        returns += `- ${type.returnType?.description}`
      }

      return render(`
        #### ${type.name}(${type.parameters
        .map(p => `${p.name}: ${p.valueType}`)
        .join(', ')})
  
        Parameters:
        
        ${type.parameters
          .map(p => {
            let output = ''
            const signature = `\`${p.name}: ${p.valueType}\``
            if (p.description.length > 0) {
              output = `- ${signature} - ${p.description}`
            } else {
              output = `- ${signature}`
            }
            return output
          })
          .join('\n')}
  
        ${see(type.parameters)}
        
        Returns:
        
        ${returns}
  
        ${see([type])}
      `)
    }

    const describe = () => {
      return typeDefinitions.map(describeOne).join('\n')
    }

    return render(`
      ## Constructors
  
      ${list()}
  
      ${describe()}
    `)
  }

  const getMembers = (
    sectionName: string,
    members: TypeInfo[],
    typeDefinitions: TypeInfo[]
  ): string => {
    const signatures = typeDefinitions.flatMap(t => {
      return members.map(p => `${p.name}: ${p.valueType}`)
    })

    const list = () =>
      Array.from(new Set(signatures))
        .map(signature => `- \`${signature}\``)
        .join('\n')

    const examples = (type: TypeInfo): string => {
      if (type.example.length === 0) return ''
      let output = 'Examples:\n'
      output += '\n'
      output += type.example
      return output
    }

    const describeOne = (type: TypeInfo): string => {
      return render(`
        #### ${type.name}
  
        ${type.description}
  
        ${see([type])}
  
        ${examples(type)}
      `)
    }

    const describe = () => {
      return members.map(describeOne).join('\n')
    }

    if (!hasProperties(typeDefinitions) && sectionName === 'Properties') {
      return ''
    }

    if (!hasMethods(typeDefinitions) && sectionName === 'Methods') {
      return ''
    }

    return render(`
      ## ${sectionName}
  
      ${list()}
  
      ${describe()}
    `)
  }

  const getExamples = (typeDefinitions: TypeInfo[]): string => {
    if (!hasExample(typeDefinitions)) return ''

    const examples = typeDefinitions.map(t => t.example)

    const list = () => Array.from(new Set(examples)).join('\n')

    let output = '## Examples'
    output += `\n\n`
    output += list()
    return output
  }

  const format = (typeDefinitions: TypeInfo[]): string => {
    let output = ''
    output += getIndex(typeDefinitions)
    output += getConstructors(typeDefinitions)
    output += getMembers(
      'Properties',
      typeDefinitions.flatMap(t => t.properties),
      typeDefinitions
    )
    output += getMembers(
      'Methods',
      typeDefinitions.flatMap(t => t.methods),
      typeDefinitions
    )
    output += getExamples(typeDefinitions)
    return output
  }

  const formatIndex = (typeDefinitions: TypeInfo[]): string => {
    return getIndex(typeDefinitions)
  }

  const formatConstructors = (typeDefinitions: TypeInfo[]): string => {
    return getConstructors(typeDefinitions)
  }

  const formatProperties = (typeDefinitions: TypeInfo[]): string => {
    return getMembers(
      'Properties',
      typeDefinitions.flatMap(t => t.properties),
      typeDefinitions
    )
  }

  const formatMethods = (typeDefinitions: TypeInfo[]): string => {
    return getMembers(
      'Methods',
      typeDefinitions.flatMap(t => t.methods),
      typeDefinitions
    )
  }

  const formatExamples = (typeDefinitions: TypeInfo[]): string => {
    return getExamples(typeDefinitions)
  }

  return {
    formatIndex,
    formatConstructors,
    formatProperties,
    formatMethods,
    formatExamples,
    format
  }
}

export { TypeFormatter }
