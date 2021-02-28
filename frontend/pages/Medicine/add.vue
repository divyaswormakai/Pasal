<template>
  <div>
    <h3>Add a New Bill</h3>
    <a-row type="flex" justify="start">
      <label> Invoice Name</label>
      <a-input placeholder="Basic usage" name="invoice_name" />
    </a-row>

    <a-row>
      <label>Distributor Name</label>
      <a-select
        default-value="lucy"
        style="width: 120px"
        v-model="distribDetails"
      >
        <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
          {{ (i + 9).toString(36) + i }}
        </a-select-option>
      </a-select>
    </a-row>
    <!--TODO make a form here to put the required wala kura haru-->
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
          <td>{{ idx }}</td>
          <td>
            <a-input v-model="medicine.name" />
          </td>
          <td><a-input v-model="medicine.batch" /></td>
          <td><a-input-number v-model="medicine.quantity" /></td>
          <td><a-input-number v-model="medicine.bonus" /></td>
          <td><a-input-number v-model="medicine.mrp" /></td>
          <td><a-input-number v-model="medicine.cost" /></td>
          <td>
            <a-date-picker
              placeholder="Select month"
              v-model="medicine.mfd_date"
            />
          </td>
          <td>
            <a-date-picker
              placeholder="Select month"
              v-model="medicine.exp_date"
            />
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
export default {
  name: 'add.vue',
  data() {
    return {
      rowCount: [],
      distribDetails: '',
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
  methods: {
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
    Submit() {
      this.medicineList = this.medicineList.map((data) => {
        return {
          ...data,
          mfd_date: data.mfd_date.format('YYYY-MM-DD'),
          exp_date: data.exp_date.format('YYYY-MM-DD'),
        }
      })
      console.log(this.medicineList)
      console.log(this.medicineList.map((val) => val.mfd_date))
    },
  },
  mounted() {
    this.$store.dispatch('updateLoadingState', false)
    this.AddRow()
  },
}
</script>

<style scoped></style>
