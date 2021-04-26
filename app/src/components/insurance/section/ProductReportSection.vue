<template>
  <div class="ProductReportSection">
    <BaseInfoModal :visible="visible" :lock-scroll="true" @close="closePanel">
      <div ref="modalEl" class="ProductReportSection__modal">
        <div class="ProductReportSection__title">商品資訊回報</div>
        <div class="ProductReportSection__description">
          MY83
          致力於提供優質的保險資訊，幫助保戶找到適合的業務員與保險商品。不論你是訪客還是會員，我們都歡迎你的協助，讓平台能提供正確、最即時的保險資訊！
          MY83 業務員請先登入再回報，審核成功站方會給予紅利點數回饋。
        </div>
        <div class="ProductReportSection__disclaimer">
          站方有權保留調整方案之權利
        </div>
        <div class="ProductReportSection__form">
          <div class="ProductReportSection__field">
            <div class="ProductReportSection__field__label pt-0">回報商品</div>
            <div class="ProductReportSection__field__input">
              {{ productName }}
            </div>
          </div>
          <div
            v-for="(field, index) in fields"
            :key="index"
            class="ProductReportSection__field"
          >
            <div class="ProductReportSection__field__label">
              <!-- eslint-disable-next-line prettier/prettier -->
              {{ field.name }}<template v-if="field.required">*</template>
            </div>
            <div class="ProductReportSection__field__input">
              <BaseInputText
                v-if="field.type === 'TEXT'"
                :placeholder="field.placeholder"
                :value="formData[field.id]"
                :state="
                  validateState[field.id] ? validateState[field.id].state : ''
                "
                @update="(value) => update(field.id, value)"
              />
              <BaseInputTextarea
                v-if="field.type === 'TEXTAREA'"
                :placeholder="field.placeholder"
                :value="formData[field.id]"
                :state="
                  validateState[field.id] ? validateState[field.id].state : ''
                "
                height="100px"
                @update="(value) => update(field.id, value)"
              />
              <BaseInputMessage
                class="ProductReportSection__field__legend"
                :msg="
                  (validateState[field.id] &&
                    validateState[field.id].message) ||
                  field.legend
                "
                :type="
                  validateState[field.id] && validateState[field.id].message
                    ? 'error'
                    : 'legend'
                "
              />
            </div>
          </div>
          <BaseInputMessage
            v-if="!submitStatus"
            msg="發送失敗，請重新再試一次"
            text-align="right"
          />
          <div class="ProductReportSection__form__action">
            <BaseButton type="secondary" size="l-a" @click.native="closePanel">
              取消
            </BaseButton>
            <BaseButton
              type="primary"
              size="l-a"
              :disabled="!(isAllValidated && formData.content)"
              :state="isLoading ? 'loading' : ''"
              @click.native="submit"
            >
              送出
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseInfoModal>
    <BaseButton
      type="secondary"
      size="m"
      :is-full-width="true"
      @click.native="openPanel"
    >
      商品資訊回報
    </BaseButton>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import { InsuranceProductVuexState } from '@/views/insurance/product/Index.vue'
import { useProductReport } from '@/services/product/ProductReportScheme'
import BaseInfoModal from '@/components/my83-ui-kit/modal/BaseInfoModal.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputTextarea from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import { productReport } from '@/api/insurance/product'
import { scrollToPosition } from '@/utils/scroll'

export default defineComponent({
  components: {
    BaseInfoModal,
    BaseButton,
    BaseInputText,
    BaseInputTextarea,
    BaseInputMessage,
  },
  setup() {
    const { $sentry, $notification } = useContext()
    const store = useStore<InsuranceProductVuexState>()
    const visible = ref(false)
    const submitStatus = ref(true)
    const isLoading = ref(false)
    const modalEl = ref<HTMLElement | null>(null)
    const productName = store.state.insuranceProduct.product!.product.name

    const {
      scheme,
      isAllValidated,
      validateState,
      validateAll,
      update,
      reset,
    } = useProductReport()

    const formData = reactive(scheme.form.formData)
    const openPanel = () => {
      visible.value = true
      scrollToPosition({
        to: 0,
        container: modalEl.value as HTMLElement,
        vertical: true,
      })
    }
    const closePanel = () => {
      visible.value = false
      reset()
    }

    scheme.form.setSubmit(async () => {
      isLoading.value = true

      const result = await validateAll()
      if (!result) return

      try {
        await productReport({
          id: store.state.insuranceProduct.product!.product.id,
          content: formData.content,
          refLink: formData.refLink,
          reporter: formData.reporter,
          reporterContact: formData.reporterContact,
        })

        $notification.success('回報成功，感謝你的協助！')
        closePanel()
      } catch (err) {
        submitStatus.value = false
        $sentry.captureException(err)
      }

      isLoading.value = false
    })

    return {
      visible,
      openPanel,
      closePanel,
      productName,
      formData,
      fields: reactive(scheme.form.fields),
      validateState,
      isAllValidated,
      update,
      submit: () => scheme.form.submit(),
      submitStatus,
      isLoading,
      modalEl,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductReportSection {
  @include max-media('xl') {
    padding: 20px 20px 0;
  }

  &__modal {
    display: flex;
    flex-direction: column;
    width: 570px;
    padding: 0 25px 15px;

    @include max-media('xl') {
      position: relative;
      width: 100%;
      padding: 0 15px 15px;
      height: 100%;
      overflow: scroll;
    }
  }

  &__title {
    color: $gray-primary;
    font-size: 1.375rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20px;
  }

  &__description {
    color: $gray-secondary;
    font-size: 0.875rem;
    margin-bottom: 8px;
  }

  &__disclaimer {
    color: $gray-tertiary;
    font-size: 0.75rem;
    text-align: right;
    @include max-media('xl') {
      margin-bottom: -6px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;

    &__action {
      margin-top: 30px;
      text-align: right;

      > button {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }

  &__field {
    display: flex;
    font-size: 0.875rem;
    margin-top: 16px;

    @include max-media('xl') {
      flex-direction: column;
    }

    &__label {
      width: 75px;
      padding-top: 10px;

      @include max-media('xl') {
        padding-bottom: 4px;
      }
    }

    &__input {
      width: 100%;
    }

    ::v-deep &__legend {
      padding-top: 4px;
      font-size: 0.75rem;
    }
  }
}
</style>
