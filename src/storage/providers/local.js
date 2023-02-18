import { parse, join } from 'node:path'
import { createHash } from 'node:crypto'
import { lookup } from 'mime-types'
import { promise } from '../util/promise.js'

// prettier-ignore
import {
  writeFile,
  mkdir,
  readFile,
  access,
  readdir,
  rm,
  stat as fsStat,
  copyFile
} from 'node:fs/promises'

const impl = (config, dependencies) => {
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
    const md5 = string => createHash('md5').update(string).digest('hex')

    const format = result => ({
      file: path,
      contentType: lookup(path) || 'application/octet-stream',
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

  const url = async path => {
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
      const items = await promise.map(directories, doList, {
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

  const presign = async (path, opts) => {
    return await url(path)
  }

  return {
    config,
    client: {},

    copyOne,
    read,
    stat,
    write,
    removeOne,
    exists,
    url,
    list,
    presign
  }
}

const provider = {
  type: 'local',
  impl
}

export { provider }
