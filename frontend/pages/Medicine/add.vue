<template>
  <div>
    <h3>Add a New Bill</h3>
    <a-row type="flex" justify="start">
      <label> Invoice Name</label>
      <a-input
        v-model="invoiceName"
        placeholder="InvoiceId"
        name="invoice_name"
        style="text-transform: uppercase"
      />
    </a-row>

    <a-col type="flex" justify="start">
      <label>Distributor Name</label>
      <br />
      <a-select v-model="distributorDetails">
        <a-select-option
          v-for="distrib in getDistributorData"
          :key="distrib.distrib_id"
        >
          {{ distrib.distrib_name }}
        </a-select-option>
      </a-select>
    </a-col>

    <label>Date of Invoice</label>
    <a-date-picker v-model="dateOfInvoice" placeholder="Select month" />
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Name</th>
          <th>Batch</th>
          <th>Quantity</th>
          <th>Bonus</th>
          <th>MRP</th>
          <th>Cost per piece</th>
          <th>Mfd. Date</th>
          <th>Exp. Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(medicine, idx) in medicineList" :key="`AddMed-${idx}`">
          <td>
            {{ idx + 1 }}
          </td>
          <td>
            <a-input v-model="medicine.name" />
          </td>
          <td>
            <a-input v-model="medicine.batch" />
          </td>
          <td>
            <a-input-number v-model="medicine.quantity" />
          </td>
          <td>
            <a-input-number v-model="medicine.bonus" />
          </td>
          <td>
            <a-input-number v-model="medicine.mrp" />
          </td>
          <td>
            <a-input-number v-model="medicine.cost" />
          </td>
          <td>
            <a-date-picker v-model="medicine.mfd_date" />
          </td>
          <td>
            <a-date-picker v-model="medicine.exp_date" />
          </td>
          <td>
            <a-button type="danger" @click="removeColumn(idx)">Remove</a-button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="9">
            <a-button @click="AddRow">Add New Row</a-button>
          </td>
        </tr>
        <tr>
          <td colspan="9">
            <a-button @click="Submit">Submit</a-button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MEDICINE_URL } from '~/utils/Constants'
export default {
  name: 'add.vue',
  data() {
    return {
      formLayout: 'vertical',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      rowCount: [],
      distributorDetails: '',
      invoiceName: '',
      dateOfInvoice: '',
      medicineList: [],
    }
  },
  computed: {
    ...mapGetters({
      getDistributorData: 'getDistributorData',
    }),
  },
  mounted() {
    console.log(this.getDistributorData)
    this.$store.dispatch('updateLoadingState', false)
    this.AddRow()
  },
  methods: {
    removeColumn(idx) {
      const tempData = [...this.medicineList]
      tempData.splice(idx, 1)
      this.medicineList = tempData
    },
    AddRow() {
      this.medicineList.push({
        name: '',
        batch: '',
        quantity: null,
        bonus: null,
        mrp: null,
        cost: null,
        mfd_date: '',
        exp_date: '',
      })
    },
    async Submit() {
      try {
        const medicines = this.medicineList.map((data) => {
          Object.values(data).forEach((val) => {
            if (!val) {
              throw new Error('Fill all fields')
            }
          })
          console.log('HMM')
          return {
            ...data,
            mfd_date: data?.mfd_date?.format('YYYY-MM-DD'),
            exp_date: data?.exp_date?.format('YYYY-MM-DD'),
          }
        })

        if (!this.distributorDetails) {
          throw new Error("Distributor can't be empty")
        }
        if (!this.dateOfInvoice) {
          throw new Error('Date cannot be empty')
        }
        if (!this.invoiceName) {
          throw new Error('Invoice must have a unique ID')
        }

        const bodyData = {
          medicines,
          distributor: this.distributorDetails,
          dateOfInvoice: this.dateOfInvoice?.format('YYYY-MM-DD'),
          invoiceName: this.invoiceName,
        }

        const res = await this.$axios.post(MEDICINE_URL + '/add', bodyData)
        if (res.status === 200) {
          this.$message.success('Successfully added new invoice')
          this.$router.push('/')
        } else {
          throw new Error(res.error)
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    },
  },
}
</script>

<style scoped></style>
