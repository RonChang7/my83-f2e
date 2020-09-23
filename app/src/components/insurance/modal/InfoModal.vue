<template>
  <BaseInfoModal
    :visible="visible"
    :lock-scroll="lockScroll"
    @close="closePanel"
  >
    <div ref="infoModal" class="InfoModal">
      <div class="InfoModal__navbar">
        <div
          v-for="tab in navTabs"
          :key="tab.key"
          class="InfoModal__navbar__item"
          :class="{ active: tab.key === activeTab }"
          @click="() => $emit('update-active-tab', tab.key)"
        >
          <span>{{ tab.value }}</span>
        </div>
      </div>
      <div class="InfoModal__panel">
        <GlossaryPanel v-show="activeTab === 'glossary'" :data="glossary" />
        <PrinciplePanel v-show="activeTab === 'principle'" :data="principle" />
      </div>
    </div>
  </BaseInfoModal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import GlossaryPanel from './GlossaryPanel.vue'
import PrinciplePanel from './PrinciplePanel.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import { Glossary, Principle } from '@/api/insurance/insurance.type'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'

const options: ComponentOption = {
  components: {
    BaseInfoModal,
    GlossaryPanel,
    PrinciplePanel,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    activeTab: {
      type: String as PropType<Props['activeTab']>,
      required: true,
    },
  },
  methods: {
    closePanel() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
  computed: {
    navTabs() {
      return [
        {
          key: 'glossary',
          value: `${this.$store.state.insurance.name}的名詞解釋`,
        },
        {
          key: 'principle',
          value: '黃金投保原則',
        },
      ]
    },
    glossary() {
      return this.$store.state.insurance.glossary
    },
    principle() {
      return this.$store.state.insurance.principle
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.infoModal.scrollTop = 0
        })
      }
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
  $refs: {
    infoModal: HTMLElement
  }
  $store: Store<InsuranceVuexState>
}

export interface Data {}

export type Methods = {
  closePanel(): void
}

export interface Computed {
  navTabs: NavTab[]
  glossary: Glossary | null
  principle: Principle | null
}

export interface Props {
  visible: boolean
  lockScroll: boolean
  activeTab: 'glossary' | 'principle'
}

interface NavTab {
  key: string
  value: string
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.InfoModal {
  padding: 9px 41px 33px;
  width: 770px;

  @include max-media('lg') {
    padding: 5px 15px 29px;
    width: calc(100vw - 54px);
    max-height: calc(100vh - 76px);
    overflow: auto;
  }

  &__navbar {
    display: flex;
    border-bottom: 1px solid $gray-quaternary;
    color: $text-default-color;

    &__item {
      flex: 1 1 50%;
      text-align: center;
      font-size: 1.375rem;
      cursor: pointer;

      @include max-media('lg') {
        font-size: 1rem;
      }

      > span {
        display: inline-flex;
        flex-direction: column;

        &:after {
          content: '';
          margin-top: 16px;

          @include max-media('lg') {
            margin-top: 10px;
          }
        }
      }

      &.active {
        color: $secondary-color;
        font-weight: 500;

        > span:after {
          content: '';
          display: flex;
          border: 2px solid $secondary-color;
          border-radius: 2px;
          margin-top: 12px;

          @include max-media('lg') {
            border: 1px solid $secondary-color;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
