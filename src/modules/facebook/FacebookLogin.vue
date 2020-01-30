<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { Facebook } from './facebook'
import { FaceBookStatus } from './facebook.type'

// Manual refresh token when (current time - token expire time) is less than REFRESH_TIME_THRESHOLD
const REFRESH_TIME_THRESHOLD = 60 * 1000

export default {
  data() {
    return {
      facebookStatus: null,
      JWTToken: '',
    }
  },
  methods: {
    async facebookLogin() {
      if (
        !this.facebookStatus.accessToken ||
        this.facebookStatus.accessTokenExpireTime <=
          Date.now() - REFRESH_TIME_THRESHOLD
      ) {
        await this.facebook.login()
        return this.facebookStatus.accessToken
      }
      return this.facebookStatus.accessToken
    },
  },
  mounted() {
    this.facebook = Facebook.getInstance()
    this.facebookStatus = Facebook.state
  },
  computed: {
    slot() {
      return {
        user: this.facebookStatus ? this.facebookStatus.user : {},
        isLoaded: this.facebookStatus ? this.facebookStatus.isLoaded : false,
        facebookLogin: this.facebookLogin,
      }
    },
  },
  render() {
    if (this.$scopedSlots.default) {
      return this.$scopedSlots.default(this.slot)
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

export interface Instance extends Vue {}

export interface Data {
  facebook: Facebook
  facebookStatus: FaceBookStatus
  JWTToken: string
}

export interface Methods {
  facebookLogin: () => void
}

export interface Computed {
  slot: object
}

export interface Props {}
</script>
