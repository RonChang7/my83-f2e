import { Link } from '../type'

export interface InsurancePageStaticData {
  id: string
  name: string
  image: string
  description: string
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
  recommend_blogs: Link[]
}

export interface Principle {
  rules: Rule[]
  recommend_blogs: Link[]
}

export interface Faq {
  question: string
  answer: string
  recommend_blogs?: Link[]
}

export interface Term {
  term: string
  definition: string
}

export interface Rule {
  title: string
  content: string
}
