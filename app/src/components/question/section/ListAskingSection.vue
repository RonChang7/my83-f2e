<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import DeviceMixin, {
  ComponentInstance as DeviceMixinComponentInstance,
} from '@/mixins/device/device-mixins'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BasePencil from '@/assets/icon/24/BasePencil.svg'

const options: ComponentOption = {
  mixins: [DeviceMixin],
  render(h) {
    return h(
      'div',
      {
        staticClass: 'ListAskingSection',
      },
      [
        h(BaseButton, {
          props: {
            to: { name: 'questionAsking' },
            size: this.isDesktop ? 'xl' : 'l-b',
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

export interface Instance
  extends Vue,
    Omit<DeviceMixinComponentInstance, keyof Vue> {}

export interface Data {}

export type Methods = {}

export interface Computed {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/rwd.scss';

.ListAskingSection {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  @include max-media('xl') {
    margin: 20px 0;
  }
}
</style>
