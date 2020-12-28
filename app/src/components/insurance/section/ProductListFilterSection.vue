<template>
  <BaseCard class="ProductListFilterSection">
    <template v-slot:title>投保資料</template>
    <template v-slot>
      <div class="ProductListFilterSection__content">
        <ProductQueryField
          v-for="option in options"
          :key="option.id"
          class="ProductListFilterSection__field"
          :option="option"
          :value="getValue(option.id)"
          @update="updateFilterOption"
        />
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ProductQueryField from '../product/ProductQueryField.vue'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { InsuranceFilterFormService } from '@/services/product/InsuranceFilterFormService'
import { FieldOption, OptionScheme } from '@/services/product/field.type'
import { UpdateInsuranceListFilterPayload } from '@/store/insurance/insurance'
import { UPDATE_INSURANCE_LIST_FILTER } from '@/store/insurance/insurance.type'

@Component({
  components: {
    BaseCard,
    ProductQueryField,
  },
})
export default class ProductListFilterSection extends Vue {
  insuranceFilterFormService: InsuranceFilterFormService

  options: FieldOption<OptionScheme>[] = []

  getValue(id: string) {
    return (
      (this.$store.state as InsuranceVuexState).insurance.currentParam[id] || ''
    )
  }

  updateFilterOption(payload: UpdateInsuranceListFilterPayload) {
    this.$store.dispatch(`insurance/${UPDATE_INSURANCE_LIST_FILTER}`, payload)
  }

  created() {
    const premiumConfig = (this.$store.state as InsuranceVuexState).insurance
      .filter.premiumConfig
    if (!premiumConfig) return

    this.insuranceFilterFormService = new InsuranceFilterFormService()
    this.insuranceFilterFormService.create(premiumConfig)
    this.options = this.insuranceFilterFormService.options
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductListFilterSection {
  margin-bottom: 20px;

  &__content {
    padding: 16px 0;
    color: $gray-primary;
  }

  &__field {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @include max-media('xl') {
    margin-bottom: 10px;
  }
}
</style>
