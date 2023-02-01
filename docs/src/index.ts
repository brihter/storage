import { Project } from 'ts-morph';

import { parse } from './parser'
import { format } from './formatter'
import { writeFileSync } from 'fs';

const FILE_IN = process.argv[2]
const FILE_OUT = process.argv[3]

const project = new Project()
project.addSourceFilesAtPaths(FILE_IN)

const definitions = parse(project.getSourceFileOrThrow(FILE_IN))
const markdown = format(definitions)
writeFileSync(FILE_OUT, markdown)

//console.log(JSON.stringify(definitions, null, 4))

