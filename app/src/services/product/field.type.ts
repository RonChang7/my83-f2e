import { IntervalType } from '@/api/insurance/product.type'
import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

export const enum InputType {
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  OPTION = 'OPTION',
}

export enum JobLevel {
  LEVEL_1 = '職等1（內勤人員、教師、家管等）',
  LEVEL_2 = '職等2（外勤人員、業務、廚師或技師等）',
  LEVEL_3 = '職等3（司機、一般軍警等）',
  LEVEL_4 = '職等4（模板工、水電工等）',
  LEVEL_5 = '職等5（刑警、焊接工、高樓外部清潔工等）',
  LEVEL_6 = '職等6（消防隊隊員、機上服務員等）',
}

export type Validator = (value: number) => boolean

export type Scheme<T> = T extends IntervalType ? IntervalScheme : OptionScheme

export type FieldListObject = {
  id: string
  name: string
  unit?: string
  validateMsg?: string
}

export type FieldOption<T> = Scheme<T> & FieldListObject

export interface OptionScheme {
  type: InputType.OPTION | InputType.RADIO
  options?: SelectOption[]
}

export interface IntervalScheme {
  type: InputType.NUMBER
  min?: number
  max?: number
}
