"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = __importStar(require("path"));
const ts_morph_1 = require("ts-morph");
const parser_1 = require("./parser");
const formatter_1 = require("./formatter");
const resolvePath = (input) => {
    let resolved = '';
    resolved = path.join(process.cwd(), input);
    return path.resolve(resolved);
};
const args = process.argv.reduce((acc, arg) => {
    if (arg.startsWith('--root'))
        acc.root = resolvePath(arg.split('=')[1]);
    if (arg.startsWith('--project'))
        acc.project = resolvePath(arg.split('=')[1]);
    if (arg.startsWith('--output'))
        acc.output = resolvePath(arg.split('=')[1]);
    return acc;
}, {
    root: '',
    project: '',
    output: ''
});
const project = new ts_morph_1.Project();
project.addSourceFilesAtPaths([args.root]);
if (args.project.length > 0) {
    project.addSourceFilesAtPaths([args.project]);
}
let typesRoot = (0, parser_1.parse)(project.getSourceFileOrThrow(args.root));
let typesProject = [];
if (args.project.length > 0) {
    typesProject = (0, parser_1.parse)(project.getSourceFileOrThrow(args.project));
    // override root types with types defined in the project
    typesProject.forEach(type => {
        const name = type.name;
        typesRoot = typesRoot.filter(t => t.name !== name);
    });
}
const types = [...typesRoot, ...typesProject];
const typesLookup = types.reduce((acc, type) => {
    const types = acc.get(type.name) || [];
    types.push(type);
    return acc.set(type.name, types);
}, new Map());
const formatter = (0, formatter_1.Formatter)(typesLookup);
const toFile = (filePath, fileContents) => {
    const fileParts = path.parse(filePath);
    try {
        (0, fs_1.mkdirSync)(fileParts.dir);
    }
    catch (err) { }
    (0, fs_1.writeFileSync)(filePath, fileContents, { encoding: 'utf8' });
};
// generate types
Array.from(typesLookup.keys()).forEach(typeName => {
    const typeDefinitions = typesLookup.get(typeName) || [];
    const typeDocumentation = formatter.typeFormatter.format(typeDefinitions);
    let outPath = '';
    outPath = path.join(args.output, `${typeName}.md`);
    outPath = path.resolve(outPath);
    toFile(outPath, typeDocumentation);
});
// // generate index
// const storageDefinition = typesLookup.get('Storage') || []
// const storageInterfaceDefinition = typesLookup.get('StorageInterface') || []
// const indexDocumentation = [
//   formatter.typeFormatter.format(storageDefinition),
//   formatter.typeFormatter.format(storageInterfaceDefinition)
// ].join('\n')
// const filePath = path.resolve(`${__dirname}/../../../docs/README.md`)
// toFile(filePath, indexDocumentation)
