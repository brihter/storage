const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array)
  }
}

const split = (array, n) => {
  const res = []
  while (array.length) {
    res.push(array.splice(0, n))
  }
  return res
}

// prettier-ignore
const defaults = opts => Object.assign({
  concurrency: 10
}, opts)

const map = (items = [], fn, opts = {}) => {
  opts = defaults(opts)

  return new Promise(async (resolve, reject) => {
    const output = []
    const batches = split(items, opts.concurrency)
    await asyncForEach(batches, async batch => {
      const promises = batch.map(fn).map(p => p.catch(reject))
      const results = await Promise.all(promises)
      output.push(...results)
    })
    resolve(output)
  })
}

const promise = {
  map
}

module.exports = {
  promise
}
