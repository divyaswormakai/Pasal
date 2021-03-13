<template>
  <div>
    <h1>Invoices</h1>
    <!--  Invoice Table-->
    <a-table :data-source="getInvoiceData" :columns="columns" row-key="invoice">
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
      <a-button
        slot="action"
        slot-scope="record"
        type="danger"
        @click="deleteData(record)"
        >Delete</a-button
      >
      <a-button
        slot="detailsAction"
        slot-scope="record"
        type="primary"
        @click="showData(record)"
        >See Details</a-button
      >
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { INVOICE, INVOICE_URL } from '~/utils/Constants'

export default {
  name: 'Invoice',

  data() {
    return {
      visible: false,
      selectedInvoiceId: null,
      currentInvoiceData: {},
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns: [
        {
          title: 'Name',
          dataIndex: 'invoice_name',
          key: 'name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.invoice_name
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
          title: 'Date',
          dataIndex: 'date_of_invoice',
          key: 'dateOfInvoice',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.date_of_invoice
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
          title: 'Distributor',
          dataIndex: 'distributor[distrib_name]',
          key: 'invoiceDistribName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.distributor.distrib_name
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
          title: 'Action',
          dataIndex: '',
          key: 'x',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '',
          dataIndex: '',
          key: 'yy',
          scopedSlots: { customRender: 'detailsAction' },
        },
      ],
    }
  },
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
      const result = await this.$axios.get(INVOICE_URL)
      if (result.status === 200) {
        this.$message.success(result.data.msg, 0.75)
        this.updateBackendData({
          part: INVOICE,
          data: result.data.invoices,
        })
      } else {
        this.$message.error('Could not fetch data', 0.75)
      }
      this.updateLoadingState(false)
    },

    showData(data) {
      this.$router.push({
        path: `/invoice/${data.invoice_id}`,
        params: { id: data.invoice_id },
      })
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

    async deleteData(e) {
      this.updateLoadingState(true)
      const res = await this.$axios.delete(INVOICE_URL + '/' + e.invoice_id)
      if (res.status === 200) {
        this.updateBackendData({
          part: INVOICE,
          data: this.getDistributorData.filter(
            (val) => val.invoice_id !== e.invoice_id
          ),
        })

        this.$message.success(`Deleted ${e.invoice_name} successfully`, 0.75)
      } else {
        this.$message.error(res.data.msg, 0.75)
      }
      this.updateLoadingState(false)
    },
  },
  mounted() {
    this.getDataFromServer()
  },
}
</script>

<style scoped></style>
