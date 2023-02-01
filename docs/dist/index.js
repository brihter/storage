"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const parser_1 = require("./parser");
const formatter_1 = require("./formatter");
const fs_1 = require("fs");
const FILE_IN = process.argv[2];
const FILE_OUT = process.argv[3];
const project = new ts_morph_1.Project();
project.addSourceFilesAtPaths(FILE_IN);
const definitions = (0, parser_1.parse)(project.getSourceFileOrThrow(FILE_IN));
const markdown = (0, formatter_1.format)(definitions);
(0, fs_1.writeFileSync)(FILE_OUT, markdown);
//console.log(JSON.stringify(definitions, null, 4))
