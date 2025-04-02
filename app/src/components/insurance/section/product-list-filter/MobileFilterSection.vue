<template>
  <div class="MobileFilterSection">
    <BaseButton
      size="m"
      type="tertiary"
      :is-full-width="true"
      @click.native="openPanel"
    >
      <BaseFilter18 class="mr-1" />
      篩選商品
    </BaseButton>
    <div class="MobileFilterSection__description">
      {{ productListDescription }}
    </div>
    <BaseInfoModal :visible="visiblePanel" @close="closePanel">
      <div class="MobileFilterSection__title">
        <BaseFilter24 class="mr-1" />
        篩選商品
      </div>
      <div class="MobileFilterSection__content">
        <div
          v-for="option in formattedInsuranceOptions"
          :key="option.key"
          class="MobileFilterSection__section"
        >
          <div class="MobileFilterSection__section__title">
            {{ option.title }}
          </div>
          <div class="MobileFilterSection__section__content">
            <div
              v-for="item in option.key !== 'tagList'
                ? option.items
                : showTagList"
              :key="item.id"
              class="MobileFilterSection__section__field"
            >
              <Radio
                v-if="option.key !== 'tagList'"
                :text="item.name"
                :value="item.id"
                :current-selected-value="
                  Number(selectedFilters[option.key]) || 0
                "
                @update="(value) => updateValue(option.key, value)"
              />
              <Checkbox
                v-else
                :text="item.name"
                :value="item.id"
                :current-selected-values="selectedFilters[option.key] || []"
                @update="updateValue(option.key, item.id)"
              />
            </div>
            <div
              v-if="option.key === 'tagList'"
              class="dialog__expand"
              @click="expandTagList(option.items)"
            >
              <div class="dialog__expand-line"></div>
              <div class="dialog__expand-word">
                <span v-if="!isExpandTagList">展開</span>
                <span v-else>收起</span>
              </div>
              <div class="dialog__expand-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="MobileFilterSection__footer">
        <BaseButton
          size="l-a"
          type="secondary"
          :is-full-width="true"
          @click.native="reset"
        >
          重設
        </BaseButton>
        <BaseButton
          size="l-a"
          type="primary"
          :is-full-width="true"
          @click.native="submit"
        >
          套用
        </BaseButton>
      </div>
    </BaseInfoModal>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useStore,
  watch,
  reactive,
  onMounted,
} from '@nuxtjs/composition-api'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'
import BaseFilter18 from '@/assets/icon/18/BaseFilter.svg'
import BaseFilter24 from '@/assets/icon/24/BaseFilter.svg'
import Checkbox from '@/components/insurance/product/input-field/Checkbox.vue'
import Radio from '@/components/insurance/product/input-field/Radio.vue'

