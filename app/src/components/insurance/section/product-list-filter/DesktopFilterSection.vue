<template>
  <div class="DesktopFilterSection__wrapper">
    <BaseCard
      v-for="option in formattedInsuranceOptions"
      :key="option.key"
      class="DesktopFilterSection"
    >
      <template #title>{{ option.title }}</template>
      <template #default>
        <div class="DesktopFilterSection__content">
          <div class="ProductQueryField">
            <div
              v-for="item in option.key !== 'tagList'
                ? option.items
                : showTagList"
              :key="item.id"
              class="ProductQueryField__field"
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
      </template>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  computed,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import BaseCard from '@/components/my83-ui-kit/card/BaseCard.vue'
import { InsuranceVuexState } from '@/views/insurance/page/Index.vue'
import Checkbox from '@/components/insurance/product/input-field/Checkbox.vue'
import Radio from '@/components/insurance/product/input-field/Radio.vue'
export default defineComponent({
  components: {
    BaseCard,
    Checkbox,
    Radio,
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
      statusList: InsuranceItem[]
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
      statusList: '保險產品狀態',
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
              key === 'statusList' || key === 'tagList'
                ? options[key]
                : [{ id: 0, name: '全部' }, ...options[key]],
          }))
      }
    )
    // 選中的過濾器
    const selectedFilters = reactive({
      statusList: 1,
      categoryList: 0,
      caseList: 0,
      typeList: 0,
      tagList: [],
    })

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

    return {
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
@import '@/sass/rwd.scss';

.DesktopFilterSection {
  margin-bottom: 10px;

  &__content {
    padding: 16px 0;
    color: $gray-primary;
  }

  &__field {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
  .dialog__expand {
    display: flex;
    align-items: center;
    margin: 20px auto;
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
}
</style>
