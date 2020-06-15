<template>
  <form class="BaseSearch" @submit.prevent="submit">
    <input
      class="BaseSearch__search"
      type="search"
      :value="value"
      :placeholder="placeholder"
      @input="input"
    />
    <BaseSearchIcon class="BaseSearch__button" @click.native="submit" />
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import BaseSearchIcon from '@/components/base/icon/24/BaseSearch.vue'

const options: ComponentOption = {
  components: {
    BaseSearchIcon,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  methods: {
    input(e) {
      const el = e.target as HTMLInputElement
      this.$emit('update:value', el.value)
      this.$emit('update', el.value)
    },
    submit() {
      this.$emit('submit')
    },
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

export interface Methods {
  input(e: Event): void
  submit(): void
}

export interface Computed {}

export interface Props {
  value: string
  placeholder: string
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.BaseSearch {
  @include card-primary;

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 13px 20px 13px 16px;

  @include max-media('xl') {
    height: 40px;
  }

  &__search {
    width: 100%;
    margin-right: 16px;
    border: 0;
    line-height: $line-height;

    &:focus {
      outline: 0;
    }

    &::placeholder {
      color: $gray-tertiary;
      letter-spacing: normal;
    }
  }

  &__button {
    flex: 0 0 auto;
    cursor: pointer;

    &:hover {
      &::v-deep {
        > path {
          fill: $gray-primary;
        }
      }
    }
  }
}
</style>
