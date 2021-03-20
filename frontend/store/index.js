import { MEDICINE, INVOICE, DISTRIBUTOR } from '~/utils/Constants'

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
  getNearExpData: (state) => {
    const medNotExpired = state.backendData.medicineData.filter(
      (val) => new Date(val?.exp_date).getTime() > Date.now()
    )
    return medNotExpired.sort(
      (a, b) => new Date(a.exp_date) - new Date(b.exp_date)
    )
  },
  getExpiredData: (state) => {
    const medExpired = state.backendData.medicineData.filter(
      (val) => new Date(val?.exp_date).getTime() <= Date.now()
    )
    return medExpired.sort(
      (a, b) => new Date(b.exp_date) - new Date(a.exp_date)
    )
  },
  getDistribChartData: (state) => {
    const returnVals = {}

    state.backendData.medicineData.forEach((medicine) => {
      if (returnVals[medicine.distrib_name]) {
        returnVals[medicine.distrib_name] += medicine.quantity * medicine.cost
      } else {
        returnVals[medicine.distrib_name] = medicine.quantity * medicine.cost
      }
    })
    return returnVals
  },
  getMedicineChartData: (state) => {
    const returnVals = {}

    state.backendData.medicineData.forEach((medicine) => {
      if (returnVals[medicine.medicine_name]) {
        returnVals[medicine.medicine_name] += medicine.quantity * medicine.cost
      } else {
        returnVals[medicine.medicine_name] = medicine.quantity * medicine.cost
      }
    })

    return returnVals
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
