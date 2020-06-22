import { VNode } from 'vue/types/vnode'
import { CreateElement } from 'vue/types/vue'

export const isSlotExist = (name: string, ctx: Vue) => {
  return !!ctx.$slots[name] || !!ctx.$scopedSlots[name]
}

/**
 * Renderless component
 * 使用上需注意，Renderless component 底下必須只有一個 root DOM
 * Ref: https://adamwathan.me/renderless-components-in-vuejs/
 *
 * 為了以上限制，透過 wrapper 包起來，避免之後有不知情的使用情境導致錯誤
 */
export const renderlessComponentWrapper = (
  nodes: VNode[] | undefined,
  h: CreateElement
) => {
  if (nodes && nodes.length > 1) {
    return h('div', {}, nodes)
  }

  return nodes
}
