<template>
  <nav class="HeaderMenu">
    <MobileHeaderNav />
    <HeaderPersonalize :from-header-menu="true" @reload="reloadHandler" />
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import MobileHeaderNav from '@/components/header/mobile/MobileHeaderNav.vue'
import HeaderPersonalize from '@/components/header/HeaderPersonalize.vue'
import { Content } from '@/services/page/Content'
import { ErrorPageType } from '@/config/error-page.config'

export default {
  async asyncData(ctx) {
    const { from, error } = ctx

    try {
      await Promise.all([...Content.requests(ctx)])
    } catch (err) {
      const statusCode = err.response.status === 404 ? err.response.status : 500

      return error({
        statusCode,
        message: ErrorPageType.SERVER,
      })
    }

    return {
      // 如果 client 點選登出，mobile 要回到上一頁並重新整理 (因為 mobile 的選單是獨立 route)
      perviousPath: from?.path || '/',
    }
  },
  head() {
    return {
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    }
  },
  data() {
    return {
      perviousPath: '',
    }
  },
  methods: {
    reloadHandler() {
      window.location.href = this.perviousPath
    },
  },
  components: {
    MobileHeaderNav,
    HeaderPersonalize,
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {}

export interface Data {
  perviousPath: string
}

export type Methods = {
  reloadHandler(): void
}

export interface Computed {}

export interface Props {}
</script>

<style lang="scss" scoped>
.HeaderMenu {
  margin-bottom: 25px;
}
</style>
