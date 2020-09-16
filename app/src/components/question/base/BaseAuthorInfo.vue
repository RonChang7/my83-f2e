<template>
  <div class="BaseAuthorInfo">
    <div class="BaseAuthorInfo__avatar">
      <BaseLazyImage
        :image-url="authorInfo.avatar_url"
        :image-alt="authorName"
        :image-loaded-style="avatarStyle"
      />
    </div>
    <div class="BaseAuthorInfo__detail">
      <div class="BaseAuthorInfo__name">
        {{ authorName }}
      </div>
      <div v-if="authorInfo.role === 'sales'" class="BaseAuthorInfo__medal">
        <GlobalLink to="/medal" target="_blank">
          <Medal :level="authorInfo.role_meta.level" size="S" />
        </GlobalLink>
      </div>
      <div class="BaseAuthorInfo__role">
        <span>{{ roleName }}</span>
        <template v-if="authorInfo.role_meta">
          <span>
            <img
              :src="`${$imageBucketUrl}/front/common/icon/location.svg`"
              alt="location"
              class="mr-1"
            />
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
    roleName() {
      return this.authorInfo.role === 'sales'
        ? this.authorInfo.role_meta!.is_verified
          ? '保險業務員'
          : 'MY83未認證業務員'
        : '保戶'
    },
    authorName() {
      return this.authorInfo.nickname
        ? this.authorInfo.nickname
        : this.authorInfo.username
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
  avatarStyle: Partial<CSSStyleDeclaration>
}

export type Methods = {}

export interface Computed {
  roleName: '保險業務員' | '保戶' | 'MY83未認證業務員'
  authorName: string
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
  flex: 0 1 auto;

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
    margin-bottom: 8px;
    line-height: 1.33;
  }

  &__role {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    > span {
      display: flex;
      margin-right: 4px;
    }
  }
}
</style>
