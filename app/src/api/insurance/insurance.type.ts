import {
  Link,
  RelatedBlog,
  RelatedQuestion,
  PageMeta,
  PaginationResponse,
  LinkButton,
} from '../type'

export interface InsurancePageStaticData {
  id: string
  name: string
  query_for_more_question?: string
  is_external?: boolean
  image: string
  description: string
  promotion_wording?: string
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
export interface InsuranceListResponse {
  data: InsuranceListData
  page_meta: PageMeta
  meta: InsuranceListMeta
  json_ld?: any[]
}

export interface FetchInsuranceListPayload {
  insurance: string
  page: number
}

export interface PromotionInsuranceProductResponse {
  data: PromotionInsuranceProduct[]
}

export interface InsuranceListData {
  title: string
  ideal_coverages?: IdealCoverage[]
  products: InsuranceProduct[]
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
  fee: string
  btn: LinkButton
  features: string[]
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
