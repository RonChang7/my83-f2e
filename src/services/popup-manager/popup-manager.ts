import { addClass, removeClass, setStyle } from '@/utils/dom'
import { ComponentInstance as PopupMixinInstance } from '@/mixins/base/popup-mixin'

export class PopupManager {
  static idSeed = 0

  static zIndex: number = 3000

  static stacks: PopupStackItem[] = []

  static instances: Record<string, PopupMixinInstance> = {}

  static $shadow: HTMLElement | null = null

  static isShadowCreated = false

  static register(instance: PopupMixinInstance): string | void {
    if (!instance) return

    const key = `popup-${this.idSeed++}`
    this.instances[key] = instance

    return key
  }

  static unregister(key: string): string | void {
    if (!key) return
    if (!Object.prototype.hasOwnProperty.call(this.instances, key)) return

    delete this.instances[key]

    return key
  }

  static open(key: string) {
    if (process.server) return
    if (!key) return

    for (let i = 0; i < this.stacks.length; i++) {
      const modal = this.stacks[i]
      if (modal.key === key) {
        return
      }
    }

    const instance = this.instances[key]
    if (!instance) return

    const $el: HTMLElement = instance.$el as HTMLElement
    const $shadow = this.getShadowDom()

    if (!this.isShadowCreated) {
      addClass($shadow!, 'PopupShadow-enter')
      setTimeout(() => {
        removeClass($shadow!, 'PopupShadow-enter')
      }, 200)
    }

    document.body.appendChild($shadow!)

    $shadow!.tabIndex = 0
    setStyle($shadow!, {
      display: '',
      zIndex: (this.zIndex++).toString(),

      ...instance.shadowStyle,
    })

    setStyle($el, {
      zIndex: (this.zIndex++).toString(),
    })

    this.stacks.push({
      key,
      zIndex: parseInt($shadow!.style.zIndex),
    })
  }

  static close(key: string) {
    if (process.server) return
    if (!key) return

    const $shadow = this.getShadowDom()

    const top = this.stacks[this.stacks.length - 1]

    if (this.stacks.length > 0) {
      if (top.key === key) {
        this.stacks.pop()

        if (this.stacks.length > 0) {
          const stack = this.stacks[this.stacks.length - 1]
          const instance = this.instances[stack.key]

          setStyle($shadow!, {
            zIndex: stack.zIndex.toString(),
            ...instance.shadowStyle,
          })
        }
      } else {
        for (let i = this.stacks.length - 1; i >= 0; i--) {
          if (this.stacks[i].key !== key) continue
          this.stacks.splice(i, 1)
          break
        }
      }
    }

    if (this.stacks.length === 0) {
      addClass($shadow!, 'PopupShadow-leave')

      setTimeout(() => {
        if (this.stacks.length === 0) {
          if ($shadow!.parentNode) $shadow!.parentNode.removeChild($shadow!)
          setStyle($shadow!, { display: 'none' })
          this.$shadow = null
        }
        removeClass($shadow!, 'PopupShadow-leave')
      }, 200)
    }
  }

  static getShadowDom() {
    if (process.server) return
    let $el = this.$shadow

    if (!$el) {
      this.isShadowCreated = false

      $el = document.createElement('div')
      addClass($el, 'PopupShadow')

      $el.addEventListener('touchmove', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })

      this.$shadow = $el
    } else {
      this.isShadowCreated = true
    }

    return $el
  }
}

interface PopupStackItem {
  key: string
  zIndex: number
}
