import { Link, Gender } from '../type'

export interface ProductReportRequest {
  id: number
  content: string
  refLink: string
  reporter: string
  reporterContact: string
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

// 單一產品詳情 API 回應型別
export interface SingleProductResponse {
  url: string
  basic: ProductBasic
  setting: ProductSetting
  premium: PremiumItem[]
  benefit: BenefitItem[]
}

// 產品基本資訊
export interface ProductBasic {
  companyName: string
  productName: string
  productCode: string
  categoryMain: string
  categorySub: string
  saleDate: string
  stop: boolean
  productDM: string
  productTable: string
  productTerm: string
  productRule: string
  productTag: Tag[]
}

// 標籤
export interface Tag {
  content: string
}

// 產品設定
export interface ProductSetting {
  unit: string
  unitstep: number
  defaultAmount: number
  defaultAge: number
  setSex: Tag[]
  defaultSex: string
  setJob: Tag[]
  defaultJob: string
  casePeriod: string
  setPeriod: PeriodSetting[]
  defaultPeriod: string
  setBody: any[] // 可能是空陣列或有其他可能的結構
  defaultBody: string
  productType: string
  insuranceType: string
}

// 期間設定
export interface PeriodSetting {
  content: string
  paymentPeriod: string
  insurancePeriod: string
  ageMin: number
  ageMax: number
  amountMin: string
  amountMax: string
}

// 保費項目
export interface PremiumItem {
  Sex: string
  Age: number
  Period: string
  Job: number
  Value: string
}

// 保障項目
export interface BenefitItem {
  benefitName: string
  benefitMain: BenefitDetail[]
  benefitExtra: any[] // 可能是空陣列或有其他可能的結構
}

// 保障詳情
export interface BenefitDetail {
  name: string
  remark: string
  note: string
  content: BenefitContent[]
  table: BenefitTable[]
}

// 保障內容
export interface BenefitContent {
  title: string
  highlight: string
  remark: string
}

// 保障表格
export interface BenefitTable {
  [key: string]: string // 動態屬性，例如 "1": "骨折部分", "2": "完全骨折日數"
}
