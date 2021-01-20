import { Store } from 'vuex'
import {
  getCurrentInstance,
  toRefs,
  reactive,
  watch,
} from '@nuxtjs/composition-api'

// @TODO: mock useStore for Vue3 upgrade
// https://next.vuex.vuejs.org/guide/composition-api.html
export const useStore = <T = any>() => {
  const instance = getCurrentInstance()?.proxy
  const store = instance?.$store as Store<T>

  return store
}

// @TODO: mock useRouter, useRoute for Vue3 upgrade
// https://next.router.vuejs.org/guide/advanced/composition-api.html
export const useRouter = () => {
  const instance = getCurrentInstance()?.proxy

  return instance?.$router
}

// @TODO: mock useRouter, useRoute for Vue3 upgrade
// Make route as a reactive object
// Ref: https://school.geekwall.in/p/oV93xZjUQ/reactive-vue-routes-with-the-composition-api
export const useRoute = () => {
  const instance = getCurrentInstance()?.proxy

  const state = reactive({
    route: instance!.$route,
  })

  watch(
    () => instance!.$route,
    (r) => {
      state.route = r
    }
  )

  return toRefs(state).route
}
