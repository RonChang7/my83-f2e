import { Link, LinkButton, Gender, PageResponse } from '../type'

export type ProductResponse = PageResponse<Product>

export interface FetchProductFeePayload extends PremiumQuery {
  productId: string
  amountUnit?: number
}

export interface ProductReportRequest {
  id: number
  content: string
  refLink: string
  reporter: string
  reporterContact: string
}

export interface ProductFeeResponse {
  data: {
    fee: number
    coverages: Coverage[]
  }
}

export interface Product {
  product: ProductData
  files: LinkButton[]
  consult_link: Link
  premium_config: PremiumConfig
  default_premium_config: DefaultPremiumConfig
  coverages: Coverage[]
  claims: string[]
  rules: Rule[]
  hot_products: HotProductList
  online_product: LinkButton | null
}

type ContractType = '主約' | '附約'

type WholeLifeType = '終身險' | '定期險'

export interface ProductData {
  id: number
  name: string
  description: string
  company: string
  badges: LinkButton[]
  ranking_badge: RankingBadge
  features: string[]
  contract_type: ContractType
  whole_life_type: WholeLifeType
  insurance_type: string
  view_count: number
}

export interface Coverage {
  name: string
  content: string
  amount: number
  ideal_amount: number
  levels: Level[]
}

export interface Level {
  name: string
  amount: number
}

export interface DefaultPremiumConfig {
  age: number
  gender: Gender
  plan_id: number
  job_level?: number
  amount?: number
  fee: number
}

export interface PremiumConfig {
  is_fixed_rate: boolean
  amount_unit?: number
  plans: Plan[]
}

export interface Plan {
  plan_id: number
  name: string
  age: Option<IntervalType>
  amount?: Option<IntervalType>
  job_level?: Option<OptionType>
  payment_years_wording?: string
}

export interface Option<T> {
  type: T
  values: OptionValue<T>
}

export type OptionValueType = IntervalType | OptionType

export type IntervalType = 'interval'

export type OptionType = 'option'

export type OptionValue<T> = T extends IntervalType
  ? [number, number]
  : (number | string)[]

export interface Rule {
  title: string
  content?: string[]
}

export interface HotProductList {
  title: string
  data: HotProduct[]
}

export interface HotProduct {
  title: string
  link: Link
}

export interface PremiumQuery {
  age: number
  gender: Gender
  plan_id: number
  job_level?: number
  amount?: number
}

export interface RankingBadge {
  text: string
  description: string
}
