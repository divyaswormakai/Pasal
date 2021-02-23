<template>
  <div>
    <h1>Medicine/ Home</h1>
    <!--    TODO: Switch to get expired near medicine or others and vice versa-->
    <a-label>Show Near expired</a-label>
    <a-switch></a-switch>

    <a-table :columns="columns" :data-source="getMedicineData">
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="(c) => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="() => handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <a
        :href="'/invoice/' + record.invoice_id"
        slot="invoicetag"
        slot-scope="record"
        >{{ record.invoice_name }}</a
      >
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MEDICINE } from '~/utils/Constants'

export default {
  data() {
    return {
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns: [
        {
          title: 'Name',
          dataIndex: 'medicine_name',
          key: 'name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.medicine_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        {
          title: 'Batch Code',
          dataIndex: 'batch_code',
          key: 'batchCode',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.batch_code
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        {
          title: 'Mfd Date',
          dataIndex: 'mfd_date',
          key: 'mfdDate',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.mfd_date
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        {
          title: 'Exp Date',
          dataIndex: 'exp_date',
          key: 'expDate',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.exp_date
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Bonus', dataIndex: 'bonus', key: 'bonus' },
        { title: 'MRP', dataIndex: 'mrp', key: 'mrp' },
        { title: 'Cost', dataIndex: 'cost', key: 'cost' },
        {
          title: 'Distributor',
          dataIndex: 'distrib_name',
          key: 'distributor',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.distrib_name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        {
          title: 'Invoice',
          dataIndex: '',
          key: 'x',
          scopedSlots: { customRender: 'invoicetag' },
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getMedicineData: 'getMedicineData',
    }),
  },
  methods: {
    ...mapActions({
      updateBackendData: 'updateBackendData',
      updateLoadingState: 'updateLoadingState',
    }),

    async getDataFromServer() {
      const result = await this.$axios.get('/api/medicine')
      if (result.status === 200) {
        this.updateLoadingState(false)
        this.$message.success(result.data.msg, 0.75)
        this.updateBackendData({
          part: MEDICINE,
          data: result.data.medicineList.sort(
            (a, b) => a.medicine_name - b.medicine_name
          ),
        })
        console.log(result.data.medicineList)
      } else {
        this.$message.error('Could not fetch data', 0.75)
      }
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset(clearFilters) {
      clearFilters()
      this.searchText = ''
    },
  },
  mounted() {
    this.getDataFromServer()
  },
}
</script>
