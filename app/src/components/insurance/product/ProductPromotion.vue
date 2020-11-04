<script lang="ts">
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
    return fee < 0 ? '$ - /年' : `$ ${fee} /年`
  }

  get slot() {
    return {
      formattedFee: this.formattedFee,
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
