<template>
  <div class="BaseAuthorInfo">
    <div class="BaseAuthorInfo__avatar">
      <BaseLazyImage
        :imageUrl="authorInfo.avatar_url"
        :imageAlt="authorInfo.nickname"
        :imageLoadedStyle="avatarStyle"
      />
    </div>
    <div class="BaseAuthorInfo__detail">
      <div class="BaseAuthorInfo__name">
        {{ authorInfo.nickname }}
      </div>
      <div v-if="authorInfo.role === 1" class="BaseAuthorInfo__medal">
        <GlobalLink to="/medal" target="_blank">
          <Medal :level="authorInfo.role_meta.level" size="S" />
        </GlobalLink>
      </div>
      <div class="BaseAuthorInfo__role">
        <span>{{ role }}</span>
        <template v-if="authorInfo.role_meta">
          <span>
            <img src="@/assets/images/icon/location.svg" alt="location" />
          </span>
          <span>
            {{ authorInfo.role_meta.location }}
          </span>
        </template>
      </div>

      <div v-if="authorInfo.role_meta" class="BaseAuthorInfo__replyStatus">
        {{ authorInfo.role_meta.reply_status }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { AuthorInfo } from '@/api/question/question.type'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import Medal from '@/components/base/medal/Medal.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'

export default {
  components: {
    BaseLazyImage,
    Medal,
    GlobalLink,
  },
  props: {
    authorInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatarStyle: {
        borderRadius: '50%',
      },
    }
  },
  computed: {
    role() {
      return this.authorInfo.role === 1 ? '保險業務員' : '保戶'
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

export interface Instance extends Vue {}

export interface Data {
  avatarStyle: CSSStyleDeclaration
}

export interface Methods {}

export interface Computed {
  role: string
}

export interface Props {
  authorInfo: AuthorInfo
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';

.BaseAuthorInfo {
  display: flex;
  font-size: 0.875rem;

  &__avatar {
    width: 60px;
    height: 60px;
    flex: 0 0 auto;
    margin-right: 10px;
  }

  &__name {
    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.5;
  }

  &__role {
    display: flex;
    align-items: center;
    line-height: 1.5;

    > span {
      margin-right: 5px;
    }
  }
}
</style>
