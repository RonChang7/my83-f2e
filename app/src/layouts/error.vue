<template>
  <div class="errorPage">
    <img
      class="errorPage__image"
      :src="`${$imageBucketUrl}/front/error/${errorContent.image}`"
      alt="error"
    />
    <div class="errorPage__title">{{ errorContent.title }}</div>
    <div class="errorPage__content">{{ errorContent.content }}</div>
    <div class="errorPage__function">
      <BaseButton
        size="l-a"
        :type="errorContent.enableZendesk ? 'secondary' : 'primary'"
        :is-full-width="isMobile && errorContent.enableZendesk"
        @click.native="redirectTo(errorContent.redirectUrl)"
      >
        {{ errorContent.buttonText }}
      </BaseButton>
      <BaseButton
        v-if="errorContent.enableZendesk"
        size="l-a"
        :is-full-width="isMobile"
        @click.native="feedback"
      >
        建議與回報問題
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { NuxtError } from '@nuxt/types/index'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import {
  errorPageContent,
  ErrorContent,
  ErrorPageType,
} from '@/config/error-page.config.ts'
import { Zendesk } from '@/services/zendesk/zendesk'
import { UserRoleMap } from '@/services/user/user'
import { GlobalVuexState } from '@/store/global-state'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

export default {
  name: 'ErrorLayout',
  mixins: [DeviceMixin],
  components: {
    BaseButton,
  },
  props: {
    error: {
      type: Object as PropType<Props['error']>,
    },
  },
  methods: {
    redirectTo(url) {
      if (url) {
        window.location.href = url
        return
      }
      window.location.reload()
    },
    feedback() {
      const zendeskInstance = Zendesk.getInstance(this.$env.ZENDESK_CHAT_ID)
      const personalize = this.$store.state.header.headerPersonalized
        ? this.$store.state.header.headerPersonalized.personalize
        : null
      const id = personalize ? `(${personalize.id})` : ''
      const username = personalize ? personalize.username : ''
      const role = personalize ? personalize.role : 'guest'
      const message = `MY83 管理員你好，我是 ${username}${UserRoleMap[role]}${id}，在瀏覽 ${window.location.href}（ Referrer: ${window.document.referrer}）時發生錯誤，可以麻煩請你們幫我確認問題嗎？謝謝。`

      if (Zendesk.isLoaded) {
        Zendesk.say(message)
      } else {
        zendeskInstance.onLoad(() => {
          Zendesk.say(message)
        })
      }
    },
  },
  computed: {
    errorContent() {
      const { message } = this.error
      return message && message in ErrorPageType
        ? errorPageContent[ErrorPageType[message]]
        : errorPageContent[ErrorPageType.DEFAULT]
    },
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

export interface Instance extends Vue, DeviceMixinComponentInstance {
  $store: Store<GlobalVuexState>
}

export interface Data {}

export interface Methods {
  redirectTo(url?: string): void
  feedback(): void
}

export interface Computed {
  errorContent: ErrorContent
}

export interface Props {
  error: NuxtError
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.errorPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 47px 0;

  @include max-media('xl') {
    padding: 60px 20px;
  }

  &__image {
    height: 150px;
  }

  &__title,
  &__content {
    margin-top: 16px;
    color: $gray-primary;
    white-space: pre-line;
    text-align: center;
  }

  &__title {
    font-size: 1.375rem;
    font-weight: 500;
  }

  &__content {
    @include max-media('xl') {
      font-size: 0.875rem;
    }
  }

  &__function {
    margin-top: 24px;

    @include max-media('xl') {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    > [type='button']:not(:first-child) {
      margin-left: 16px;
    }
  }
}
</style>
