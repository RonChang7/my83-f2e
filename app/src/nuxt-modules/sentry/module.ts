import fs from 'fs'
import path from 'path'
import { Module } from '@nuxt/types'

const Sentry: Module<unknown> = function () {
  this.nuxt.hook('build:before', async () => {
    try {
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
    } catch {
      // 無法透過 SentryCli 找到版號則不拋錯也不建立 release.json
      console.warn(
        'Could not generate release name via Sentry CLI. No release.json is created.'
      )
    }
  })

  this.nuxt.hook('ready', () => {
    const jsonFilePath = `${this.options.buildDir}/release.json`
    if (!fs.existsSync(jsonFilePath)) return

    const { release } = JSON.parse(
      fs.readFileSync(jsonFilePath, 'utf8')
    ) as Options

    process.env.SENTRY_RELEASE_TAG = release
  })
}

interface Options {
  release: string
}

export default Sentry
