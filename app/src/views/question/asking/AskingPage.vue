<template>
  <div class="AskingPage">
    <div class="AskingPage__header">
      <h1 class="AskingPage__title">發文到 MY83 討論區</h1>
    </div>
    <div class="AskingPage__row">
      <div class="AskingPage__column left">
        <AskingNotifySection />
      </div>
      <div class="AskingPage__column right">
        <AskingFormSection
          :form-option="transformFormOption"
          :init-content="initContent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import {
  ThisTypedComponentOptionsWithRecordProps,
  PropType,
} from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import AskingNotifySection from '@/components/question/section/AskingNotifySection.vue'
import AskingFormSection from '@/components/question/section/AskingFormSection.vue'
import {
  AskingFormOptionResponse,
  EditQuestionContent,
} from '@/api/question/asking.type'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

const options: ComponentOption = {
  components: {
    AskingNotifySection,
    AskingFormSection,
  },
  props: {
    formOption: {
      type: Object as PropType<Props['formOption']>,
      required: true,
    },
    initContent: {
      type: Object as PropType<Props['initContent']>,
      default: () => {},
    },
  },
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
    transformFormOption() {
      const option: TransformFormOption = {
        purpose: [],
        target: {},
        insurance: {},
      }

      if (_.isEmpty(this.formOption) || !this.isMounted) return option

      option.purpose = this.formOption.purpose_tag_ids.map((tagId) => {
        return {
          text: this.formOption.tag_list[tagId],
          value: tagId,
        }
      })

      option.target = _.reduce(
        this.formOption.purpose_mapping_target_tag_ids,
        (result, value, key) => {
          result[key] = value.map((tagId) => {
            return {
              text: this.formOption.tag_list[tagId],
              value: tagId,
            }
          })
          return result
        },
        {}
      )

      option.insurance = _.reduce(
        this.formOption.mapping_insurance_tag_ids,
        (result, value, key) => {
          if (_.isArray(value)) {
            result[key] = value.map((item) => {
              return {
                name: item.tag_type_name,
                isOpen: item.is_open,
                options: item.tag_ids.map((tagId) => {
                  return {
                    text: this.formOption.tag_list[tagId],
                    value: tagId,
                  }
                }),
              }
            })
          } else {
            result[key] = _.reduce(
              value,
              (option, optionValue, optionKey) => {
                option[optionKey] = optionValue.map((item) => {
                  return {
                    name: item.tag_type_name,
                    isOpen: item.is_open,
                    options: item.tag_ids.map((tagId) => {
                      return {
                        text: this.formOption.tag_list[tagId],
                        value: tagId,
                      }
                    }),
                  }
                })
                return option
              },
              {}
            )
          }
          return result
        },
        {}
      )

      return option
    },
  },
  mounted() {
    this.isMounted = true
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

export interface Data {
  isMounted: boolean
}

export type Methods = {}

export interface Computed {
  transformFormOption: TransformFormOption
}

export interface Props {
  formOption: AskingFormOptionResponse
  initContent: EditQuestionContent | {}
}

export interface InsuranceTagOption {
  name: string
  isOpen: boolean
  options: SelectOption[]
}

export interface TransformFormOption {
  purpose: SelectOption[]
  target: Record<string, SelectOption[]>
  insurance: Record<
    string,
    Record<string, InsuranceTagOption[]> | InsuranceTagOption[]
  >
}

export default options
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.AskingPage {
  display: flex;
  flex-direction: column;
  padding: 40px 0 60px;
  background: $primary-bg;

  @include max-media('xl') {
    padding: 0 0 90px;
  }

  &__header,
  &__row {
    display: flex;
    justify-content: center;

    @include max-media('xl') {
      flex-direction: column;
    }
  }

  &__title {
    color: $gray-primary;
    width: 740px;
    margin: 0 0 10px 380px;
    font-size: 1.75rem;
    font-weight: 500;

    @include max-media('xl') {
      width: auto;
      margin: 0;
      padding: 20px 0;
      text-align: center;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    &.right {
      width: 740px;
    }

    &.left {
      width: 360px;
      margin-top: -52px;
      margin-bottom: 10px;
    }

    &.left,
    &.right {
      @include max-media('xl') {
        width: 100%;
        margin-top: 0;
      }
    }
  }
}
</style>
