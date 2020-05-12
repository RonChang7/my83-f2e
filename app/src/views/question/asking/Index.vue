<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { UPDATE_PAGE_META } from '@/store/seo/seo.type'
import {
  fetchAskingFormOption,
  createQuestion,
  editQuestion,
} from '@/api/question/asking'
import {
  AskingFormOptionResponse,
  EditQuestionContent,
} from '@/api/question/asking.type'
import {
  UPDATE_GLOBAL_DIALOG,
  OPEN_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import { GlobalDialogContent } from '@/store/global/index'
import {
  IsUserSuspectDialogContent,
  IsDuplicatedPostDialogContent,
} from '@/config/question-asking-dialog-info'
const AskingPage = () => import('./AskingPage.vue')

const options: ComponentOption = {
  async fetch() {
    const { id } = this.$route.params
    const { purpose_tag_id: purposeTagId } = this.$route.query

    if (id) {
      const { user_meta, data } = await editQuestion(parseInt(id))
      this.isSuspect = !!user_meta.is_suspect
      this.isDuplicatedPost = !!user_meta.is_duplicated_post
      this.initContent = data
    } else {
      const { user_meta } = await createQuestion()
      this.isSuspect = !!user_meta.is_suspect
      this.isDuplicatedPost = !!user_meta.is_duplicated_post

      if (typeof purposeTagId === 'string' && parseInt(purposeTagId)) {
        ;(this.initContent as EditQuestionContent).purpose_tag_id = parseInt(
          purposeTagId
        )
      }
    }

    if (this.isAllowPost) {
      this.formOption = await fetchAskingFormOption()
    } else {
      this.updateGlobalDialogContent()
      this.$store.dispatch(`global/${OPEN_GLOBAL_DIALOG}`)
    }
  },
  fetchOnServer: false,
  data() {
    return {
      isMounted: false,
      formOption: {},
      isSuspect: undefined,
      isDuplicatedPost: undefined,
      initContent: {},
    }
  },
  computed: {
    isAllowPost() {
      if (
        typeof this.isSuspect === 'undefined' ||
        typeof this.isDuplicatedPost === 'undefined'
      ) {
        return false
      }

      return !(this.isSuspect || this.isDuplicatedPost)
    },
  },
  methods: {
    updateGlobalDialogContent() {
      let payload = {}

      // @TODO: Change path after migrate to Nuxt.js
      if (this.isSuspect) {
        payload = {
          ...IsUserSuspectDialogContent,
          rightConfirmFn: () => {
            window.location.href = '/question'
          },
          closeFn: () => {
            window.location.href = '/question'
          },
        } as GlobalDialogContent
      } else if (this.isDuplicatedPost) {
        payload = {
          ...IsDuplicatedPostDialogContent,
          rightConfirmFn: () => {
            window.location.href = '/question'
          },
          closeFn: () => {
            window.location.href = '/question'
          },
        } as GlobalDialogContent
      }

      this.$store.dispatch(`global/${UPDATE_GLOBAL_DIALOG}`, payload)
    },
  },
  created() {
    this.$store.dispatch(`pageMeta/${UPDATE_PAGE_META}`, {
      title: '發文到 MY83 討論區 - 《MY83 保險討論區》',
    })
  },
  mounted() {
    this.isMounted = true
  },
  render(h) {
    const renderComponent =
      this.isMounted && this.isAllowPost
        ? h(AskingPage, {
            props: {
              formOption: this.formOption,
              initContent: this.initContent,
            },
          })
        : h('div')
    return renderComponent
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
  isMounted: boolean
  formOption: AskingFormOptionResponse | {}
  isSuspect: boolean | undefined
  isDuplicatedPost: boolean | undefined
  initContent: EditQuestionContent | {}
}

export interface Methods {
  updateGlobalDialogContent(): void
}

export interface Computed {
  isAllowPost: boolean
}

export interface Props {}

export default options
</script>
