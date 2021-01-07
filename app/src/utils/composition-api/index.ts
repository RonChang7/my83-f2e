import { Store } from 'vuex'
import { getCurrentInstance } from '@nuxtjs/composition-api'

// @TODO: mock useStore for Vue3 upgrade
// https://next.vuex.vuejs.org/guide/composition-api.html
export const useStore = <T = any>() => {
  const instance = getCurrentInstance()
  const store = instance?.$store as Store<T>

  return store
}

// @TODO: mock useRouter, useRoute for Vue3 upgrade
// https://next.router.vuejs.org/guide/advanced/composition-api.html
export const useRouter = () => {
  const instance = getCurrentInstance()

  return instance?.$router
}

export const useRoute = () => {
  const instance = getCurrentInstance()

  return instance?.$route
}
