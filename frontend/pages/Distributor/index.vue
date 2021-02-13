<template>
  <div>
    <h1>Distributors</h1>
    <!--    Add Distributor Table-->
    <div>
      <a-button type="primary" @click="showModal">
        Open Modal with async logic
      </a-button>
      <a-modal
        title="Add a Distributor"
        :visible="visible"
        @ok="modalHandleOk"
        @cancel="modalHandleCancel"
      >
        <a-form :form="form" layout="vertical">
          <a-form-item label="Distributor Name">
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [
                    { required: true, message: 'Please input the name!' },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="Distributor Contact">
            <a-input
              v-decorator="[
                'contact',
                {
                  rules: [
                    { required: true, message: 'Please input the contact!' },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="Distributor Address">
            <a-input
              v-decorator="[
                'address',
                {
                  rules: [
                    { required: true, message: 'Please input the address!' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <!--    Distributor Table-->
    <a-table :data-source="getDistributorData" :columns="columns">
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
        type="danger"
        slot="action"
        slot-scope="record"
        @click="deleteData(record)"
        >Delete</a-button
      >
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DISTRIBUTOR, DISTRIBUTOR_URL } from '~/store/utils/Constants'

export default {
  name: 'Distributor',
  head() {
    return {
      title: 'Invoice',
    }
  },
  data() {
    return {
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),

      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns: [
        {
          title: 'Name',
          dataIndex: 'distrib_name',
          key: 'name',
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
          title: 'Contact',
          dataIndex: 'contact',
          key: 'contact',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getDistributorData: 'getDistributorData',
    }),
  },
  methods: {
    ...mapActions({
      updateBackendData: 'updateBackendData',
      updateLoadingState: 'updateLoadingState',
    }),

    async getDataFromServer() {
      const result = await this.$axios.get(DISTRIBUTOR_URL)

      if (result.status === 200) {
        this.updateLoadingState(false)
        this.$message.success(result.data.msg)
        this.updateBackendData({
          part: DISTRIBUTOR,
          data: result.data.distributors.map((val) => ({
            ...val,
            key: `Distributor-${val.distrib_id}`,
          })),
        })
      } else {
        this.$message.error('Could not fetch data')
      }
    },

    //  For Modal

    showModal() {
      this.visible = true
    },
    async modalHandleOk() {
      this.updateLoadingState(true)
      const result = await this.$axios.post(
        DISTRIBUTOR_URL,
        this.form.getFieldsValue()
      )
      if (result.status === 200) {
        const distributor = result.data.distributor
        this.updateBackendData({
          part: DISTRIBUTOR,
          data: this.getDistributorData.concat({
            ...distributor,
            key: `Distributor-${distributor.distrib_id}`,
          }),
        })
        this.$message.success(result.data.msg)
      } else {
        this.$message.error(result.data.msg)
      }
      this.updateLoadingState(false)
      this.visible = false
    },
    modalHandleCancel(e) {
      this.visible = false
    },

    //  For table data
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
      const res = await this.$axios.delete(DISTRIBUTOR_URL + '/' + e.distrib_id)
      if (res.status === 200) {
        this.updateBackendData({
          part: DISTRIBUTOR,
          data: this.getDistributorData.filter(
            (val) => val.distrib_id !== e.distrib_id
          ),
        })

        this.$message.success(`Deleted ${e.distrib_name} successfully`)
      } else {
        this.$message.error(res.data.msg)
      }
      this.updateLoadingState(false)
    },

    // TODO make the rows editable and stuff
    // async addData(e){
    //
    // }
  },
  mounted() {
    this.getDataFromServer()
  },
}
</script>

<style scoped></style>