import { MEDICINE, INVOICE, DISTRIBUTOR } from '~/store/utils/Constants'

const state = () => ({
  backendData: {
    medicineData: [],
    distributorData: [],
    invoiceData: [],
  },
  loading: true,
})

const getters = {
  getMedicineData: (state) => {
    return state.backendData.medicineData
  },
  getDistributorData: (state) => {
    return state.backendData.distributorData
  },
  getInvoiceData: (state) => {
    return state.backendData.invoiceData
  },
  getLoadingData: (state) => {
    return state.loading
  },
}

const mutations = {
  updateBackendData: (state, payload) => {
    switch (payload?.part) {
      case MEDICINE:
        state.backendData.medicineData = payload.data
        break
      case DISTRIBUTOR:
        state.backendData.distributorData = payload.data
        break
      case INVOICE:
        state.backendData.invoiceData = payload.data
        break
      default:
        break
    }
  },

  updateLoadingState: (state, payload) => {
    state.loading = payload
  },
}

const actions = {
  updateBackendData: (context, payload) => {
    context.commit('updateBackendData', payload)
  },

  updateLoadingState: (context, payload) => {
    context.commit('updateLoadingState', payload)
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
