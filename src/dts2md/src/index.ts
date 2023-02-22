import { mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'
import { Project } from 'ts-morph'

import { parse, TypeInfo } from './parser'
import { Formatter } from './formatter'

const resolvePath = (input: string) => {
  let resolved = ''
  resolved = path.join(process.cwd(), input)
  return path.resolve(resolved)
}

type Args = {
  root: string
  project: string
  output: string
}

const args = process.argv.reduce(
  (acc, arg) => {
    if (arg.startsWith('--root')) acc.root = resolvePath(arg.split('=')[1])
    if (arg.startsWith('--project'))
      acc.project = resolvePath(arg.split('=')[1])
    if (arg.startsWith('--output')) acc.output = resolvePath(arg.split('=')[1])
    return acc
  },
  {
    root: '',
    project: '',
    output: ''
  } as Args
)

const project = new Project()
project.addSourceFilesAtPaths([args.root])
if (args.project.length > 0) {
  project.addSourceFilesAtPaths([args.project])
}

let typesRoot = parse(project.getSourceFileOrThrow(args.root))
let typesProject = [] as Array<TypeInfo>

if (args.project.length > 0) {
  typesProject = parse(project.getSourceFileOrThrow(args.project))
  // override root types with types defined in the project
  typesProject.forEach(type => {
    const name = type.name
    typesRoot = typesRoot.filter(t => t.name !== name)
  })
}

const types = [...typesRoot, ...typesProject]

const typesLookup = types.reduce((acc, type) => {
  const types = acc.get(type.name) || []
  types.push(type)
  return acc.set(type.name, types)
}, new Map<string, TypeInfo[]>())

const formatter = Formatter(typesLookup)

const toFile = (filePath: string, fileContents: string) => {
  const fileParts = path.parse(filePath)
  try {
    mkdirSync(fileParts.dir)
  } catch (err) {}
  writeFileSync(filePath, fileContents, { encoding: 'utf8' })
}

// generate types
Array.from(typesLookup.keys()).forEach(typeName => {
  const typeDefinitions = typesLookup.get(typeName) || []
  const typeDocumentation = formatter.typeFormatter.format(typeDefinitions)

  let outPath = ''
  outPath = path.join(args.output, `${typeName}.md`)
  outPath = path.resolve(outPath)

  toFile(outPath, typeDocumentation)
})

// // generate index
// const storageDefinition = typesLookup.get('Storage') || []
// const storageInterfaceDefinition = typesLookup.get('StorageInterface') || []

// const indexDocumentation = [
//   formatter.typeFormatter.format(storageDefinition),
//   formatter.typeFormatter.format(storageInterfaceDefinition)
// ].join('\n')

// const filePath = path.resolve(`${__dirname}/../../../docs/README.md`)
// toFile(filePath, indexDocumentation)
