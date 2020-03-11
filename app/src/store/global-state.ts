import { State as GlobalState } from './global/index'
import { State as HeaderState } from './header/index'

export interface GlobalVuexState {
  global: GlobalState
  header: HeaderState
}
