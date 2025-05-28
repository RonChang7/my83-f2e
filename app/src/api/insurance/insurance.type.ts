import { Route } from 'vue-router'
import { RecommendProduct } from '../question/question.type'
import {
  Link,
  RelatedBlog,
  RelatedQuestion,
  PaginationResponse,
  LinkButton,
  PageResponse,
} from '../type'
import { RankingBadge } from './product.type'

export interface InsurancePageStaticData {
  id: string
  name: string
  query_for_more_question?: string
  is_external?: boolean
  image: string
  description: string
  promotion_wording?: string
  product_list_description?: string
  glossary: Glossary
  principle: Principle
  faq: Faq[]
}

export interface FetchInsurancePageStaticDataPayload {
  host: string
  insurance: string
}

export interface Glossary {
  terms: Term[]
  recommend_blogs: RecommendBlog[]
}

export interface Principle {
  rules: Rule[]
  recommend_blogs: RecommendBlog[]
}

export interface Faq {
  question: string
  answer: string
  recommend_blogs?: RecommendBlog[]
}

export interface Term {
  term: string
  definition: string
}

export interface Rule {
  title: string
  content: string
}

export interface RecommendBlog {
  title: string
  link: Link
}

export interface RelatedBlogsResponse {
  data: RelatedBlog[]
}

export interface RelatedQuestionsResponse {
  data: RelatedQuestion[]
}
export interface InsuranceListResponse extends PageResponse<InsuranceListData> {
  meta: InsuranceListMeta
}

export interface FetchInsuranceSearchListPayload {
  q: string
  page: number
  filters:
    | Record<string, string | number | (string | number)[]>
    | null
    | Route['query']
}

export interface FetchInsuranceListPayload {
  insurance: string
  page: number
  filters:
    | Record<string, string | number | (string | number)[]>
    | null
    | Route['query']
}

export interface SearchNoResultResponse {
  recommend_products: RecommendProduct[]
  promotion_products: PromotionInsuranceProduct[]
}

export interface InsuranceListFilterResponse {
  default_filter_config: Record<string, string[]>
  filter_config: Record<string, FilterOption>
}

export interface InsuranceProductFeeResponse {
  data: {
    product_fee_list: ProductFeeList[]
  }
}

export interface ProductFeeList {
  product_id: number
  fee: number
}
export interface PromotionInsuranceProductResponse {
  data: PromotionInsuranceProduct[]
}

export interface InsuranceListData {
  title: string
  description: string
  ideal_coverages: IdealCoverage[] | null
  products: InsuranceProduct[]
  default_premium_config: FilterValue | null
  premium_config: Record<string, FilterOption> | null
  announcement_btn: LinkButton | null
}

export type FilterValue = Record<string, string | number | (string | number)[]>

export interface FilterOption {
  name: string
  type: OptionValueType
  values: Option[]
}

export type OptionValueType = OptionType | RadioType | CheckboxType

export type OptionType = 'option'

export type RadioType = 'radio'

export type CheckboxType = 'checkbox'

export interface Option {
  key: string
  value: string
}

export interface InsuranceListMeta {
  pagination: PaginationResponse
  current_filter_config: Record<string, string | string[]>
}

export interface IdealCoverage {
  name: string
  amount: string
}

export interface BaseInsuranceProduct {
  id: number
  company: string
  name: string
  plan: string
  fee: number
  btn: LinkButton
  features: string[]
  badges: LinkButton[]
  ranking_badge: RankingBadge
  coverage_age: string | null
  view_count: number
}

export interface InsuranceProduct extends BaseInsuranceProduct {
  coverage_charts: InsuranceProductCoverageChart[]
  coverages: Coverage[]
  description: string
  promotion: string | null
  fee_prefix: string
}

export interface PromotionInsuranceProduct extends BaseInsuranceProduct {}

export interface InsuranceProductCoverageChart {
  name: string
  amount_percentage: number
}

export interface Coverage {
  name: string
  amount: string
  postfix: string
}

export interface ApiResponse<T> {
  status: string // API 狀態 (例如: "success")
  message: string // API 訊息
  data: T // 資料結構由泛型參數決定
}

// 基本分類項目
export interface CategoryItem {
  id: number
  name: string
}

// 保險搜尋選項資料結構
export interface InsuranceOptionsData {
  categoryList: CategoryItem[]
  caseList: CategoryItem[]
  typeList: CategoryItem[]
  tagList: CategoryItem[]
}

// 定義保險搜尋 API 的請求 payload 型別
export type InsuranceSearchPayload = {
  searchText: string // 搜尋文字，例如：保險公司名稱
  categoryId: string // 分類 ID，空字串表示不限分類
  caseId: string // 案例 ID，空字串表示不限案例
  typeId: string // 類型 ID，空字串表示不限類型
  tagId: string // 標籤 ID，空字串表示不限標籤
  page: number // 當前頁碼，從 1 開始
  perPage: number // 每頁顯示數量
}

// 保險搜尋選項回應型別
export type InsuranceOptionsResponse = ApiResponse<InsuranceOptionsData>

// 保險產品基本定義
export interface InsuranceSearchProduct {
  // 從原本的 InsuranceProduct 整理過來
  promote: number // 推廣狀態
  popular: number // 熱門狀態
  stop: boolean // 是否停售
  url: string // 產品網址
  companyName: string // 公司名稱
  productName: string // 產品名稱
  productCode: string // 產品代碼
  case: string // 保險類別 (例如: 終身, 一年期)
  categoryMain: string // 主分類 (例如: 醫療險, 意外險)
  categorySub: string // 子分類 (例如: 終身醫療, 意外實支)
  type: string // 類型 (例如: 主約, 專案)
  period: string // 繳費期間 (例如: 86年期, 1年期, 10年期/20年期)
  age: string // 投保年齡 (例如: 61~75歲)
  benefit: Benefit[] // 保障利益列表
  tag: Tag[] // 標籤列表
}

// 定義標籤介面
export interface Tag {
  name: string
}

// 定義利益項目介面
export interface Benefit {
  name: string
}

// 保險產品搜尋結果資料結構
export interface InsuranceSearchData {
  product: InsuranceSearchProduct[]
  totalCount: number
}

// 保險產品搜尋回應型別
export type InsuranceSearchResponse = ApiResponse<InsuranceSearchData>
