const { parse } = require('path')
const Bluebird = require('bluebird')
const { Path } = require('../utils/path.js')
const { validatePath } = require('../utils/validators.js')

const { exists } = require('./exists.js')
const { list } = require('./list.js')

const copy = provider => {
  const { scope } = Path(provider.config)

  const doExists = exists(provider)
  const doList = list(provider)

  return async (pathFrom, pathTo, opts) => {
    opts = Object.assign(
      {
        concurrency: provider.config.concurrency
      },
      opts
    )

    const isFolder = path => path.endsWith('/')

    validatePath(pathFrom, 'pathFrom')
    validatePath(pathTo, 'pathTo')

    const fromFolder = isFolder(pathFrom)
    const toFolder = isFolder(pathTo)
    if (fromFolder && !toFolder) {
      throw new Error(
        `Unable to copy, 'pathFrom' is a directory and 'pathTo' a file`
      )
    }

    const pathFromExists = await doExists(pathFrom)
    if (!pathFromExists) {
      throw new Error(`'pathFrom' doesn't exist`)
    }

    const scopedPathFrom = scope(pathFrom)
    const scopedPathTo = scope(pathTo)

    let toCopy = []

    // file to file
    if (!fromFolder && !toFolder) {
      toCopy.push([scopedPathFrom, scopedPathTo])
    }

    // file to folder
    if (!fromFolder && toFolder) {
      const target = scopedPathTo + parse(scopedPathFrom).base
      toCopy.push([scopedPathFrom, target])
    }

    // folder to folder
    if (fromFolder && toFolder) {
      toCopy = await doList(pathFrom, { recursive: true, absolute: true })
      toCopy = toCopy.map(path => scope(path))
      toCopy = toCopy.map(path => {
        const to = path.replace(pathFrom, pathTo)
        return [path, to]
      })
    }

    const doCopy = ([from, to]) => provider.copyOne(from, to)
    await Bluebird.map(toCopy, doCopy, {
      concurrency: opts.concurrency
    })
  }
}

module.exports = {
  copy
}
