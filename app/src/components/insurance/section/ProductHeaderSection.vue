<template>
  <div class="ProductHeaderSection">
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__row">
        <div class="ProductHeaderSection__column">
          <div class="ProductHeaderSection__breadcrumbs">
            <span v-for="(breadcrumb, index) in breadcrumbs" :key="index">
              <GlobalLink :to="breadcrumb.link.path">
                {{ breadcrumb.name }}
              </GlobalLink>
            </span>
          </div>
          <div class="ProductHeaderSection__company">{{ company }}</div>
        </div>
        <div
          v-if="onlineProduct && isMobile"
          class="ProductHeaderSection__column"
        >
          <div class="ProductHeaderSection__onlineProduct">
            <BaseButton
              class="active"
              :to="onlineProduct.link.path"
              :size="isMobile ? 'm' : 'l-a'"
              type="secondary"
              :is-full-width="true"
            >
              {{ onlineProduct.text }}
            </BaseButton>
          </div>
        </div>
      </div>
      <h1 class="ProductHeaderSection__name">{{ name }}</h1>
      <div
        v-if="onlineProduct && !isMobile"
        class="ProductHeaderSection__onlineProduct"
      >
        <BaseButton
          class="active"
          :to="onlineProduct.link.path"
          :size="isMobile ? 'm' : 'l-a'"
          type="secondary"
          :is-full-width="true"
        >
          {{ onlineProduct.text }}
        </BaseButton>
      </div>
      <div
        v-if="badges.length || rankingBadge"
        class="ProductHeaderSection__featureTags"
      >
        <ProductFeatureTag
          v-for="(tag, index) in badges"
          :key="index"
          :tag="tag"
        />
        <div v-if="rankingBadge" class="ProductHeaderSection__rankingTag">
          <BaseTag small type="primary-outline">
            {{ rankingBadge.text }}
          </BaseTag>
          <span>{{ rankingBadge.description }}</span>
        </div>
      </div>
      <div class="ProductHeaderSection__features">{{ features }}</div>
      <div v-if="viewCount" class="ProductHeaderSection__viewCount">
        有
        <span>{{ viewCount }}</span>
        人有興趣
      </div>
    </div>
    <div class="ProductHeaderSection__column">
      <div class="ProductHeaderSection__files">
        <BaseButton
          v-for="(file, index) in files"
          :key="index"
          :to="file.link.url"
          :size="isMobile ? 's' : 'm'"
          type="tertiary"
          target="_blank"
        >
          {{ file.text }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { useDevice } from '@/mixins/device/device-mixins'
import { useStore } from '@/utils/composition-api'
import GlobalLink from '@/components/base/global-link/GlobalLink.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseTag from '@/components/my83-ui-kit/tag/BaseTag.vue'
import ProductFeatureTag from '../product/ProductFeatureTag.vue'

export default defineComponent({
  components: {
    GlobalLink,
    BaseButton,
    BaseTag,
    ProductFeatureTag,
  },
  setup() {
    const store = useStore<InsuranceProductVuexState>()
    const { isMobile } = useDevice()
    const breadcrumbs = computed(
      () => store.state.pageMeta.pageMeta?.breadcrumbs
    )
    const company = computed(
      () => store.state.insuranceProduct.product?.product.company
    )
    const name = computed(
      () => store.state.insuranceProduct.product?.product.name
    )
    const features = computed(() =>
      store.state.insuranceProduct.product?.product.features.join('．')
    )
    const viewCount = computed(
      () => store.state.insuranceProduct.product?.product.view_count
    )
    const files = computed(() => store.state.insuranceProduct.product?.files)
    const onlineProduct = computed(
      () => store.state.insuranceProduct.product?.online_product
    )
    const badges = computed(
      () => store.state.insuranceProduct.product?.product.badges
    )
    const rankingBadge = computed(
      () => store.state.insuranceProduct.product?.product.ranking_badge
    )

    return {
      isMobile,
      breadcrumbs,
      company,
      name,
      features,
      viewCount,
      files,
      onlineProduct,
      badges,
      rankingBadge,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.ProductHeaderSection {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &__column {
    flex: 1 1 auto;
  }

  &__row {
    display: flex;
    justify-content: space-between;
  }

  &__breadcrumbs {
    font-size: 0.875rem;

    span:after {
      content: '>';
    }

    a {
      @include hover('_gray-secondary-lighter');
    }
  }

  &__company {
    color: $secondary-color;
    font-size: 1.375rem;
    font-weight: 500;
    margin-top: 12px;
  }

  &__name {
    margin: 0;
    color: $gray-primary;
    font-size: 1.75rem;
    font-weight: 500;
    margin-bottom: 6px;
  }

  &__onlineProduct {
    width: 136px;
    padding: 6px 0 8px;
  }

  &__featureTags {
    @include inline-block-space-remove-parent;

    & > * {
      @include inline-block-space-remove-child;
      display: inline-block;
      margin: 0 8px 6px 0;
    }
  }

  &__rankingTag {
    > span {
      margin-left: 3px;
      color: $primary-color;
      font-size: 0.875em;
      font-weight: 500;
    }
  }

  &__features,
  &__viewCount {
    font-size: 0.875rem;
  }

  &__viewCount > span {
    font-size: 1.25rem;
    font-weight: 500;
  }

  &__files {
    margin-top: 10px;
    text-align: right;

    > [type='button']:not(:last-child) {
      margin-right: 12px;
    }
  }

  @include max-media('xl') {
    padding: 0 20px;
    flex-direction: column;

    &__company {
      font-size: 1.125rem;
      margin-top: 4px;
    }

    &__name {
      font-size: 1.375rem;
      margin-bottom: 8px;
    }

    &__onlineProduct {
      width: 124px;
      padding: 0;
      float: right;
    }

    &__features,
    &__viewCount {
      font-size: 0.75rem;
    }

    &__viewCount > span {
      font-size: 1rem;
    }

    &__files {
      text-align: left;
      margin-top: 14px;
    }
  }
}
</style>
