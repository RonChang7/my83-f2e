<template>
  <div class="HeaderSearch">
    <div class="HeaderSearch__input" :class="{ focus: isFocus }">
      <BaseSearch />
      <form action="" @submit.prevent="">
        <BaseInput
          ref="inputEl"
          :value.sync="searchText"
          placeholder="搜尋保險商品"
          type="search"
          @focus="isFocus = true"
          @blur="isFocus = false"
          @enter="submit"
        />
      </form>
      <div class="HeaderSearch__close">
        <!-- eslint-disable-next-line vue/attribute-hyphenation -->
        <BaseClose viewBox="0 0 24 24" @click="$emit('close')" />
      </div>
    </div>
    <div class="HeaderSearch__mobileClose">
      <BaseButton size="s" type="secondary" @click.native="$emit('close')">
        返回
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import BaseSearch from '@/assets/icon/18/BaseSearch.svg'
import BaseClose from '@/assets/icon/24/BaseClose.svg'
import BaseInput from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import { scrollToPosition } from '@/utils/scroll'

export default defineComponent({
  components: {
    BaseSearch,
    BaseClose,
    BaseInput,
    BaseButton,
  },
  setup(_, ctx) {
    const route = useRoute()
    const router = useRouter()
    const inputEl = ref<Vue | null>(null)
    const isFocus = ref(false)
    const searchText = ref('')
    const submit = () => {
      if (!searchText.value.length) return

      router.push(`/insurance/search?q=${searchText.value}`)
    }

    watch(
      () => route.value.fullPath,
      () => {
        searchText.value = ''
        inputEl.value!.$el.querySelector('input')!.blur()
        ctx.emit('close')

        nextTick(() => {
          scrollToPosition({
            to: 0,
            container: window,
            vertical: true,
          })
        })
      }
    )

    onMounted(() => {
      inputEl.value!.$el.querySelector('input')!.focus()
    })

    return {
      inputEl,
      isFocus,
      searchText,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.HeaderSearch {
  @include max-media('xl') {
    display: flex;
    width: 100%;
    align-items: center;

    & > * {
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }

  &__input {
    display: flex;
    align-items: center;

    @include input;

    &.focus {
      padding-bottom: 8px;
      border-bottom: 2px solid $secondary-color;
    }

    ::v-deep input {
      border-radius: 0;

      @include hide-search-input-cross;
    }
  }

  &__close {
    display: flex;
    position: relative;
    top: -10px;
    right: -8px;

    > svg {
      width: 12px;
      height: 12px;
    }

    @include max-media('xl') {
      display: none;
    }
  }

  &__mobileClose {
    flex: 0 0 auto;

    @include min-media('xl') {
      display: none;
    }
  }
}
</style>
