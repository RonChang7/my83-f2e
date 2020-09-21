import Vue from 'vue'
import { Store } from 'vuex'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { CombinedVueInstance } from 'vue/types/vue'
import { MetaInfo } from 'vue-meta'
import { GlobalVuexState } from '@/store/global-state'
import CanonicalService from '@/seo/canonical-service'
import { getJsonLdScript } from '@/seo/helper'
import { getOrganizationJsonLd } from '@/seo/common-meta'

export default {
  computed: {
    seoData() {
      const hostname = this.$env.HOST_URL
      const jsonLds = this.$store.state.jsonLd.content
      const fbAppId = this.$env.FACEBOOK_APP_ID
      const fbAdminId = this.$env.FACEBOOK_ADMIN_ID || ''

      return {
        title: this.$store.getters['pageMeta/title'],
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.$store.getters['pageMeta/description'],
          },
          {
            hid: 'keywords',
            name: 'keywords',
            content: this.$store.getters['pageMeta/keywords'],
          },
          {
            hid: 'fb:app_id',
            property: 'fb:app_id',
            content: fbAppId,
          },
          {
            hid: 'fb:admins',
            property: 'fb:admins',
            content: fbAdminId,
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: this.$store.getters['pageMeta/title'],
          },
          {
            hid: 'og:url',
            property: 'og:url',
            content: `${hostname}${this.$route.path}`,
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: this.$store.getters['pageMeta/description'],
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.$store.getters['pageMeta/imageUrl'],
          },
          {
            hid: 'og:image:type',
            property: 'og:image:type',
            content: this.$store.getters['pageMeta/imageType'],
          },
          {
            hid: 'og:image:alt',
            property: 'og:image:alt',
            content: this.$store.getters['pageMeta/imageAlt'],
          },
          {
            hid: 'og:image:width',
            property: 'og:image:width',
            content: this.$store.getters['pageMeta/imageWidth'],
          },
          {
            hid: 'og:image:height',
            property: 'og:image:height',
            content: this.$store.getters['pageMeta/imageHeight'],
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: CanonicalService.getCanonical(hostname, this.$route),
          },
        ],
        __dangerouslyDisableSanitizers: ['script'],
        script: [...getJsonLdScript(jsonLds), getOrganizationJsonLd()],
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
  $store: Store<GlobalVuexState>
}

export interface Data {}

export type Methods = {}

export interface Computed {
  seoData: MetaInfo
}

export interface Props {}
