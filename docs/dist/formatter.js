"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const toParameterList = (parameters) => {
    const list = parameters
        .map(p => `- \`${p.name}: ${p.returnType}\``)
        .join('\n');
    return `
Parameters:

${list}
`;
};
const toReturn = (type) => {
    return `
Returns:

- \`${type}\`
`;
};
const toExample = (input) => {
    return `
Example:

${input}
`;
};
// const flatten = () => {
// }
const format = (definitions) => {
    const constructor = definitions.functions
        .filter(f => f.name === 'Storage')
        .pop();
    const contract = definitions.types
        .filter(t => t.name === 'StorageProvider')
        .pop();
    const types = definitions.types.reduce((acc, type) => acc.set(type.name, type), new Map());
    // console.log(constructor)
    // console.log(types.get('RemoveFunction'))
    // console.log(types.get('RemoveFunctionOpts'))
    if (!constructor)
        return '';
    if (!contract)
        return '';
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
        .map(p => `
#### ${p.name}

- \`${p.callSignature}\`

`)
        .join('\n')}

### Methods

${contract.methods
        .map(m => {
        const type = types.get(m.returnType);
        if (!type)
            return '';
        return `#### ${m.name}

${type === null || type === void 0 ? void 0 : type.callSignatures.map(signature => `- \`${m.name}${signature}\``).join('\n')}

${type.description}
${toParameterList(type.parameters)}
${toReturn(type.returnType)}
${toExample(type.example)}
`;
    })
        .join('\n')}
`;
};
exports.format = format;
