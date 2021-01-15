import path from 'path'

const enableLogMockCalls = process.env.NUXT_ENV_APP_ENV === 'development'

async function getBrowserApiMethods() {
  const SentryBrowser = await import('@sentry/browser')

  const browserMethods: string[] = []
  for (const key in SentryBrowser) {
    if (typeof SentryBrowser[key] === 'function') {
      browserMethods.push(key)
    }
  }

  return browserMethods
}

async function getNodeApiMethods() {
  const SentryNode = await import('@sentry/node')

  const nodeMethods: string[] = []
  for (const key in SentryNode) {
    if (typeof SentryNode[key] === 'function') {
      nodeMethods.push(key)
    }
  }

  return nodeMethods
}

const addServerPlugin: AddPlugin = async (moduleContainer, releaseName) => {
  const nodeApiMethods = await getNodeApiMethods()

  const serverPluginOptions: Options = {
    apiMethods: nodeApiMethods,
    enableLogMockCalls,
    releaseName,
  }

  // Add server side sentry plugin
  moduleContainer.addPlugin({
    src: path.resolve(__dirname, '..', 'templates', `plugin.server.js`),
    fileName: 'sentry.server.js',
    mode: 'server',
    options: serverPluginOptions,
  })
}

const addClientPlugin: AddPlugin = async (moduleContainer, releaseName) => {
  const browserApiMethods = await getBrowserApiMethods()

  const clientPluginOptions: Options = {
    apiMethods: browserApiMethods,
    enableLogMockCalls,
    releaseName,
  }

  // Add client side sentry plugin
  moduleContainer.addPlugin({
    src: path.resolve(__dirname, '..', 'templates', `plugin.client.js`),
    fileName: 'sentry.client.js',
    mode: 'client',
    options: clientPluginOptions,
  })
}

const generateReleaseTag = async () => {
  try {
    const SentryCli = await require('@sentry/cli')
    const cli = new SentryCli()
    const release = ((await cli.releases.proposeVersion()) as string).trim()
    return release
  } catch {
    console.warn('Could not generate release name via Sentry CLI.')
  }
}

export const buildHook = async (moduleContainer: ModuleContainer) => {
  const releaseName = await generateReleaseTag()

  await addServerPlugin(moduleContainer, releaseName)
  await addClientPlugin(moduleContainer, releaseName)
}

// Nuxt 目前沒有提供 Nuxt module 的型別，故先使用 any 替代
type ModuleContainer = any

interface Options {
  apiMethods: string[]
  enableLogMockCalls: boolean
  releaseName: string
}

type AddPlugin = (
  moduleContainer: ModuleContainer,
  releaseName: string | undefined
) => Promise<void>