export default defineComponent({
  components: {
    BaseButton,
    BaseInfoModal,
    BaseFilter18,
    BaseFilter24,
    Checkbox,
    Radio,
  },
  props: {
    productListDescription: {
      type: String,
      default: '',
    },
  },
  setup() {
    const store = useStore<InsuranceVuexState>()

    // 首先定義資料的介面
    interface InsuranceItem {
      id: number
      name: string
    }

    interface InsuranceOptions {
      [key: string]: InsuranceItem[] // 索引簽名，允許動態訪問屬性
      statusID: InsuranceItem[]
      categoryList: InsuranceItem[]
      caseList: InsuranceItem[]
      typeList: InsuranceItem[]
      tagList: InsuranceItem[]
    }

    interface FormattedInsuranceOption {
      key: string
      title: string
      items: InsuranceItem[]
    }

    // 定義映射類型
    const mappingType: Record<string, string> = {
      statusID: '保險產品狀態',
      categoryList: '保險種類',
      caseList: '保險年期',
      typeList: '保險類別',
      tagList: '保險特色',
    }

    // 使用 computed 來轉換資料格式
    const formattedInsuranceOptions = computed<FormattedInsuranceOption[]>(
      () => {
        const options = store.state.insurance
          .insuranceOptions as InsuranceOptions

        return Object.keys(mappingType)
          .filter((key) => options[key])
          .map((key) => ({
            key,
            title: mappingType[key],
            items:
              key === 'statusID' || key === 'tagList'
                ? options[key]
                : [{ id: 0, name: '全部' }, ...options[key]],
          }))
      }
    )
    // 選中的過濾器
    const selectedFilters = reactive({
      statusID: 1,
      categoryList: 0,
      caseList: 0,
      typeList: 0,
      tagList: [],
    })

    const updateValue = (key: string, val: number) => {
      if (key === 'tagList') {
        // tagList 是多選
        const index = selectedFilters[key].indexOf(val)

        if (index > -1) {
          // 如果值已經存在，則移除它
          selectedFilters[key].splice(index, 1)
        } else {
          // 如果值不存在，則加入它
          selectedFilters[key].push(val)

          // 如果加入後長度大於 1，檢查並移除值為 0 的元素
          if (selectedFilters[key].length > 1) {
            const zeroIndex = selectedFilters[key].indexOf(0)
            if (zeroIndex > -1) {
              selectedFilters[key].splice(zeroIndex, 1)
            }
          }
        }
      } else {
        // 其他選項都是單選
        selectedFilters[key] = val
      }
    }

    const isExpandTagList = ref(false)
    const showTagList = ref<InsuranceItem[]>([])

    // 初始化時設置默認顯示的標籤列表
    onMounted(() => {
      const tagListOption = formattedInsuranceOptions.value.find(
        (option) => option.key === 'tagList'
      )
      if (tagListOption) {
        showTagList.value = tagListOption.items.slice(0, 10)
      }
    })

    const expandTagList = (items: InsuranceItem[]) => {
      isExpandTagList.value = !isExpandTagList.value
      if (isExpandTagList.value) {
        showTagList.value = items
      } else {
        showTagList.value = items.slice(0, 10)
      }
    }

    const visiblePanel = ref(false)
    const openPanel = () => (visiblePanel.value = true)
    const closePanel = () => (visiblePanel.value = false)
    // const { defaultValue, config } = store.state.insurance.filter

    const reset = function () {
      selectedFilters.statusID = 1
      selectedFilters.categoryList = 0
      selectedFilters.caseList = 0
      selectedFilters.typeList = 0
      selectedFilters.tagList = []
      isExpandTagList.value = false
      const tagListOption = formattedInsuranceOptions.value.find(
        (option) => option.key === 'tagList'
      )
      if (tagListOption) {
        showTagList.value = tagListOption.items.slice(0, 10)
      }
    }

    const submit = () => {
      console.log(selectedFilters)
      // const query = form.value.formData
      // if (route.value.name === InsuranceListType.SEARCH) {
      //   query.q = route.value.query.q
      // }
      // router.push({ query })
      closePanel()
      // nextTick(() => {
      //   ctx.emit('submit')
      // })
    }

    watch(
      () => store.state.insurance.filter.config,
      () => reset()
    )

    return {
      visiblePanel,
      openPanel,
      closePanel,
      reset,
      submit,
      formattedInsuranceOptions,
      selectedFilters,
      updateValue,
      isExpandTagList,
      expandTagList,
      showTagList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/mixins.scss';
@import '@/sass/rwd.scss';

.MobileFilterSection {
  padding: 6px 20px 0;

  &__description {
    margin: 10px 0;
    font-size: 0.875rem;
    color: $gray-primary;

    @include min-media('xl') {
      display: none;
    }
  }

  &__title,
  &__footer {
    @include shadow('01');

    position: absolute;

    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff;
  }

  &__title {
    padding: 16px 20px;
    top: 0;
    font-size: 1.125rem;
    font-weight: 500;
  }

  &__footer {
    padding: 14px 20px;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
    bottom: 0;

    > button {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  &__content {
    margin: 20px -15px 0;
    padding: 0 20px 72px;
    height: 100%;
    overflow: scroll;
  }

  &__section {
    position: relative;

    &__title {
      padding: 12px 0 10px;
    }

    &__content {
      margin-left: 10px;

      &:after {
        content: '';
        display: block;
        margin: 0 -20px 0 -30px;
        border-bottom: 1px solid $secondary-bg;
      }
    }

    &__field {
      margin-bottom: 12px !important;
    }

    ::v-deep &__message {
      padding: 0;
      margin-bottom: 12px;
    }
  }
}

.dialog__expand {
  display: flex;
  align-items: center;
  margin: 20px auto;
  margin-left: -10px;
  text-align: center;
  cursor: pointer;
  color: #1e2b58;

  &:hover {
    color: #ff6a82;
  }

  &-line {
    width: 100%;
    height: 1px;
    background: #bcbcbc;
  }

  &-word {
    white-space: nowrap;
    margin: 0 12px;
    font-size: 0; /* 去除所有空白 */

    span,
    &:after {
      font-size: 1rem; /* 恢復文字大小 */
    }

    &:after {
      content: '保險特色';
    }
  }

  &-btn {
    padding: 12px 40px;
    border-radius: 24px;
    background: #1e2b58;
    color: #fff;
  }

  &-btn:hover {
    background: #8395be;
  }
}
</style>
