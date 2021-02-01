import { Option as SelectOption } from '@/components/my83-ui-kit/input/type'

export const enum InputType {
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  OPTION = 'OPTION',
}

export const enum FieldType {
  INTERVAL = 'interval',
  OPTION = 'option',
  TEXT = 'text',
}

interface FieldBaseScheme {
  id: string
  name: string
  prefix?: string
  postfix?: string
  placeholder?: string
  disabled?: boolean
}

interface FieldOptionScheme {
  type: InputType.OPTION | InputType.RADIO
  options: SelectOption[]
}

interface FieldIntervalScheme {
  type: InputType.NUMBER
  min?: number
  max?: number
  range?: string
}

interface FieldTextScheme {
  type: InputType.TEXT
}

type FieldScheme<T> = T extends FieldType.INTERVAL
  ? FieldIntervalScheme
  : T extends FieldType.OPTION
  ? FieldOptionScheme
  : FieldTextScheme

export type Field<T> = FieldScheme<T> & FieldBaseScheme
