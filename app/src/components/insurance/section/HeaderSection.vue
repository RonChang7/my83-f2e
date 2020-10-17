<template>
  <div class="HeaderSection">
    <div class="HeaderSection__content">
      <h1 class="HeaderSection__title">{{ title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="HeaderSection__description" v-html="description" />
      <div
        class="HeaderSection__link"
        :class="{ single: buttonInfo.length === 1 }"
      >
        <BaseButton
          v-for="button in buttonInfo"
          :key="button.value"
          class="HeaderSection__button"
          size="l-a"
          type="tertiary"
          :is-full-width="true"
          @click.native="openInfoModal(button.value)"
        >
          {{ button.key }}
        </BaseButton>
      </div>
    </div>
    <img v-if="image" :src="image" :alt="name" class="HeaderSection__image" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { NavTab, Props as InfoModalProps } from '../modal/InsuranceTipModal.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

const options: ComponentOption = {
  components: {
    BaseButton,
  },
  computed: {
    title() {
      return this.$store.state.insurance.title
    },
    description() {
      return this.$store.state.insurance.staticData.description
    },
    name() {
      return this.$store.state.insurance.staticData.abbr
    },
    image() {
      return this.$store.state.insurance.staticData.image
    },
    buttonInfo() {
      if (this.$store.state.insurance.staticData.isExternal) {
        return [
          {
            key: '重點險種',
            value: 'glossary',
          },
        ]
      }

      return [
        {
          key: `${this.name}的名詞解釋`,
          value: 'glossary',
        },
        {
          key: '黃金投保原則',
          value: 'principle',
        },
      ]
    },
  },
  methods: {
    openInfoModal(tab) {
      this.$emit('open-modal')
      this.$emit('update-active-tab', tab)
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

export interface Instance extends Vue {
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {
  openInfoModal(tab: InfoModalProps['activeTab']): void
}

export interface Computed {
  title: string
  description: string
  name: string
  image: string
  buttonInfo: NavTab[]
}

export interface Props {}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/elements.scss';
@import '@/sass/rwd.scss';

.HeaderSection {
  $self: &;
  display: flex;
  width: 1120px;
  color: $gray-primary;

  @include max-media('xl') {
    padding: 0 20px;
  }

  ::v-deep em {
    @include emphasize;
  }

  h1 {
    font-size: 2.25rem;
    margin: 0 0 20px;
    font-weight: 500;
  }

  &__content {
    width: 750px;
  }

  &__description {
    margin-bottom: 32px;
  }

  &__link {
    $width: 476px;

    display: flex;
    width: $width;

    &.single {
      width: $width / 2;
    }

    ::v-deep #{$self}__button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  &__image {
    width: 230px;
    height: 230px;
    margin-left: 70px;
  }

  @include max-media('xl') {
    width: 100%;

    h1 {
      font-size: 1.75rem;
      margin: 0 92px 42px 0;
    }

    &__content {
      width: 100%;
      font-size: 0.875rem;
    }

    &__description {
      line-height: 1.5rem;
    }

    &__link {
      $width: 100%;

      width: $width;

      &.single {
        width: $width / 2;
      }
    }

    &__image {
      position: absolute;
      top: 68px;
      right: 26px;
      width: 92px;
      height: 92px;
      margin: 0;
    }
  }
}
</style>
