<template>
  <div class="ProductReportForm">
    <div class="ProductReportForm__title">商品資訊回報</div>
    <div class="ProductReportForm__description">
      MY83
      致力於提供優質的保險資訊，幫助保戶找到適合的業務員與保險商品。不論你是訪客還是會員，我們都歡迎你的協助，讓平台能提供正確、最即時的保險資訊！
      MY83 業務員請先登入再回報，審核成功站方會給予紅利點數回饋。
    </div>
    <div class="ProductReportForm__disclaimer">站方有權保留調整方案之權利</div>
    <div class="ProductReportForm__form">
      <div class="ProductReportForm__field">
        <div class="ProductReportForm__field__label pt-0">回報商品</div>
        <div class="ProductReportForm__field__input">
          {{ productName }}
        </div>
      </div>
      <div
        v-for="(field, index) in fields"
        :key="index"
        class="ProductReportForm__field"
      >
        <div class="ProductReportForm__field__label">
          <!-- eslint-disable-next-line prettier/prettier -->
              {{ field.name }}<template v-if="field.required">*</template>
        </div>
        <div class="ProductReportForm__field__input">
          <BaseInputText
            v-if="field.type === 'TEXT'"
            :placeholder="field.placeholder"
            :value="formData[field.id]"
            :state="validationTextOf(field.id).state"
            @update="(value) => update(field.id, value)"
          />
          <BaseInputTextarea
            v-else-if="field.type === 'TEXTAREA'"
            :placeholder="field.placeholder"
            :value="formData[field.id]"
            :state="validationTextOf(field.id).state"
            height="100px"
            @update="(value) => update(field.id, value)"
          />
          <BaseInputMessage
            class="ProductReportForm__field__legend"
            :msg="validationTextOf(field.id).message || field.legend"
            :type="validationTextOf(field.id).message ? 'error' : 'legend'"
          />
        </div>
      </div>
      <BaseInputMessage
        v-if="isError"
        msg="發送失敗，請重新再試一次"
        text-align="right"
      />
      <div class="ProductReportForm__form__action">
        <BaseButton type="secondary" size="l-a" @click.native="$emit('close')">
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
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from '@nuxtjs/composition-api'
import { productReport } from '@/api/insurance/product'
import { useProductReport } from '@/services/product/ProductReportScheme'
import BaseInputText from '@/components/my83-ui-kit/input/BaseInputText.vue'
import BaseInputTextarea from '@/components/my83-ui-kit/input/BaseInputTextarea.vue'
import BaseInputMessage from '@/components/my83-ui-kit/input/BaseInputMessage.vue'
import BaseButton from '@/components/my83-ui-kit/button/BaseButton.vue'

export default defineComponent({
  components: {
    BaseInputText,
    BaseInputTextarea,
    BaseInputMessage,
    BaseButton,
  },
  props: {
    productId: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isError = ref(true)
    const isLoading = ref(false)

    const {
      scheme,
      isAllValidated,
      validateState,
      validateAll,
      update,
      reset,
    } = useProductReport()

    const formData = reactive(scheme.form.formData)

    const validationTextOf = (id: string) => {
      return {
        state: validateState.value[id]?.state ?? '',
        message: validateState.value[id]?.message ?? '',
      }
    }

    const resetForm = () => {
      reset()
      isError.value = true
    }

    scheme.form.setSubmit(async () => {
      isLoading.value = true

      const result = await validateAll()
      if (!result) return

      try {
        await productReport({
          id: props.productId,
          content: formData.content,
          refLink: formData.refLink,
          reporter: formData.reporter,
          reporterContact: formData.reporterContact,
        })

        emit('submit-status', {
          status: 'success',
        })
      } catch (error) {
        isError.value = false

        emit('submit-status', {
          status: 'error',
          error,
        })
      } finally {
        isLoading.value = false
      }
    })

    watch(
      () => props.visible,
      (val) => val && resetForm()
    )

    return {
      formData,
      fields: reactive(scheme.form.fields),
      validationTextOf,
      isAllValidated,
      update,
      submit: () => scheme.form.submit(),
      isError,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/sass/variables.scss';
@import '@/sass/rwd.scss';

.ProductReportForm {
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
