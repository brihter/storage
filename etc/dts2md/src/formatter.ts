import { TypeInfo } from './parser'

import { TypeFormatter } from './formatters/typeFormatter'

const Formatter = (typesLookup: Map<string, TypeInfo[]>) => {
  const typeFormatter = TypeFormatter(typesLookup)

  return {
    typeFormatter
  }
}

export { Formatter }
