import { mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'

import { Project } from 'ts-morph'

import { parse, TypeInfo } from './parser'
import { Formatter } from './formatter'

const FILE_IN = process.argv[2]
const PATH_OUT = process.argv[3]

let fileIn = ''
fileIn = path.join(process.cwd(), FILE_IN)
fileIn = path.resolve(fileIn)

const project = new Project()
project.addSourceFilesAtPaths(fileIn)

const source = project.getSourceFileOrThrow(fileIn)

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
let dirOut = ''
dirOut = path.join(process.cwd(), PATH_OUT)
dirOut = path.resolve(dirOut)

Array.from(typesLookup.keys()).forEach(typeName => {
  const typeDefinitions = typesLookup.get(typeName) || []
  const typeDocumentation = formatter.typeFormatter.format(typeDefinitions)

  let outPath = ''
  outPath = path.join(dirOut, `${typeName}.md`)
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
