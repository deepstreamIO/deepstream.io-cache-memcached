import * as Memcached from 'memcached'
import * as pkg from '../package.json'
import { DeepstreamPlugin, DeepstreamCache, StorageReadCallback, StorageWriteCallback, StorageHeadBulkCallback, StorageHeadCallback, DeepstreamConfig, DeepstreamServices, EVENT } from '@deepstream/types'

interface MemcachedOptions {
  serverLocation: string
  lifetime: number
  memcachedOptions?: Memcached.options
}

/**
 * This class connects deepstream.io to a memcached cache, using the
 * memcached library (https://www.npmjs.com/package/memcached).
 *
 * Please consult https://www.npmjs.com/package/memcached for details
 * on the serverLocation and memcachedOptions setting
 *
 * lifetime is the default lifetime for objects in seconds (defaults to 1000)
 */
export class CacheConnector extends DeepstreamPlugin implements DeepstreamCache {
  public description = `Memcached ${pkg.version}`
  private logger = this.services.logger.getNameSpace('MEMCACHED_CACHE')
  private client!: Memcached

  constructor (private options: MemcachedOptions, private services: DeepstreamServices, deepstreamConfig: DeepstreamConfig) {
    super()
    this.options.lifetime = options.lifetime || 60000

    if (!this.options.serverLocation) {
      this.logger.fatal(EVENT.PLUGIN_INITIALIZATION_ERROR, "Missing parameter 'serverLocation' for memcached connector")
    }
  }

  public async whenReady () {
    this.client = new Memcached(this.options.serverLocation, this.options.memcachedOptions || {})
    this.client.on('failure', () => this.logger.fatal(EVENT.ERROR, 'Memcached error'))
  }

  public head (recordName: string, callback: StorageHeadCallback): void {
    this.client.get(recordName, (err, value) => {
      if (err) {
        callback(err)
        return
      }

      if (value === undefined) {
        callback(null, -1)
        return
      }
      callback(null, value.version)
    })
  }

  public headBulk (recordNames: string[], callback: StorageHeadBulkCallback): void {
    this.client.getMulti(recordNames, (err, values) => {
      if (err) {
        callback(err)
        return
      }

      callback(null, recordNames.reduce((result, name) => {
        result[name] = values[name] ? values[name].version : -1
        return result
      }, {} as { [index: string]: number }))
    })
  }

  public set (recordName: string, version: number, data: any, callback: StorageWriteCallback, metaData?: any): void {
    this.client.set(recordName, { version, data }, this.options.lifetime, (err) => callback(err ? err : null))
  }

  public get (recordName: string, callback: StorageReadCallback, metaData?: any): void {
    this.client.get(recordName, (err, value) => {
      if (err) {
        callback(err)
        return
      }

      if (value === undefined) {
        callback(null, -1, null)
        return
      }

      callback(null, value.version, value.data)
    })
  }

  public delete (recordName: string, callback: StorageWriteCallback, metaData?: any): void {
    this.client.del(recordName, (err) => callback(err ? err : null))
  }

  public deleteBulk (recordNames: string[], callback: StorageWriteCallback, metaData?: any): void {
    const promises = recordNames.map((name) =>
      new Promise((resolve, reject) => {
        this.client.del(name, (err) => err ? reject(err) : resolve())
      })
    )
    Promise
      .all(promises)
      .then(() => callback(null))
      .catch((e) => callback(e))
  }
}

export default CacheConnector
