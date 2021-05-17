<script lang="ts">
import _ from 'lodash'
import {
  defineAsyncComponent,
  defineComponent,
  h,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { Store } from 'vuex'
import { GlobalVuexState } from '@/store/global-state'
import { State } from '@/store/insurance/insurance'
import { CanonicalService } from '@/seo/canonical-service'
import { InsurancePageService } from './InsurancePageService'
const InsurancePageComponent = defineAsyncComponent(
  () => import('./InsurancePage.vue')
)

export default defineComponent({
  scrollToTop: false,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toPage = (index: number) => {
      router.push({
        query: {
          ...route.value.query,
          page: String(index),
        },
      })
    }

    return () =>
      h(InsurancePageComponent, {
        on: {
          'to-page': toPage,
        },
      })
  },
  async asyncData(ctx) {
    const service = new InsurancePageService(ctx)

    await service.fetchData()
    service.reconcileRoute()
  },
  head() {
    const filterKeys = _.keys(
      (this.$store as Store<InsuranceVuexState>).state.insurance.filter
        .defaultValue
    )
    const canonical = CanonicalService.getCanonical({
      hostname: this.$env.HOST_URL,
      route: this.$route,
      acceptedQueryStringKeys: ['page', 'q', ...filterKeys],
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
