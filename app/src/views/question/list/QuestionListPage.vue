<template>
  <div class="QuestionListPage">
    <div class="QuestionListPage__row">
      <BannerSection />
    </div>
    <div class="QuestionListPage__row">
      <!-- Search bar -->
      <!-- Asking button -->
    </div>
    <div class="QuestionListPage__row">
      <QuestionLayoutWithFixedColumn>
        <template v-slot:left>
          <div style="height: 3000px; background: white;"></div>
        </template>
        <template v-slot:right>
          <ListGuideSection v-if="isDesktop" />
          <ListRecommendProductSection />
        </template>
      </QuestionLayoutWithFixedColumn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import QuestionLayoutWithFixedColumn from '@/components/question/layout/QuestionLayoutWithFixedColumn.vue'
import BannerSection from '@/components/question/section/BannerSection.vue'
import ListGuideSection from '@/components/question/section/ListGuideSection.vue'
import ListRecommendProductSection from '@/components/question/section/ListRecommendProductSection.vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  components: {
    QuestionLayoutWithFixedColumn,
    BannerSection,
    ListGuideSection,
    ListRecommendProductSection,
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
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {}

export interface Methods {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.QuestionListPage {
  display: flex;
  flex-direction: column;
  padding: 0 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__row {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    @include max-media('xl') {
      flex-direction: column;
    }
  }
}
</style>
