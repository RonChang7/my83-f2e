<template>
  <div v-if="faqs" class="FaqSection">
    <h2>常見問題</h2>
    <div v-for="(faq, index) in faqs" :key="index" class="FaqSection__collapse">
      <BaseCollapse
        :is-active="activeList[index]"
        @toggle="toggleActiveCollapse(index)"
      >
        <template v-slot:title>
          <div class="FaqSection__collapse__title">
            <span>{{ index + 1 }}. {{ faq.question }}</span>
            <BaseArrowTop v-if="activeList[index]" />
            <BaseArrowDown v-else />
          </div>
        </template>
        <template v-slot:content>
          <div class="FaqSection__collapse__content">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="faq.answer" />
            <div
              v-if="faq.recommend_blogs"
              class="FaqSection__collapse__linkWrapper"
            >
              <span>推薦閱讀：</span>
              <div class="FaqSection__collapse__link">
                <GlobalLink
                  v-for="link in faq.recommend_blogs"
                  :key="link.title"
                  :to="link.link"
                >
                  {{ link.title }}
                </GlobalLink>
              </div>
            </div>
          </div>
        </template>
      </BaseCollapse>
    </div>
    <section class="FaqSection__footer">
      <div class="FaqSection__footer__image">
        <BaseLazyImage
          :image-url="`${$imageBucketUrl}/front/common/my-83-cat@2x.png`"
          :ignore-placeholder="true"
        />
      </div>
      <div class="FaqSection__footer__bubble">
        <span>
          {{ bubbleWording }}投保前務必謹慎小心，如果有任何問題，歡迎在
          <GlobalLink :to="{ name: 'questionList' }">MY83 討論區</GlobalLink>
          和其他保戶以及專業業務員討論哦！
        </span>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { Faq } from '@/api/insurance/insurance.type'
import BaseCollapse from '@/components/base/collapse/BaseCollapse.vue'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseArrowTop from '@/components/base/icon/24/BaseArrowTop.vue'
import BaseArrowDown from '@/components/base/icon/24/BaseArrowDown.vue'
import BaseLazyImage from '@/components/base/lazy-load-image/BaseLazyImage.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    BaseCollapse,
    GlobalLink,
    BaseArrowTop,
    BaseArrowDown,
    BaseLazyImage,
  },
  data() {
    return {
      activeList: [],
    }
  },
  computed: {
    faqs() {
      return this.$store.state.insurance.staticData.faq
    },
    bubbleWording() {
      return this.$store.state.insurance.staticData.isExternal
        ? 'MY83 保險網提醒大家，'
        : 'MY83 保險網知道，保險是會陪伴大家很久的商品！'
    },
  },
  methods: {
    toggleActiveCollapse(index) {
      this.$set(this.activeList, index, !this.activeList[index])
    },
  },
  watch: {
    faqs: {
      immediate: true,
      handler() {
        let defaultActiveList = Array(this.faqs?.length).fill(true)

        if (this.isMobile) {
          defaultActiveList = defaultActiveList.fill(false, 1)
        }

        this.activeList = defaultActiveList
      },
    },
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
  $store: Store<InsuranceVuexState>
}

export interface Data {
  activeList: boolean[]
}

export type Methods = {
  toggleActiveCollapse(index: number): void
}

export interface Computed {
  faqs: Faq[] | null
  bubbleWording: string
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/elements.scss';
@import '@/sass/rwd.scss';

.FaqSection {
  width: 1120px;
  color: $gray-primary;

  @include max-media('xl') {
    width: 100%;
    font-size: 0.875rem;
    padding: 0 20px;
  }

  ::v-deep em {
    @include emphasize;
  }

  ::v-deep ul,
  ::v-deep ol {
    padding: 0 0 0 1.5em;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 500;
    margin: 0 0 16px;
  }

  &__collapse {
    padding: 24px 16px;
    border-top: 1px solid $gray-quaternary;

    @include max-media('xl') {
      padding: 16px 0;
    }

    &:last-of-type {
      border-bottom: 1px solid $gray-quaternary;
    }

    &__title {
      display: flex;
      justify-content: space-between;
      font-size: 1.125rem;
      font-weight: 500;
      cursor: pointer;

      @include max-media('xl') {
        font-size: 1rem;
        margin-left: 4px;
      }
    }

    &__content {
      padding: 24px;
      margin-top: 12px;
      background: $primary-bg;
      border-radius: $border-radius;

      > div:not(:last-child) {
        margin-bottom: 1em;
      }

      @include max-media('xl') {
        padding: 16px;
      }
    }

    &__linkWrapper {
      display: flex;

      @include max-media('xl') {
        flex-direction: column;
      }
    }

    &__link {
      display: flex;
      flex-direction: column;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;

    @include max-media('xl') {
      flex-direction: column;
      padding: 16px 0;
    }

    &__image {
      width: 76px;
      height: 104px;

      @include max-media('xl') {
        width: 61px;
        height: 82px;
      }
    }

    &__bubble {
      display: flex;
      align-items: center;
      background: url('#{$image-bucket-url}/front/insurance/reminder-bubble-desktop.svg');
      width: 641px;
      height: 133px;
      margin-left: 12px;
      padding: 25px 82px 35px 76px;
      color: $secondary-color;
      font-weight: 500;

      @include max-media('xl') {
        background: url('#{$image-bucket-url}/front/insurance/reminder-bubble-mobile.svg');
        background-size: cover;
        width: 338px;
        height: 156px;
        padding: 32px 28px 38px;
        margin: -24px 0 0;
      }
    }
  }
}
</style>
