'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toExample = void 0
const toExample = type => {
  if (type.example.length === 0) return ''
  return `
## Example

${type.example}
  `
}
exports.toExample = toExample
