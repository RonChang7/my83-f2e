import { State as GlobalState } from './global/index'
import { State as HeaderState } from './header/index'
import { State as PageMetaState } from './seo/page-meta'
import { State as JsonLdState } from './seo/json-ld'
import { State as MetaState } from './meta/index'

export interface GlobalVuexState {
  global: GlobalState
  header: HeaderState
  pageMeta: PageMetaState
  jsonLd: JsonLdState
  meta: MetaState
}
