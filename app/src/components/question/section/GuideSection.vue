<template>
  <div class="GuideSection">
    <div v-if="!isMobile" class="GuideSection__title">
      <img
        :src="`${$imageBucketUrl}/front/common/icon/comment.svg`"
        alt="icon"
        class="mr-4"
      />
      MY83保險網 討論區
    </div>
    <div v-if="!isMobile" class="GuideSection__content">
      想看看身上的保單需不需要補強或修改？投保有體況？理賠遇到問題怎麼辦？讓MY83討論區裡專業的業務員來幫你！
    </div>
    <div class="GuideSection__action">
      <BaseButton
        size="l-a"
        :is-full-width="true"
        :to="{ name: 'questionList' }"
      >
        <template #icon>
          <BaseComment />
        </template>
        熱門討論
      </BaseButton>
      <BaseButton
        size="l-a"
        type="secondary"
        :is-full-width="true"
        :to="{ name: 'questionAsking' }"
      >
        <template #icon>
          <BasePencil />
        </template>
        我要發問
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseComment from '@/assets/icon/24/BaseComment.svg'
import BasePencil from '@/assets/icon/24/BasePencil.svg'
import DeviceMixin, {
  Computed as DeviceMixinComputed,
} from '@/mixins/device/device-mixins'

export default {
  mixins: [DeviceMixin],
  components: {
    BaseButton,
    BaseComment,
    BasePencil,
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

export interface Data {}

export type Methods = {}

export interface Computed extends DeviceMixinComputed {}

export interface Props {}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.GuideSection {
  @include min-media('xl') {
    @include card-primary;
    padding: 30px;
    margin-bottom: 20px;
  }

  padding: 10px 20px;

  &__title {
    display: flex;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
    margin-bottom: 10px;
  }

  &__content {
    font-size: 0.875rem;
    margin-bottom: 20px;
  }

  &__action {
    display: flex;

    > [type='button']:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
