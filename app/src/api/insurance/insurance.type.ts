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

export interface FetchInsuranceListPayload {
  insurance: string
  page: number
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
  ideal_coverages: IdealCoverage[] | null
  products: InsuranceProduct[]
  default_premium_config: PremiumConfig | null
  premium_config: Record<string, PremiumConfigOption> | null
  announcement_btn: LinkButton | null
}

export type PremiumConfig = Record<string, string | number>

export interface PremiumConfigOption {
  type: OptionValueType
  values: Option[]
}

export type OptionValueType = OptionType | RadioType

export type OptionType = 'option'

export type RadioType = 'radio'

export interface Option {
  key: string
  value: string
}

export interface InsuranceListMeta {
  pagination: PaginationResponse
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
