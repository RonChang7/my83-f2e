<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { UPDATE_PAGE_META } from '@/store/seo/seo.type'
import { fetchAskingFormOption } from '@/api/question/asking'
import { AskingFormOptionResponse } from '@/api/question/asking.type'
const AskingPage = () => import('./AskingPage.vue')

const options: ComponentOption = {
  async fetch() {
    this.formOption = await fetchAskingFormOption()
  },
  fetchOnServer: false,
  data() {
    return {
      formOption: {},
    }
  },
  created() {
    this.$store.dispatch(`pageMeta/${UPDATE_PAGE_META}`, {
      title: '發文到 MY83 討論區 - 《MY83 保險討論區》',
    })
  },
  render(h) {
    return h(AskingPage, {
      props: {
        formOption: this.formOption,
      },
    })
  },
}

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
  formOption: AskingFormOptionResponse | {}
}

export interface Methods {}

export interface Computed {}

export interface Props {}

export default options
</script>
