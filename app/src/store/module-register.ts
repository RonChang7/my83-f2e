import moduleMap from './module-map'

export async function registerModule(
  app,
  store,
  moduleName,
  moduleNamespace = moduleName
) {
  const loadModule = moduleMap[moduleName]

  if (!loadModule) {
    throw new Error('Module Not Found.')
  }

  const { createStoreModule } = await loadModule()

  app.$registerStore({
    module: createStoreModule(store.state),
    moduleName: moduleNamespace,
    store,
  })
}
