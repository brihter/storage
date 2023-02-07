const { parse, join } = require('path')
const crypto = require('crypto')
const Bluebird = require('bluebird')
const mime = require('mime-types')

// prettier-ignore
const {
  writeFile,
  mkdir,
  readFile,
  access,
  readdir,
  rm, stat : fsStat,
  copyFile
} = require('fs').promises

const impl = config => {
  const read = async path => {
    let file
    try {
      file = await readFile(path, { encoding: null })
    } catch (err) {
      if (err.errno !== -2) {
        throw err
      }
    }
    return file
  }

  const stat = async path => {
    const md5 = string => crypto.createHash('md5').update(string).digest('hex')

    const format = result => ({
      file: path,
      contentType: mime.lookup(path) || 'application/octet-stream',
      size: result.size,
      modified: result.mtime,
      etag: md5(path + result.mtime.toString())
    })

    let result
    try {
      result = await fsStat(path)
    } catch (err) {
      if (err.errno !== -2) {
        throw err
      }
    }

    if (!result) {
      return
    }

    return format(result)
  }

  const write = async (path, buffer, opts) => {
    // in node, encoding 'binary' is an alias for 'latin1'
    if (opts.encoding === 'binary') {
      opts.encoding = null
    }

    const { dir } = parse(path)
    await mkdir(dir, { recursive: true })
    await writeFile(path, buffer, opts)
  }

  const removeOne = async path => {
    try {
      await rm(path, { recursive: true })
    } catch (err) {
      if (err.errno !== -2) {
        throw err
      }
    }
  }

  const exists = async path => {
    let result = true
    try {
      await access(path)
    } catch (err) {
      result = false
      if (err.errno !== -2) {
        throw err
      }
    }
    return result
  }

  const uri = async path => {
    return `file://${path}`
  }

  const scan = async (path, opts) => {
    const format = entry => {
      // omit prefixes (directories) to match object storage behavior
      if (opts.recursive && entry.isDirectory()) {
        return
      } else {
        const name = entry.isDirectory() ? entry.name + '/' : entry.name
        return join(path, name)
      }
    }

    const entries = await readdir(path, {
      withFileTypes: true
    })

    const directories = entries
      .filter(e => e.isDirectory())
      .map(e => join(path, e.name))

    const results = [entries.map(format)]
    if (opts.recursive) {
      const doList = path => scan(path, opts)
      const items = await Bluebird.map(directories, doList, {
        concurrency: opts.concurrency
      })
      results.push(items)
    }

    return results
  }

  const list = async (path, opts) => {
    const items = await scan(path, opts)
    return items
      .flat(Number.POSITIVE_INFINITY)
      .filter(item => typeof item !== 'undefined')
  }

  const copyOne = async (from, to) => {
    await write(to, '', { encoding: 'ascii' })
    await copyFile(from, to)
  }

  return {
    config: config.storage,
    client: {},

    copyOne,
    read,
    stat,
    write,
    removeOne,
    exists,
    uri,
    list
  }
}

module.exports = {
  type: 'local',
  impl
}
