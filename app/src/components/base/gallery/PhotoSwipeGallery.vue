<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter"></div>
          <button
            class="pswp__button pswp__button--close"
            title="Close (Esc)"
          ></button>
          <button
            class="pswp__button pswp__button--fs"
            title="Toggle fullscreen"
          ></button>
          <button
            class="pswp__button pswp__button--zoom"
            title="Zoom in/out"
          ></button>
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
        >
          <div class="pswp__share-tooltip"></div>
        </div>
        <button
          class="pswp__button pswp__button--arrow--left"
          title="Previous (arrow left)"
        ></button>
        <button
          class="pswp__button pswp__button--arrow--right"
          title="Next (arrow right)"
        ></button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import PhotoSwipe, { Item, Options } from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

export default {
  props: {
    images: {
      type: Array,
      default: () => [
        {
          src: 'https://picsum.photos/1920/1080',
          msrc: '',
          w: 0,
          h: 0,
        },
      ],
    },
    options: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: null,
    },
    thumbnailClassName: {
      type: String,
      default: '',
    },
  },
  watch: {
    index(val) {
      if (val !== null) {
        this.photoSwipeInit()
      }
    },
  },
  methods: {
    photoSwipeInit() {
      const vm = this
      const pswpElement = this.$el
      const items = _.cloneDeep(this.images)
      const thumbnails = document.querySelectorAll(
        `.${this.thumbnailClassName}`
      )

      const getThumbBoundsFn = (index) => {
        const thumbnail = thumbnails[index] // find thumbnail
        const pageYScroll =
          window.pageYOffset || document.documentElement.scrollTop
        const rect = thumbnail.getBoundingClientRect()
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
      }

      // default PhotoSwipe options
      const options: Options = {
        history: false,
        index: this.index,
        showHideOpacity: true,
        bgOpacity: 0.6,
        closeOnScroll: false,
        // See Options -> getThumbBoundsFn section of documentation for more info
        getThumbBoundsFn: this.thumbnailClassName.length
          ? getThumbBoundsFn
          : undefined,
      }

      const gallery: PhotoSwipe<Options> = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        Object.assign(options, this.options)
      )

      gallery.listen('gettingData', function(index, item) {
        if (_.isNil(item.w) || _.isNil(item.h) || item.w < 1 || item.h < 1) {
          // unknown size
          const img = new Image()
          img.onload = function() {
            // will get size after load
            item.w = (this as HTMLImageElement).width // set image width
            item.h = (this as HTMLImageElement).height // set image height
            gallery.invalidateCurrItems() // reinit Items
            gallery.updateSize(true) // reinit Items
          }
          img.src = item.src! // let's download image
        }
      })

      gallery.listen('close', function() {
        // 清空 index 數值
        vm.$emit('update:index', null)
      })

      gallery.init()
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
  $el: HTMLElement
}

export interface Data {}

export interface Methods {
  photoSwipeInit(): void
}

export interface Computed {}

export interface Props {
  images: Item[]
  options: Options
  index: number
  thumbnailClassName: string
}
</script>

<style lang="scss" scoped>
.pswp__top-bar {
  background: none;
  margin-top: 10px;
  padding-right: 20px;
}

.pswp__counter {
  width: 120px;
  text-align: center;
  left: calc(50% - 60px);
  font-size: 18px;
}

.pswp__caption__center {
  text-align: center;
}

.pswp__button--arrow--right:before,
.pswp__button--arrow--left:before {
  width: 76px;
  height: 116px;
  top: 20px;
}

.pswp__button--arrow--right:before {
  background: url('~assets/images/icon/arrow-next.svg');
}

.pswp__button--arrow--left:before {
  background: url('~assets/images/icon/arrow-previous.svg');
}
</style>
