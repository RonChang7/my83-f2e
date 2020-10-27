<script lang="ts">
import qs from 'qs'
import { Vue, Component, Emit } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/vue'
import { renderlessComponentWrapper } from '@/utils/render-helper'

@Component
export default class ProductPromotion extends Vue {
  @Emit()
  openPanel() {
    return true
  }

  formattedFee(fee: number) {
    return `$ ${fee} /年`
  }

  requestPath(productName: string) {
    const path = '/request/publishing/category/1'
    const query = {
      content:
        '我已看過 MY83 保險險種說明，我想買\n' +
        `${productName}\n\n` +
        '我這次保險規劃主要的原因是：\n' +
        '最需要優先規劃的保障是：',
      source: 'product',
    }

    return `${path}?=${qs.stringify(query)}`
  }

  get slot() {
    return {
      formattedFee: this.formattedFee,
      requestPath: this.requestPath,
      openPanel: this.openPanel,
    }
  }

  render(h: CreateElement) {
    if (this.$scopedSlots.default) {
      return renderlessComponentWrapper(this.$scopedSlots.default(this.slot), h)
    }
  }
}
</script>
