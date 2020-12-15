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
    const jsonFilePath = `${this.options.buildDir}/release.json`
    if (fs.existsSync(jsonFilePath)) {
      try {
        const { release } = JSON.parse(
          fs.readFileSync(jsonFilePath, 'utf8')
        ) as Options

        process.env.SENTRY_RELEASE_TAG = release
      } catch {
        // json file parse 失敗，不進行 env 寫入
      }
    }
  })
}

interface Options {
  release: string
}

export default Sentry
