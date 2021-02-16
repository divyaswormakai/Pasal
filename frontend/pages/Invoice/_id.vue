<template>
  <div v-if="modalData.invoice_name">
    <a-row type="flex" justify="center">
      <h1>{{ modalData.invoice_name }}</h1>
    </a-row>
    <a-row type="flex" align="middle">
      <a-col :span="12">
        <a-row type="flex" justify="start">
          <b>{{ modalData.distributor.distrib_name }}</b
          ><br />{{ modalData.distributor.contact }}<br />{{
            modalData.distributor.address
          }}
        </a-row>
      </a-col>
      <a-col :span="12" pull="right">
        <a-row type="flex" justify="end">
          Date: {{ modalData.date_of_invoice }}
        </a-row>
      </a-col>
    </a-row>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Name</th>
          <th>Batch</th>
          <th>Mfd. Date</th>
          <th>Exp. Date</th>
          <th>Quantity</th>
          <th>Bonus</th>
          <th>MRP</th>
          <th>Cost per piece</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in modalData.medicines"
          :key="'Invoice-Medicine-' + idx"
        >
          <td>{{ idx + 1 }}</td>
          <td>{{ item.medicine_name }}</td>
          <td>{{ item.batch_code }}</td>
          <td>{{ item.mfd_date }}</td>
          <td>{{ item.exp_date }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.bonus }}</td>
          <td>{{ item.mrp }}</td>
          <td>{{ item.cost }}</td>
          <td>{{ item.cost * item.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { INVOICE_URL } from '@/utils/Constants'
import { mapActions } from 'vuex'

export default {
  name: 'IndividualInvoiceModal',
  data() {
    return {
      modalData: {},
    }
  },
  methods: {
    ...mapActions({
      updateLoadingState: 'updateLoadingState',
    }),
  },
  async created() {
    this.updateLoadingState(true)
    console.log(this.$route)
    const result = await this.$axios.get(
      `${INVOICE_URL}/${this.$route.params.id}`
    )
    if (result.status === 200) {
      this.$message.success(result.data.msg)
      this.modalData = { ...result.data.invoice }
      console.log(this.modalData)
    } else {
      this.$message.error('Could not fetch data')
    }
    this.updateLoadingState(false)
  },
}
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
}

table {
  width: 100vw;
}
</style>
