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
  useRoute,
  useRouter,
  computed,
  ref,
  onMounted,
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
  setup() {
    const store = useStore<InsuranceVuexState>()
    const route = useRoute()
    const router = useRouter()
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
    const changeRoute = () => {
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
          if (key === 'tagList') {
            acc[mappingSelectedIds[key]] = value.join(',')
          } else if (value !== null && value !== undefined) {
            // 處理非陣列但有效的值（轉成字串）
            acc[mappingSelectedIds[key]] =
              Number(value) === 0 ? '' : String(value)
          }
        }
        return acc
      }, {})

      router.push({
        path: '/insurance/search',
        query: {
          q: route.value.query.q,
          ...query,
        },
      })
    }

    const fetchProduct = async () => {
      await store.dispatch(`insurance/${FETCH_INSURANCE_SEARCH_PRODUCT}`, {
        searchText: route.value.query.q,
        status: route.value.query.statusID,
        categoryId: route.value.query.categoryId,
        caseId: route.value.query.caseId,
        typeId: route.value.query.typeId,
        tagId: route.value.query.tagList,
        page: 1,
        perPage: 10,
      })
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
      // console.log(selectedFilters)
      // console.log(route.value.query)
      changeRoute()
      fetchProduct()
    }

    return {
      formattedInsuranceOptions,
      selectedFilters,
      updateValue,
      isExpandTagList,
      expandTagList,
      showTagList,
      changeRoute,
      fetchProduct,
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
