<template>
  <div class="PromotionSection__wrapper">
    <div ref="section" class="PromotionSection">
      <div class="PromotionSection__title">想買保險，但不知道怎麼挑？</div>
      <div class="PromotionSection__content">
        <div class="PromotionSection__description">
          直接到 MY83 保險達人榜，
          <br class="newline" />
          免費詢問站上活躍的業務員，
          <br class="newline" />
          讓專業、好評、回覆迅速的業務員來幫你！
        </div>
        <div v-if="isDesktop" class="PromotionSection__activeSalesCount">
          {{ activeSalesCountWording }}
        </div>
        <BaseButton
          size="l-b"
          type="quaternary"
          to="/searchSales"
          :is-full-width="!isDesktop"
        >
          找業務員
        </BaseButton>
      </div>
      <div v-if="!isDesktop" class="PromotionSection__activeSalesCount">
        {{ activeSalesCountWording }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    BaseButton,
  },
  props: {
    activeSalesCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    activeSalesCountWording() {
      if (!this.activeSalesCount) return ''
      const wording = `諮詢 ${this.activeSalesCount} 位活躍業務員`

      return this.isDesktop ? `\\  ${wording}  /` : wording
    },
  },
  methods: {
    calcMobileBackgroundPositionY() {
      const maxWidth = 420
      const elWidth = this.$refs.section.offsetWidth

      return Math.round((maxWidth - elWidth) / 4.8) - 16
    },
  },
  mounted() {
    if (!this.isDesktop) {
      this.$nextTick(() => {
        this.$refs.section.style.backgroundPositionY = `${this.calcMobileBackgroundPositionY()}px`
      })
    }
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {
  $refs: {
    section: HTMLElement
  }
}

export interface Data {}

export type Methods = {
  calcMobileBackgroundPositionY(): number
}

export interface Computed {}

export interface Props {
  activeSalesCount: number
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.PromotionSection {
  @include card-primary;

  background: url('#{$image-bucket-url}/front/insurance/bg-ad-sales-desktop@2x.png')
    center -1px / contain no-repeat;
  background-color: #ffccb1;
  border: 0;
  padding: 30px 30px 24px;
  text-align: center;
  margin-bottom: 20px;

  &__title {
    color: #fff;
    font-size: 1.375rem;
    font-weight: 500;
  }

  &__description {
    width: 192px;
    font-size: 0.875rem;
    color: $gray-primary;
    margin: 40px 0 20px;
    text-align: left;
  }

  &__activeSalesCount {
    height: 24px;
    margin: 0 0 6px;
    color: $gray-primary;
    font-size: 0.875rem;
    text-align: center;
  }

  @include max-media('xl') {
    margin: 16px 16px 20px;
    max-width: 420px;
    width: 100%;
    background: url('#{$image-bucket-url}/front/insurance/bg-ad-sales-mobile@2x.png')
      center top / contain no-repeat;
    background-color: #ffccb1;
    padding: 16px;
    text-align: left;

    &__wrapper {
      display: flex;
      justify-content: center;
    }

    &__title {
      font-size: 1.125rem;
    }

    &__content {
      display: flex;
      align-items: flex-end;
    }

    &__description {
      margin: 26px 16px 0 0;
      width: 176px;
      flex: 0 0 auto;
    }

    &__activeSalesCount {
      height: 16px;
      margin: 6px 0 0;
      color: $gray-primary;
      font-size: 0.75rem;
      text-align: right;
    }
  }
}

@include max-media('xl') {
  .newline {
    display: none;
  }
}
</style>
