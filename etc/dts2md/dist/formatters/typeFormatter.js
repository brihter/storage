"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeFormatter = void 0;
const TypeFormatter = (typesLookup) => {
    const render = (tpl) => tpl
        .split('\n')
        .map(v => v.trimStart())
        .join('\n');
    const see = (members) => {
        const traverse = (types, visit) => {
            types.forEach(type => {
                if (type.valueType.length > 0) {
                    visit(type);
                }
                if (type.returnType) {
                    visit(type.returnType);
                    traverse([type.returnType], visit);
                }
            });
        };
        const types = [];
        traverse(members, (returnType) => {
            types.push(returnType.valueType);
        });
        const customTypes = Array.from(new Set(types))
            .filter(t => t.length > 0)
            .filter(t => typesLookup.has(t));
        if (customTypes.length === 0) {
            return '';
        }
        return ('See: ' +
            customTypes.map(typeName => `[${typeName}](${typeName}.md)`).join(', '));
    };
    const getTitle = (typeDefinitions) => typeDefinitions.reduce((_, type) => `# ${type.name}\n`, '');
    const getDescription = (typeDefinitions) => typeDefinitions.reduce((_, type) => type.description, '');
    const hasParameters = (typeDefinitions) => typeDefinitions.reduce((acc, type) => {
        if (acc === true)
            return acc;
        acc = type.parameters.length > 0;
        return acc;
    }, false);
    const hasProperties = (typeDefinitions) => typeDefinitions.reduce((acc, type) => {
        if (acc === true)
            return acc;
        acc = type.properties.length > 0;
        return acc;
    }, false);
    const hasMethods = (typeDefinitions) => typeDefinitions.reduce((acc, type) => {
        if (acc === true)
            return acc;
        acc = type.methods.length > 0;
        return acc;
    }, false);
    const hasExample = (typeDefinitions) => typeDefinitions.reduce((acc, type) => {
        if (acc === true)
            return acc;
        acc = type.example.length > 0;
        return acc;
    }, false);
    const getIndex = (typeDefinitions) => {
        const constructors = () => {
            if (!hasParameters(typeDefinitions))
                return '';
            const list = () => typeDefinitions
                .map(type => {
                const name = `${type.name}(${type.parameters
                    .map(p => p.name)
                    .join(', ')})`;
                const nameAnchor = `${type.name}(${type.parameters
                    .map(p => `${p.name}: ${p.valueType}`)
                    .join(', ')})`;
                let anchor = nameAnchor.toLowerCase();
                anchor = anchor.replace(/\(|\)|\:|\,|\|/g, '');
                anchor = anchor.replace(/\s/g, '-');
                return `- [${name}](#${anchor})`;
            })
                .join('\n');
            return render(`
        Constructors:
  
        ${list()}
      `);
        };
        const properties = () => {
            if (!hasProperties(typeDefinitions))
                return '';
            const properties = typeDefinitions
                .flatMap(t => t.properties)
                .map(p => p.name);
            const list = () => Array.from(new Set(properties))
                .map(v => `- [${v}](#${v})`)
                .join('\n');
            return render(`
        Properties:
  
        ${list()}
      `);
        };
        const methods = () => {
            if (!hasMethods(typeDefinitions))
                return '';
            const methods = typeDefinitions.flatMap(t => t.methods).map(p => p.name);
            const list = () => Array.from(new Set(methods))
                .map(v => `- [${v}](#${v})`)
                .join('\n');
            return render(`
        Methods:
  
        ${list()}
      `);
        };
        return render(`
      ${getTitle(typeDefinitions)}
  
      ${getDescription(typeDefinitions)}
  
      ## Index
  
      ${constructors()}
      ${properties()}
      ${methods()}
    `);
    };
    const getConstructors = (typeDefinitions) => {
        if (!hasParameters(typeDefinitions))
            return '';
        const signatures = typeDefinitions.map(t => {
            var _a;
            return {
                name: t.name,
                parameters: t.parameters
                    .map(p => `${p.name}: ${p.valueType}`)
                    .join(', '),
                returnType: (_a = t.returnType) === null || _a === void 0 ? void 0 : _a.valueType
            };
        });
        const list = () => Array.from(new Set(signatures))
            .map(signature => `- \`${signature.name}(${signature.parameters}): ${signature.returnType}\``)
            .join('\n');
        const describeOne = (type) => {
            var _a, _b, _c, _d;
            let returns = '';
            returns += `- \`${(_a = type.returnType) === null || _a === void 0 ? void 0 : _a.valueType}\``;
            if (((_b = type.returnType) === null || _b === void 0 ? void 0 : _b.description) &&
                ((_c = type.returnType) === null || _c === void 0 ? void 0 : _c.description.length) > 0) {
                returns += `- ${(_d = type.returnType) === null || _d === void 0 ? void 0 : _d.description}`;
            }
            return render(`
        #### ${type.name}(${type.parameters
                .map(p => `${p.name}: ${p.valueType}`)
                .join(', ')})
  
        Parameters:
        
        ${type.parameters
                .map(p => {
                let output = '';
                const signature = `\`${p.name}: ${p.valueType}\``;
                if (p.description.length > 0) {
                    output = `- ${signature} - ${p.description}`;
                }
                else {
                    output = `- ${signature}`;
                }
                return output;
            })
                .join('\n')}
  
        ${see(type.parameters)}
        
        Returns:
        
        ${returns}
  
        ${see([type])}
      `);
        };
        const describe = () => {
            return typeDefinitions.map(describeOne).join('\n');
        };
        return render(`
      ## Constructors
  
      ${list()}
  
      ${describe()}
    `);
    };
    const getMembers = (sectionName, members, typeDefinitions) => {
        const signatures = typeDefinitions.flatMap(t => {
            return members.map(p => `${p.name}: ${p.valueType}`);
        });
        const list = () => Array.from(new Set(signatures))
            .map(signature => `- \`${signature}\``)
            .join('\n');
        const examples = (type) => {
            if (type.example.length === 0)
                return '';
            let output = 'Examples:\n';
            output += '\n';
            output += type.example;
            return output;
        };
        const describeOne = (type) => {
            return render(`
        #### ${type.name}
  
        ${type.description}
  
        ${see([type])}
  
        ${examples(type)}
      `);
        };
        const describe = () => {
            return members.map(describeOne).join('\n');
        };
        if (!hasProperties(typeDefinitions) && sectionName === 'Properties') {
            return '';
        }
        if (!hasMethods(typeDefinitions) && sectionName === 'Methods') {
            return '';
        }
        return render(`
      ## ${sectionName}
  
      ${list()}
  
      ${describe()}
    `);
    };
    const getExamples = (typeDefinitions) => {
        if (!hasExample(typeDefinitions))
            return '';
        const examples = typeDefinitions.map(t => t.example);
        const list = () => Array.from(new Set(examples)).join('\n');
        let output = '## Examples';
        output += `\n\n`;
        output += list();
        return output;
    };
    const format = (typeDefinitions) => {
        let output = '';
        output += getIndex(typeDefinitions);
        output += getConstructors(typeDefinitions);
        output += getMembers('Properties', typeDefinitions.flatMap(t => t.properties), typeDefinitions);
        output += getMembers('Methods', typeDefinitions.flatMap(t => t.methods), typeDefinitions);
        output += getExamples(typeDefinitions);
        return output;
    };
    const formatIndex = (typeDefinitions) => {
        return getIndex(typeDefinitions);
    };
    const formatConstructors = (typeDefinitions) => {
        return getConstructors(typeDefinitions);
    };
    const formatProperties = (typeDefinitions) => {
        return getMembers('Properties', typeDefinitions.flatMap(t => t.properties), typeDefinitions);
    };
    const formatMethods = (typeDefinitions) => {
        return getMembers('Methods', typeDefinitions.flatMap(t => t.methods), typeDefinitions);
    };
    const formatExamples = (typeDefinitions) => {
        return getExamples(typeDefinitions);
    };
    return {
        formatIndex,
        formatConstructors,
        formatProperties,
        formatMethods,
        formatExamples,
        format
    };
};
exports.TypeFormatter = TypeFormatter;
