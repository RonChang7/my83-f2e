const moduleMap = {
  question: () => import('@/store/question/question'),
  questionList: () => import('@/store/question/list'),
  insurance: () => import('@/store/insurance/insurance'),
  insuranceProduct: () => import('@/store/insurance/product'),
}

export default moduleMap
