<template>
  <BaseInfoModal
    :visible="visible"
    :lock-scroll="lockScroll"
    @close="closePanel"
  >
    <div class="ProductHowToBuyModal">
      <div class="ProductHowToBuyModal__header">如何在 MY83 買保險？</div>
      <div class="ProductHowToBuyModal__body">
        <div
          v-for="(info, index) in productHowToBuyInfo"
          :key="index"
          class="ProductHowToBuyModal__card"
        >
          <img :src="`${$imageBucketUrl}${info.image}`" :alt="info.title" />
          <div class="ProductHowToBuyModal__info">
            <div class="ProductHowToBuyModal__title">
              <span>步驟 {{ index + 1 }}</span>
              <div v-if="index > 0" class="line"></div>
              {{ info.title }}
            </div>
            <div class="ProductHowToBuyModal__content">
              {{ info.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseInfoModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'

@Component({
  components: {
    BaseInfoModal,
  },
})
export default class ProductHowToBuyModal extends Vue {
  @Prop({ type: Boolean, default: false })
  visible: boolean

  @Prop({ type: Boolean, default: true })
  lockScroll: boolean

  productHowToBuyInfo = [
    {
      title: '挑選合適保險',
      content: '依照自身需求，利用 MY83 所推薦的商品，尋找適合自己的保險。',
      image: '/front/tutorials/how-to-buy/img-my-83-step-1.png',
    },
    {
      title: '提出需求',
      content: '發布保險需求，請 MY83 站上的業務員提供專業的建議與規劃。',
      image: '/front/tutorials/how-to-buy/img-my-83-step-2.png',
    },
    {
      title: '選擇業務員',
      content:
        '挑選比較 MY83上不同的業務員，也透過私訊與業務員討論了解商品細節。',
      image: '/front/tutorials/how-to-buy/img-my-83-step-3.png',
    },
    {
      title: '面談成交',
      content:
        '與業務員實際見面討論、確認保單內容，直到成交，並確定售後服務資訊。',
      image: '/front/tutorials/how-to-buy/img-my-83-step-4.png',
    },
  ]

  closePanel() {
    this.$emit('update:visible', false)
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductHowToBuyModal {
  padding: 9px 41px 33px;
  width: 950px;

  @include max-media('lg') {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    margin-top: -9px;
    overflow: auto;
  }

  &__header {
    font-size: 1.375rem;
    font-weight: 500;

    @include max-media('lg') {
      margin-bottom: 12px;
    }
  }

  &__body {
    display: flex;

    @include max-media('lg') {
      flex-direction: column;
    }
  }

  &__card {
    flex: 0 0 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 20px 0;

    > img {
      width: 120px;
      height: 120px;
    }

    @include max-media('lg') {
      flex-direction: row;
      padding: 24px 0 0;

      > img {
        width: 70px;
        height: 70px;
      }
    }
  }

  &__info {
    @include max-media('lg') {
      margin-left: 16px;
    }
  }

  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 500;
    margin: 8px 0 2px;

    > span {
      background: $secondary-bright-color;
      padding: 4px 16px;
      border-radius: 1.5rem;
      margin-bottom: 8px;
      color: $secondary-color;
      font-size: 0.875rem;
    }

    @include max-media('lg') {
      font-size: 1rem;
      flex-direction: row;
      align-items: flex-start;
      margin: 0;

      > span {
        flex: 0 0 auto;
        font-size: 0.75rem;
        margin-right: 8px;
      }
    }
  }

  &__content {
    color: $gray-secondary;
    font-size: 0.875rem;
  }

  @include min-media('lg') {
    .line {
      background: $secondary-light-color;
      width: 105px;
      height: 3px;
      border-radius: 3px;
      margin-bottom: -3px;
      position: relative;
      top: -24px;
      left: -108px;
    }
  }
}
</style>
