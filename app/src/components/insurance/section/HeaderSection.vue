<template>
  <div class="HeaderSection">
    <div class="HeaderSection__content">
      <h1 class="HeaderSection__title">{{ title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="HeaderSection__description" v-html="description" />
      <div class="HeaderSection__link">
        <BaseButton
          v-for="button in buttonInfos"
          :key="button.value"
          class="HeaderSection__button"
          size="l-a"
          :type="button.value === 'discontinued' ? 'primary' : 'tertiary'"
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
    buttonInfos() {
      const buttonInfos: NavTab[] = []
      if (this.$store.state.insurance.staticData.isExternal) {
        buttonInfos.push({
          key: '重點險種',
          value: 'glossary',
        })
      } else {
        buttonInfos.push(
          {
            key: `${this.name}的名詞解釋`,
            value: 'glossary',
          },
          {
            key: '黃金投保原則',
            value: 'principle',
          }
        )
      }

      if (this.discontinuedProductButtonInfo) {
        buttonInfos.push(this.discontinuedProductButtonInfo)
      }

      return buttonInfos
    },
    discontinuedProductButtonInfo() {
      if (this.$store.state.insurance.staticData.id !== 'disability') return
      if (Date.now() > new Date('2021-01-02 00:00:00').getTime()) return

      return {
        key: `12月最新${this.name}停售表`,
        value: 'discontinued',
      }
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
  buttonInfos: NavTab[]
  discontinuedProductButtonInfo: NavTab | undefined
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
    $width: 230px;

    display: flex;

    ::v-deep #{$self}__button {
      width: $width;

      @include min-media('xl') {
        &:not(:last-child) {
          margin-right: 16px;
        }
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
      width: 100%;
      flex-wrap: wrap;

      ::v-deep #{$self}__button {
        $offset: 16px;

        width: calc(50% - #{$offset} / 2);
        flex: 1 0 auto;

        &:nth-child(even) {
          margin-left: $offset;
        }

        &:nth-child(odd):not(:first-child) {
          margin-top: 12px;
        }
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
