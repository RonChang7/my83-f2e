export const isSlotExist = (name: string, ctx: Vue) => {
  return !!ctx.$slots[name] || !!ctx.$scopedSlots[name]
}
