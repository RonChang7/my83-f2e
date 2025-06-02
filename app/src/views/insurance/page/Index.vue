<script lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  h,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/insurance'
import { CanonicalService } from '@/seo/canonical-service'
import * as types from '@/store/insurance/insurance.type'
import { Content } from '@/services/page/Content'
import { InsurancePageService } from './InsurancePageService'
const InsurancePageComponent = defineAsyncComponent(
  () => import('./InsurancePage.vue')
)

export default defineComponent({
  scrollToTop: false,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const toPage = (index: number) => {
      router.push({
        query: {
          ...route.value.query,
          page: String(index),
        },
      })
      store.commit(`insurance/${types.UPDATE_CURRENT_PAGE}`, index)
    }

    return () =>
      h(InsurancePageComponent, {
        on: {
          'to-page': toPage,
        },
      })
  },
  async asyncData(ctx) {
    try {
      // 先執行通用的頁面請求（包含 header API）
      await Promise.all([...Content.requests(ctx)])

      // 再執行保險頁面特定的資料請求
      const service = new InsurancePageService(ctx)
      await service.fetchData()
      // service.reconcileRoute()
    } catch (err) {
      console.error(err)
    }
  },
  head() {
    const canonical = CanonicalService.getCanonical({
      hostname: this.$env.HOST_URL,
      route: this.$route,
      acceptedQueryStringKeys: ['page', 'q'],
    })

    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: canonical,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: canonical,
        },
      ],
    }
  },
  watchQuery: true,
})

export interface InsuranceVuexState extends GlobalVuexState {
  insurance: State
}
</script>
