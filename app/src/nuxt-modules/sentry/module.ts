import fs from 'fs'
import path from 'path'
import { Module } from '@nuxt/types'

const Sentry: Module<unknown> = function () {
  this.nuxt.hook('build:before', async () => {
    const SentryCli = await require('@sentry/cli')
    const cli = new SentryCli()
    const release = (await cli.releases.proposeVersion()).trim()
    const options: Options = {
      release,
    }

    this.addTemplate({
      src: path.resolve(__dirname, './templates/release.json'),
      fileName: 'release.json',
      options,
    })
  })

  this.nuxt.hook('ready', () => {
    try {
      const { release } = JSON.parse(
        fs.readFileSync(`${this.options.buildDir}/release.json`, 'utf8')
      ) as Options

      process.env.SENTRY_RELEASE_TAG = release
    } catch {}
  })
}

interface Options {
  release: string
}

export default Sentry
