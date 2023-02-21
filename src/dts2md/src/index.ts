import { mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'

import { Project } from 'ts-morph'

import { parse, TypeInfo } from './parser'
import { Formatter } from './formatter'

const FILE_IN = process.argv[2]

const project = new Project()
project.addSourceFilesAtPaths(FILE_IN)

const source = project.getSourceFileOrThrow(FILE_IN)

const types = parse(source)
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
  const filePath = path.resolve(`${__dirname}/../../../docs/${typeName}.md`)
  toFile(filePath, typeDocumentation)
})

// generate index
const storageDefinition = typesLookup.get('Storage') || []
const storageInterfaceDefinition = typesLookup.get('StorageInterface') || []
const storageInterfaceMethods = storageInterfaceDefinition[0].methods
  .map(m => m.valueType)
  .map(methodType => typesLookup.get(methodType))

const indexDocumentation = [
  formatter.typeFormatter.format(storageDefinition),
  formatter.typeFormatter.format(storageInterfaceDefinition)
].join('\n')

const filePath = path.resolve(`${__dirname}/../../../docs/README.md`)
toFile(filePath, indexDocumentation)
