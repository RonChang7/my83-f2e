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
  OPEN_LOGIN_PANEL,
  UPDATE_AFTER_LOGIN_EVENT,
  UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT,
  UPDATE_GLOBAL_DIALOG,
  OPEN_GLOBAL_DIALOG,
} from '@/store/global/global.type'
import { GlobalDialogContent } from '@/store/global/index'
import {
  IsUserSuspectDialogContent,
  HasDuplicatedPostDialogContent,
} from '@/config/question-asking-dialog-info'
import { ErrorPageType } from '@/config/error-page.config'
import { Content } from '@/services/page/Content'
const AskingPage = () => import('./AskingPage.vue')

const options: ComponentOption = {
  async asyncData(ctx) {
    const { error } = ctx

    try {
      await Promise.all([...Content.requests(ctx)])
    } catch (err) {
      const statusCode = err.response.status === 404 ? err.response.status : 500

      return error({
        statusCode,
        message: ErrorPageType.SERVER,
      })
    }
  },
  async fetch() {
    const { id } = this.$route.params
    const { purpose_tag_id: purposeTagId } = this.$route.query

    if (!this.$auth.isLogin) {
      this.showLoginPanel()
      return
    }

    try {
      if (id) {
        const { user_meta, data } = await editQuestion(parseInt(id))
        this.isSuspect = !!user_meta.is_suspect
        this.hasDuplicatedPost = !!user_meta.has_duplicated_post
        this.initContent = data
      } else {
        const { user_meta } = await createQuestion()
        this.isSuspect = !!user_meta.is_suspect
        this.hasDuplicatedPost = !!user_meta.has_duplicated_post

        if (typeof purposeTagId === 'string' && parseInt(purposeTagId)) {
          ;(this.initContent as EditQuestionContent).purpose_tag_id = parseInt(
            purposeTagId
          )
        }
      }
    } catch (error) {
      this.$router.push({ name: 'questionList' })
      return
    }

    if (this.isAllowPost) {
      try {
        this.formOption = await fetchAskingFormOption()
      } catch (error) {
        return this.$nuxt.error({
          statusCode: 500,
          message: ErrorPageType.SERVER,
        })
      }
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
      hasDuplicatedPost: undefined,
      initContent: {},
    }
  },
  computed: {
    isAllowPost() {
      if (
        typeof this.isSuspect === 'undefined' ||
        typeof this.hasDuplicatedPost === 'undefined'
      ) {
        return false
      }

      return !(this.isSuspect || this.hasDuplicatedPost)
    },
  },
  methods: {
    showLoginPanel() {
      this.$store.dispatch(`global/${OPEN_LOGIN_PANEL}`, 'login')
      this.$store.dispatch(
        `global/${UPDATE_AFTER_CLOSE_LOGIN_PANEL_EVENT}`,
        () => {
          this.$router.push({ name: 'questionList' })
        }
      )
      this.$store.dispatch(`global/${UPDATE_AFTER_LOGIN_EVENT}`, () => {
        window.location.reload()
      })
    },
    updateGlobalDialogContent() {
      let payload = {}

      if (this.isSuspect) {
        payload = {
          ...IsUserSuspectDialogContent,
          rightConfirmFn: () => {
            this.$router.push({ name: 'questionList' })
          },
          closeFn: () => {
            this.$router.push({ name: 'questionList' })
          },
        } as GlobalDialogContent
      } else if (this.hasDuplicatedPost) {
        payload = {
          ...HasDuplicatedPostDialogContent,
          rightConfirmFn: () => {
            this.$router.push({ name: 'questionList' })
          },
          closeFn: () => {
            this.$router.push({ name: 'questionList' })
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
        : h()
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
  hasDuplicatedPost: boolean | undefined
  initContent: EditQuestionContent | {}
}

export type Methods = {
  showLoginPanel(): void
  updateGlobalDialogContent(): void
}

export interface Computed {
  isAllowPost: boolean
}

export interface Props {}

export default options
</script>
