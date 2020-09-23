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
            <div v-if="faq.recommend_blogs" class="d-flex">
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
        MY83
        保險網知道，保險是會陪伴大家很久的商品！投保前務必謹慎小心，如果有任何問題，歡迎在
        <GlobalLink :to="{ name: 'questionList' }">MY83 討論區</GlobalLink>
        和其他保戶以及專業業務員討論哦！
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

const options: ComponentOption = {
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
      return this.$store.state.insurance?.faq
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
        this.activeList = Array(this.faqs?.length).fill(true)
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

export interface Instance extends Vue {
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
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/elements.scss';

.FaqSection {
  width: 1120px;
  color: $gray-primary;

  ::v-deep em {
    @include emphasize;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 500;
  }

  &__collapse {
    padding: 24px 16px;
    border-top: 1px solid $gray-quaternary;

    &:last-of-type {
      border-bottom: 1px solid $gray-quaternary;
    }

    &__title {
      display: flex;
      justify-content: space-between;
      font-size: 1.125rem;
      font-weight: 500;
      cursor: pointer;
    }

    &__content {
      padding: 24px;
      margin-top: 12px;
      background: $primary-bg;
      border-radius: $border-radius;

      > div:not(:last-child) {
        margin-bottom: 1em;
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

    &__image {
      width: 76px;
      height: 104px;
    }

    &__bubble {
      background: url('https://images.my83.com.tw/front/insurance/reminder-bubble-desktop.svg');
      width: 641px;
      height: 133px;
      margin-left: 12px;
      padding: 25px 82px 35px 76px;
      color: $secondary-color;
      font-weight: 500;
    }
  }
}
</style>
