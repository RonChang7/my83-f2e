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
                @update="(value) => updateValue(option.key, value)"
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
  useRoute,
  useRouter,
  computed,
  ref,
  onMounted,
  watch,
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
  emits: ['loading'],
  setup(props, { emit }) {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()

    // 加載狀態
    const isLoading = ref(false)

    // 首先定義資料的介面
    interface InsuranceItem {
      id: number
      name: string
    }

    interface InsuranceOptions {
      [key: string]: InsuranceItem[] // 索引簽名，允許動態訪問屬性
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

        if (!options) return []

        return Object.keys(mappingType)
          .filter((key) => options[key])
          .map((key) => ({
            key,
            title: mappingType[key],
            items:
              key === 'tagList'
                ? options[key]
                : [{ id: 0, name: '全部' }, ...options[key]],
          }))
      }
    )

    // 選中的過濾器
    const selectedFilters = reactive({
      categoryList: 0,
      caseList: 0,
      typeList: 0,
      tagList: [],
    })

    // 從 URL 查詢參數初始化過濾器
    const initializeFiltersFromQuery = () => {
      const query = route.value.query

      if (query.categoryId) {
        selectedFilters.categoryList = Number(query.categoryId) || 0
      }

      if (query.caseId) {
        selectedFilters.caseList = Number(query.caseId) || 0
      }

      if (query.typeId) {
        selectedFilters.typeList = Number(query.typeId) || 0
      }

      if (query.tagId) {
        const tagIds = String(query.tagId).split(',').map(Number)
        selectedFilters.tagList = tagIds
      }
    }

    // 當路由查詢參數變更時更新過濾器
    watch(
      () => route.value.query,
      () => {
        initializeFiltersFromQuery()
      },
      { immediate: true }
    )

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

      // 從 URL 初始化過濾器
      initializeFiltersFromQuery()
    })

    const expandTagList = (items: InsuranceItem[]) => {
      isExpandTagList.value = !isExpandTagList.value
      if (isExpandTagList.value) {
        showTagList.value = items
      } else {
        showTagList.value = items.slice(0, 10)
      }
    }

    // 修改路由和獲取新資料
    const changeRoute = () => {
      // 映射到路由查詢參數
      const mappingSelectedIds = {
        categoryList: 'categoryId',
        caseList: 'caseId',
        typeList: 'typeId',
        tagList: 'tagId',
      }

      const query = Object.keys(selectedFilters).reduce((acc, key) => {
        if (mappingSelectedIds[key]) {
          // 確保值存在且是陣列才調用 join
          const value = selectedFilters[key]
          if (key === 'tagList') {
            // 只有當陣列有值且長度大於 0 時才添加
            if (Array.isArray(value) && value.length > 0) {
              acc[mappingSelectedIds[key]] = value.join(',')
            }
            // 不要添加空陣列
          } else if (value !== null && value !== undefined && value !== 0) {
            acc[mappingSelectedIds[key]] = String(value)
          }
        }
        return acc
      }, {})

      // 保留原有的 q 查詢參數
      if (route.value.query.q) {
        query.q = route.value.query.q
      }

      router.push({
        path: route.value.path,
        query,
      })
    }

    // 重置篩選條件
    const reset = () => {
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

      // 重置後自動應用新的篩選條件
      changeRoute()
    }

    // 更新篩選條件
    const updateValue = (key: string, val: number | number[]) => {
      selectedFilters[key] = val
      changeRoute()
    }

    // 監聽篩選條件配置，重置選項
    watch(
      () => store.state.insurance.filter.config,
      () => reset()
    )

    // 監聽加載狀態變化
    watch(
      () => isLoading.value,
      (val) => emit('loading', val)
    )

    return {
      formattedInsuranceOptions,
      selectedFilters,
      updateValue,
      reset,
      isExpandTagList,
      expandTagList,
      showTagList,
      changeRoute,
      isLoading,
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
      font-size: 0;

      span,
      &:after {
        font-size: 1rem;
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
