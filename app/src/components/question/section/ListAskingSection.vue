<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BasePencil from '@/components/base/icon/24/BasePencil.vue'

const options: ComponentOption = {
  render(h) {
    return h(
      'div',
      {
        staticClass: 'ListAskingSection',
      },
      [
        h(BaseButton, {
          props: {
            size: 'xl',
          },
          nativeOn: {
            click: () => this.$router.push('/question/asking'),
          },
          scopedSlots: {
            icon: () => h(BasePencil),
            default: () => '我要發問',
          },
        }),
      ]
    )
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

export interface Instance extends Vue {}

export interface Data {}

export interface Methods {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
.ListAskingSection {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
</style>
