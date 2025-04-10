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
import { FETCH_INSURANCE_SEARCH_PRODUCT } from '@/store/insurance/insurance.type'

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

        if (!options) return []

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

    // 從 URL 查詢參數初始化過濾器
    const initializeFiltersFromQuery = () => {
      const query = route.value.query

      if (query.status) {
        selectedFilters.statusID = Number(query.status) || 1
      }

      if (query.categoryId) {
        selectedFilters.categoryList = Number(query.categoryId) || 0
      }

      if (query.caseId) {
        selectedFilters.caseId = Number(query.caseId) || 0
      }

      if (query.typeId) {
        selectedFilters.typeId = Number(query.typeId) || 0
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
        statusID: 'status',
        categoryList: 'categoryId',
        caseList: 'caseId',
        typeList: 'typeId',
        tagList: 'tagId',
      }

      const query = Object.keys(selectedFilters).reduce((acc, key) => {
        if (mappingSelectedIds[key]) {
          // 確保值存在且是陣列才調用 join
          const value = selectedFilters[key]
          if (key === 'tagList' && Array.isArray(value) && value.length > 0) {
            acc[mappingSelectedIds[key]] = value.join(',')
          } else if (value !== null && value !== undefined && value !== 0) {
            // 處理非陣列但有效的值（轉成字串），只有非零值添加到查詢
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

    // 獲取產品資料
    const fetchProduct = async () => {
      try {
        // 設置加載狀態
        isLoading.value = true
        emit('loading', true)

        await store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_PRODUCT}`, {
          searchText: route.value.query.q || '',
          status: selectedFilters.statusID.toString(),
          categoryId: selectedFilters.categoryList
            ? selectedFilters.categoryList.toString()
            : '',
          caseId: selectedFilters.caseList
            ? selectedFilters.caseList.toString()
            : '',
          typeId: selectedFilters.typeList
            ? selectedFilters.typeList.toString()
            : '',
          tagId:
            selectedFilters.tagList.length > 0
              ? selectedFilters.tagList.join(',')
              : '',
          page: 1,
          perPage: 10,
        })
        console.log('desktop 資料已更新', selectedFilters)
      } catch (error) {
        console.error('獲取資料失敗:', error)
      } finally {
        // 無論成功失敗，都設置加載狀態為 false
        isLoading.value = false
        emit('loading', false)
      }
    }

    // 重置篩選條件
    const reset = () => {
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

      // 重置後自動應用新的篩選條件
      changeRoute()
      fetchProduct()
    }

    // 更新篩選條件
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

      console.log('更新選項:', key, '值:', val)
      console.log('當前篩選狀態:', selectedFilters)

      // 直接應用篩選條件並獲取新數據
      changeRoute()
      fetchProduct()
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
      fetchProduct,
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
