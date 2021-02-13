<template>
  <div>
    <h1>Invoices</h1>
    <ul>
      <!--      TODO: Create a table here to edit filter and all that stuff-->
      <li v-for="(item, indx) in getInvoiceData" :key="'Invoice-Item-' + indx">
        {{ item.invoice_name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { INVOICE } from '~/store/utils/Constants'

export default {
  name: 'Invoice',

  head() {
    return {
      title: 'Invoice',
    }
  },
  computed: {
    ...mapGetters({
      getInvoiceData: 'getInvoiceData',
    }),
  },
  methods: {
    ...mapActions({
      updateBackendData: 'updateBackendData',
      updateLoadingState: 'updateLoadingState',
    }),

    async getDataFromServer() {
      const result = await this.$axios.get('/api/invoice')
      if (result.status === 200) {
        this.updateLoadingState(false)
        this.$message.success(result.data.msg)
        this.updateBackendData({
          part: INVOICE,
          data: result.data.invoices,
        })
      } else {
        this.$message.error('Could not fetch data')
      }
    },
  },
  mounted() {
    this.getDataFromServer()
  },
}
</script>

<style scoped></style>
