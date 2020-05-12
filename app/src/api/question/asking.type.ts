export interface AskingFormOptionResponse {
  tag_list: Record<string, string>
  purpose_tag_ids: TagId[]
  purpose_mapping_target_tag_ids: Record<string, TagId[]>
  mapping_insurance_tag_ids: Record<
    keyof AskingFormOptionResponse['purpose_mapping_target_tag_ids'],
    Record<string, InsuranceTagOption[]> | InsuranceTagOption[]
  >
}

export interface CreateQuestionResponse {
  user_meta: UserMeta
}

export interface EditQuestionResponse {
  user_meta: UserMeta
  data: EditQuestionContent
}

export interface InsuranceTagOption {
  tag_type_name: string
  is_open: boolean
  tag_ids: TagId[]
}

export type TagId = number

export interface UserMeta {
  is_suspect?: boolean
  is_duplicated_post?: boolean
}

export interface EditQuestionContent {
  question_id: number
  title: string
  content: string
  images: string[]
  purpose_tag_id: number
  target_tag_id: number
  insurance_type_tag_ids: number[]
}

export interface SubmitQuestionPayload {
  title: string
  content: string
  purpose_tag_id: number
  target_tag_id: number
  insurance_type_tag_ids: number[]
  nickname: string
  images?: string[]
  remove_images?: string[]
  google_recaptcha: string
}
