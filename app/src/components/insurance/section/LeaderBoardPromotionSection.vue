<template>
  <div class="LeaderBoardPromotionSection">
    <div class="LeaderBoardPromotionSection__image">
      <BaseLazyImage
        :image-url="`${$imageBucketUrl}/front/common/avatar/manager_cat.png`"
        image-alt="my83-cat"
      />
    </div>
    <div class="LeaderBoardPromotionSection__content">
      <div class="LeaderBoardPromotionSection__title">
        懶得從各險種找商品嗎？
      </div>
      <div class="LeaderBoardPromotionSection__description">
        {{ description }}
      </div>
    </div>
    <div class="LeaderBoardPromotionSection__action">
      <BaseButton
        v-for="link in bundleLinks"
        :key="link.path"
        type="secondary"
        size="m"
        :is-full-width="true"
        :to="link.path"
        class="active"
      >
        {{ link.type }}罐頭保單
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { useDevice } from '@/mixins/device/device-mixins'

export default defineComponent({
  components: {
    BaseLazyImage,
    BaseButton,
  },
  setup() {
    const { isMobile } = useDevice()
    const bundleLinks: Link[] = [
      {
        type: '成人',
        path: '/bundle/2',
      },
      {
        type: '新生兒',
        path: '/bundle/1',
      },
      {
        type: '銀髮族',
        path: '/bundle/23',
      },
    ]

    return {
      bundleLinks: isMobile.value ? [bundleLinks[0]] : bundleLinks,
      description: isMobile.value
        ? 'MY83 幫你把最優惠的組合整理好了'
        : 'MY83 的最強罐頭保單都幫你把最優惠的組合整理好了！融合各家優勢商品，推薦最適合的方案！',
    }
  },
})

interface Link {
  type: string
  path: string
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.LeaderBoardPromotionSection {
  @include card-primary;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 142px;
  position: fixed;
  right: 0;
  bottom: 40px;
  padding: 16px;
  z-index: 1;

  &__image {
    flex: 0 0 auto;
    width: 60px;
    height: 60px;
  }

  &__title,
  &__description,
  &__action {
    margin-top: 8px;
  }

  &__title {
    color: $gray-primary;
    font-size: 1.125rem;
    font-weight: 500;
  }

  &__description {
    font-size: 0.875rem;
  }

  &__action {
    width: 100%;

    &::v-deep > [type='button'] {
      margin-top: 8px;
    }
  }

  @include max-media('xl') {
    @include card-secondary;

    flex-direction: row;
    width: 100vw;
    bottom: 0;
    padding: 16px 20px;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.15);

    &__image {
      width: 36px;
      height: 36px;
    }

    &__content {
      flex: 0 0 auto;
      margin: 0 10px;
    }

    &__title,
    &__description,
    &__action {
      margin-top: 0px;
    }

    &__title {
      font-size: 1rem;
    }

    &__description {
      font-size: 0.75rem;
    }

    &__action {
      &::v-deep > [type='button'] {
        margin-top: 0px;
        text-align: center;
      }
    }
  }
}
</style>
