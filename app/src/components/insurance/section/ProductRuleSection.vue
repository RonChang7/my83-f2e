<template>
  <div v-if="rules" class="ProductRuleSection">
    <h2 class="ProductRuleSection__header">承保規則</h2>
    <div class="ProductRuleSection__content">
      <ol>
        <li v-for="(rule, index) in rules" :key="index">
          {{ rule.title }}

          <ul v-if="rule.content">
            <li
              v-for="(content, contentIndex) in rule.content"
              :key="contentIndex"
            >
              {{ content }}
            </li>
          </ul>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'

@Component
export default class ProductRuleSection extends Vue {
  get rules() {
    return (
      (this.$store.state as InsuranceProductVuexState).insuranceProduct.product
        ?.rules || []
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';

.ProductRuleSection {
  &__header {
    margin: 0;
    margin-bottom: 16px;
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
  }

  &__content {
    @include card-primary;

    padding: 20px 30px;
    color: $gray-primary;

    ul,
    ol {
      margin: 0;
      padding-left: 1.5em;
    }

    ul {
      list-style-type: disc;
    }
  }
}
</style>
