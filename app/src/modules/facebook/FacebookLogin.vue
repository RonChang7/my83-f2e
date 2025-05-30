<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { renderlessComponentWrapper } from '@/utils/render-helper'
import { Facebook } from './facebook'
import { FaceBookStatus, FacebookUser } from './facebook.type'

// Manual refresh token when (current time - token expire time) is less than REFRESH_TIME_THRESHOLD
const REFRESH_TIME_THRESHOLD = 60 * 1000

export default {
  data() {
    return {
      facebookStatus: null,
    }
  },
  methods: {
    async facebookLogin() {
      if (
        !this.facebookStatus?.accessToken ||
        this.facebookStatus.accessTokenExpireTime <=
          Date.now() - REFRESH_TIME_THRESHOLD
      ) {
        await this.facebook.login()
        return this.facebookStatus?.accessToken
      }
      return this.facebookStatus.accessToken
    },
  },
  mounted() {
    this.facebook = Facebook.getInstance(this.$env.FACEBOOK_APP_ID)
    this.facebookStatus = this.facebook.facebookState
  },
  computed: {
    slot() {
      return {
        user: this.facebookStatus ? this.facebookStatus.user : null,
        isLoaded: this.facebookStatus ? this.facebookStatus.isLoaded : false,
        facebookLogin: this.facebookLogin,
      }
    },
  },
  render(h) {
    if (this.$scopedSlots.default) {
      return renderlessComponentWrapper(this.$scopedSlots.default(this.slot), h)
    }
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

export interface Instance extends Vue {
  facebook: Facebook
}

export interface Data {
  facebookStatus: FaceBookStatus | null
}

export type Methods = {
  facebookLogin(): void
}

export interface Computed {
  slot: {
    user: FacebookUser | null
    isLoaded: boolean
    facebookLogin: Methods['facebookLogin']
  }
}

export interface Props {}
</script>
