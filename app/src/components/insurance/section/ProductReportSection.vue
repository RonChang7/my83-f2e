<template>
  <div class="ProductReportSection">
    <BaseInfoModal :visible="visible" :lock-scroll="true" @close="panel.close">
      <ProductReportForm
        :product-name="productName"
        :product-id="productId"
        :visible="visible"
        @close="panel.close"
        @submit-status="handlerSubmitStatus"
      />
    </BaseInfoModal>
    <BaseButton
      type="secondary"
      size="m"
      :is-full-width="true"
      @click.native="panel.open"
    >
      商品資訊回報
    </BaseButton>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import ProductReportForm from '../product/ProductReportForm.vue'

export default defineComponent({
  components: {
    BaseInfoModal,
    BaseButton,
    ProductReportForm,
  },
  setup() {
    const { $sentry, $notification } = useContext()
    const store = useStore<InsuranceProductVuexState>()
    const productName = store.state.insuranceProduct.product!.product.name
    const productId = store.state.insuranceProduct.product!.product.id
    const visible = ref(false)

    const panel = {
      open: () => (visible.value = true),
      close: () => (visible.value = false),
    }

    const handlerSubmitStatus = ({
      status,
      error,
    }: {
      status: 'success' | 'error'
      error?: Error
    }) => {
      if (status === 'success') {
        $notification.success('回報成功，感謝你的協助！')
        panel.close()
        return
      }

      error && $sentry.captureException(error)
    }

    return {
      visible,
      panel,
      productName,
      productId,
      handlerSubmitStatus,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductReportSection {
  @include max-media('xl') {
    padding: 20px 20px 0;
  }
}
</style>
