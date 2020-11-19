<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { renderlessComponentWrapper } from '@/utils/render-helper'
import { delimitIntegerWithSymbol } from '@/utils/digital'

@Component
export default class ProductPromotion extends Vue {
  @Emit()
  openModal() {
    return true
  }

  getFormattedFee(fee: number) {
    const feeString = fee < 0 ? '　-　' : delimitIntegerWithSymbol(fee)
    return `${feeString}元 /年`
  }

  get slot() {
    return {
      getFormattedFee: this.getFormattedFee,
      openModal: this.openModal,
    }
  }

  render(h) {
    if (this.$scopedSlots.default) {
      return renderlessComponentWrapper(this.$scopedSlots.default(this.slot), h)
    }
  }
}
</script>
