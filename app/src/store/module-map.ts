const moduleMap = {
  question: () => import('@/store/question/question'),
  questionList: () => import('@/store/question/list'),
  insurance: () => import('@/store/insurance/insurance'),
}

export default moduleMap
