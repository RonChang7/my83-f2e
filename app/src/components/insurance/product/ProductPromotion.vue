<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/vue'
import { renderlessComponentWrapper } from '@/utils/render-helper'
import { delimitIntegerWithSymbol } from '@/utils/digital'

@Component
export default class ProductPromotion extends Vue {
  @Emit()
  openModal() {
    return true
  }

  formattedFee(fee: number) {
    const feeString = fee < 0 ? '　-　' : delimitIntegerWithSymbol(fee)
    return `${feeString}元 /年`
  }

  get slot() {
    return {
      formattedFee: this.formattedFee,
      openModal: this.openModal,
    }
  }

  render(h: CreateElement) {
    if (this.$scopedSlots.default) {
      return renderlessComponentWrapper(this.$scopedSlots.default(this.slot), h)
    }
  }
}
</script>
