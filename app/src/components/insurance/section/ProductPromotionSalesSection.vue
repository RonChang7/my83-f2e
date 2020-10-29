<template>
  <div ref="section" class="ProductPromotionSalesSection">
    <div class="ProductPromotionSalesSection__title">
      想買保險，
      <br />
      但不知道怎麼選？
    </div>
    <div class="ProductPromotionSalesSection__content">
      <div class="ProductPromotionSalesSection__description">
        直接到 MY83
        保險達人榜，免費詢問站上活躍的業務員，讓專業、好評、回覆迅速的業務員來幫你！
      </div>
      <BaseButton
        to="/searchSales"
        size="l-a"
        type="quaternary"
        :is-full-width="!isDesktop"
      >
        找業務員
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import DeviceMixin from '@/mixins/device/device-mixins'

@Component({
  components: {
    BaseButton,
  },
})
export default class ProductPromotionSalesSection extends Mixins(DeviceMixin) {
  $refs: {
    section: HTMLElement
  }

  calcMobileBackgroundPositionY() {
    const maxWidth = 420
    const elWidth = this.$refs.section.offsetWidth

    return Math.round((maxWidth - elWidth) / 2.875) - 28
  }

  mounted() {
    if (!this.isDesktop) {
      this.$nextTick(() => {
        ;(this.$refs
          .section as HTMLElement).style.backgroundPositionY = `${this.calcMobileBackgroundPositionY()}px`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductPromotionSalesSection {
  @include card-primary;

  display: flex;
  flex-direction: column;
  background: url('#{$image-bucket-url}/front/insurance/bg-ad-sales-desktop-2@2x.png')
    top center/contain no-repeat;
  background-color: #ffccb1;
  padding: 20px;
  border: 0;

  &__title {
    color: #fff;
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 120px;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__description {
    color: $gray-primary;
    font-size: 0.875rem;
    margin-bottom: 18px;
  }

  @include max-media('xl') {
    margin: 0 auto;
    max-width: 420px;
    width: calc(100% - 40px);
    background: url('#{$image-bucket-url}/front/insurance/bg-ad-sales-mobile@2x.png')
      center top / contain no-repeat;
    background-color: #ffccb1;
    padding: 16px;

    &__title {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 24px;
      text-align: left;

      > br {
        display: none;
      }
    }

    &__content {
      flex-direction: row;
      align-items: flex-end;
    }

    &__description {
      width: 170px;
      flex: 0 0 auto;
      margin: 0;
      margin-right: 16px;
    }
  }
}
</style>
