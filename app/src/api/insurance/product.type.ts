import { Link, LinkButton, Gender, PageMeta } from '../type'

export interface ProductResponse {
  data: Product
  page_meta: PageMeta
  json_ld?: any[]
}

export interface Product {
  name: string
  description: string
  company: string
  features: string[]
  contract_type: ContractType
  whole_life_type: WholeLifeType
  insurance_type: string
  files: LinkButton[]
  consult_path: Link
  premium_config: PremiumConfig
  default_premium_config: DefaultPremiumConfig
  coverages: Coverage[]
  claims: string[]
  rules: Rule[]
  hot_products: HotProductList
}

type ContractType = '主約' | '附約'

type WholeLifeType = '終身險' | '定期險' | '一年期險'

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
  plans: Plan[]
}

export interface Plan {
  id: number
  name: string
  age: Option<IntervalType>
  amount?: Option<IntervalType>
  job_level?: Option<OptionType>
  payment_years_wording?: string
}

export interface Option<T> {
  type: T
  value: OptionValue<T>
}

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
  focus_count: number
  link: Link
}

export interface PremiumQuery {
  productId: string
  age: number
  gender: Gender
  planId: number
  jobLevel?: number
  amount?: number
}
