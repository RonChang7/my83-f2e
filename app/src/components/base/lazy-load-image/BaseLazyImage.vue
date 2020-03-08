<template>
  <div
    :class="{
      'placeholder-img': ignorePlaceholder ? false : hasPlaceholderImage,
    }"
    :style="{ 'padding-top': ignorePlaceholder ? '1px' : imageRatio }"
    class="BaseLazyImage"
  >
    <img
      v-if="currentSrc"
      :class="{
        img__center: shouldAlignImageToCenter,
        img__ignorePlaceholder: ignorePlaceholder,
      }"
      :src="currentSrc"
      :style="currentStyle"
      :alt="currentSrc ? imageAlt : ''"
      class="img"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { LazyLoadManager } from './lazy-load-manager'
import {
  isSupportObjectFit,
  getImageStyle,
  ObjectFitTypeType,
} from './image-object-fit'

export default {
  props: {
    imageUrl: {
      type: String,
      default: '',
    },
    imageRatio: {
      type: String,
      default: '100%',
    },
    imageLoadedStyle: {
      type: Object,
      default: () => {},
    },
    hasPlaceholderImage: {
      type: Boolean,
      default: false,
    },
    imageAlt: {
      type: String,
      default: null,
    },
    fit: {
      type: String,
      default: '',
    },
    ignorePlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      imageWidth: null,
      imageHeight: null,
    }
  },
  computed: {
    imageStyle() {
      if (!process.server && !this.ignorePlaceholder && this.fit) {
        const _isSupportObjectFit = isSupportObjectFit()

        if (_isSupportObjectFit) {
          return { 'object-fit': this.fit }
        }

        return getImageStyle(
          this.fit,
          this.imageHeight,
          this.imageWidth,
          this.$el.clientHeight,
          this.$el.clientWidth
        )
      }
      return {}
    },
    shouldAlignImageToCenter() {
      return (
        !process.server &&
        !this.ignorePlaceholder &&
        !isSupportObjectFit() &&
        this.fit !== ObjectFitTypeType.FILL
      )
    },
    currentSrc() {
      return this.visible ? this.imageUrl : null
    },
    currentStyle() {
      return this.visible
        ? { ...this.imageLoadedStyle, ...this.imageStyle }
        : {}
    },
  },
  watch: {
    imageUrl() {
      if (!this.lazyLoadManager) return

      this.visible = false

      this.lazyLoadManager.unregist(this.$el)
      this.$nextTick(() => {
        this.lazyLoadManager.regist(this.$el, this.handleObserveVisibleViewport)
      })
    },
  },
  beforeCreate() {
    if (process.server) return

    this.lazyLoadManager = LazyLoadManager.getInstance()
  },
  mounted() {
    this.lazyLoadManager &&
      this.lazyLoadManager.regist(this.$el, this.handleObserveVisibleViewport)
  },
  beforeDestroy() {
    this.lazyLoadManager && this.lazyLoadManager.unregist(this.$el)
  },
  methods: {
    loadImage() {
      const img = new Image()

      Object.keys(this.$attrs).forEach((key) => {
        const value = this.$attrs[key]
        img.setAttribute(key, value)
      })

      img.onload = () => this.handleLoad(img)
      img.src = this.imageUrl
    },
    handleLoad(img) {
      this.imageWidth = img.width
      this.imageHeight = img.height
      this.visible = true
    },
    handleObserveVisibleViewport(entry) {
      if (!entry) return
      if (this.visible === true) return

      if (entry.isIntersecting === true) {
        this.loadImage()
        this.lazyLoadManager.unregist(entry.target as HTMLElement)
      }
    },
  },
} as ComponentOption

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export type ComponentInstance = CombinedVueInstance<
  Instance,
  Data,
  Methods,
  Computed,
  Props
>

export interface Instance extends Vue {
  lazyLoadManager: LazyLoadManager
  $el: HTMLElement
}

export interface Data {
  visible: boolean
  imageWidth: number | null
  imageHeight: number | null
}

export interface Methods {
  loadImage(): void
  handleLoad(img: HTMLImageElement): void
  handleObserveVisibleViewport(entry: IntersectionObserverEntry): void
}

export interface Computed {
  imageStyle: CSSStyleDeclaration
  shouldAlignImageToCenter: boolean
  currentSrc: string | null
  currentStyle: CSSStyleDeclaration | null
}

export interface Props {
  imageUrl: string
  imageRatio: string
  imageLoadedStyle: CSSStyleDeclaration
  hasPlaceholderImage: boolean
  imageAlt: string | null
  fit: ObjectFitTypeType
  ignorePlaceholder: boolean
}
</script>

<style lang="scss" scoped>
.BaseLazyImage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // placeholder image
  &.placeholder-img {
    // @todo: Change to MY83 lazy-load
    background-image: url(https://images.mamilove.com.tw/mall/icBannerForloadingstatus@2x.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 45px;
  }
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__ignorePlaceholder {
    position: static;
  }
}
</style>
