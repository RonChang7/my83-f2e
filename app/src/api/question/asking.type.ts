export interface AskingFormOptionResponse {
  tag_list: Record<string, string>
  purpose_tag_ids: TagId[]
  purpose_mapping_target_tag_ids: Record<string, TagId[]>
  mapping_insurance_tag_ids: Record<
    keyof AskingFormOptionResponse['purpose_mapping_target_tag_ids'],
    Record<string, InsuranceTagOption[]> | InsuranceTagOption[]
  >
}

export interface InsuranceTagOption {
  tag_type_name: string
  is_open: boolean
  tag_ids: TagId[]
}

export type TagId = number
