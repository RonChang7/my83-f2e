<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  functional: true,
  render(h) {
    return h('div', { staticClass: 'BannerSection' }, [
      h('h1', '保險討論區'),
      h('div', [
        h('h2', '透明自由的保險討論平台'),
        h('span', '，'),
        h('p', '只要是保險，什麼都能問'),
      ]),
    ])
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';
$background-max-width: 1600px;

.BannerSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('#{$image-bucket-url}/front/question/banner.png') center
    bottom no-repeat;
  background-size: contain;
  width: 100%;
  height: 200px;
  color: $gray-primary;
  font-size: 1.125rem;

  @media (min-width: $background-max-width) {
    background-size: $background-max-width;
  }

  > *,
  div > * {
    margin: 0;
    font-weight: 500;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    font-size: 2.25rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  span {
    display: none;
  }

  @include max-media('xl') {
    height: 112px;
    justify-content: flex-start;
    padding-top: 12px;

    div {
      display: flex;
      flex-direction: row;
    }

    h1 {
      font-size: 1.375rem;
    }

    h2,
    p,
    span {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 400;
      color: $gray-secondary;
    }
  }
}
</style>
