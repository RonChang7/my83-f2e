<script lang="ts">
import Vue from 'vue'
import { FunctionalComponentOptions } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'

const options: ComponentOption = {
  functional: true,
  render(h) {
    return h('div', { staticClass: 'BannerSection' }, [
      h('h1', '保險討論區'),
      h('h2', '全台最大保險討論平台'),
      h('p', '只要是保險，什麼都能問'),
    ])
  },
}

export type ComponentOption = FunctionalComponentOptions<Props>

export type ComponentInstance = CombinedVueInstance<Instance, {}, {}, {}, Props>

export interface Instance extends Vue {}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
$background-max-width: 1600px;

.BannerSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('https://images.my83.com.tw/front/question/banner.png') center
    bottom no-repeat;
  background-size: contain;
  width: 100%;
  height: 270px;
  color: $gray-primary;
  font-size: 1.125rem;

  @media (min-width: $background-max-width) {
    background-size: $background-max-width;
  }

  > * {
    margin: 0;
    font-weight: 500;
  }

  h1 {
    font-size: 2.25rem;
  }

  h2 {
    font-size: 1.75rem;
  }
}
</style>
