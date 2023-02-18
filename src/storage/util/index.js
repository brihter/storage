import { Path } from './path.js'
import { data } from './data.js'
import { url } from './url.js'
import { promise } from './promise.js'

const Util = ({ config }) => {
  const path = Path({ config })

  return {
    path,
    data,
    url,
    promise
  }
}

export { Util }
