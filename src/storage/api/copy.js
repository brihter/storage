const { parse } = require('path')
const Bluebird = require('bluebird')

const copyApi = ({ provider, util, exists, list }) => {
  // prettier-ignore
  const {
    validate: validatePath,
    scope,
    isFolder
  } = util.path

  // prettier-ignore
  const defaults = opts => Object.assign({
    concurrency: provider.config.concurrency
  }, opts)

  const validate = async (pathFrom, pathTo) => {
    validatePath(pathFrom, 'pathFrom')
    validatePath(pathTo, 'pathTo')

    const pathFromIsFolder = isFolder(pathFrom)
    const pathToIsFolder = isFolder(pathTo)
    if (pathFromIsFolder && !pathToIsFolder) {
      throw new Error(
        `Unable to copy, 'pathFrom' is a directory and 'pathTo' a file`
      )
    }

    const pathFromExists = await exists(pathFrom)
    if (!pathFromExists) {
      throw new Error(`'pathFrom' doesn't exist`)
    }
  }

  return async (pathFrom, pathTo, opts) => {
    opts = defaults(opts)
    await validate(pathFrom, pathTo)

    const pathFromScoped = scope(pathFrom)
    const pathFromIsFolder = isFolder(pathFrom)
    const pathToScoped = scope(pathTo)
    const pathToIsFolder = isFolder(pathTo)

    let toCopy = []

    // file to file
    if (!pathFromIsFolder && !pathToIsFolder) {
      toCopy.push([pathFromScoped, pathToScoped])
    }

    // file to folder
    if (!pathFromIsFolder && pathToIsFolder) {
      const target = pathToScoped + parse(pathFromScoped).base
      toCopy.push([pathFromScoped, target])
    }

    // folder to folder
    if (pathFromIsFolder && pathToIsFolder) {
      toCopy = await list(pathFrom, { recursive: true, absolute: true })
      toCopy = toCopy.map(path => scope(path))
      toCopy = toCopy.map(path => {
        const to = path.replace(pathFrom, pathTo)
        return [path, to]
      })
    }

    const doCopy = ([from, to]) => provider.copyOne(from, to)
    await Bluebird.map(toCopy, doCopy, opts)
  }
}

module.exports = {
  copyApi
}
