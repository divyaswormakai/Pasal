<template>
  <div>
    <h1>Distributors</h1>
    <!--    Add Distributor Modal-->
    <div>
      <a-button type="primary" @click="showModal"> Add a Distibutor </a-button>
      <a-modal
        title="Add a Distributor"
        :visible="visible"
        @ok="modalHandleOk"
        @cancel="modalHandleCancel"
      >
        <a-form :form="form" :layout="formLayout">
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
    <!--    Edit Distributor Modal-->
    <div>
      <a-modal
        title="Edit the Distributor"
        :visible="editVisible"
        @ok="editModalHandleOk"
        @cancel="editModalHandleCancel"
      >
        <a-form-model :form="editForm" :layout="formLayout">
          <a-form-model-item ref="name" label="Distributor Name" prop="name">
            <a-input v-model="editActiveData.distrib_name" required />
          </a-form-model-item>
          <a-form-model-item
            ref="contact"
            label="Distributor Contact"
            prop="contact"
          >
            <a-input v-model="editActiveData.contact" required />
          </a-form-model-item>
          <a-form-model-item
            ref="address"
            label="Distributor Address"
            prop="address"
          >
            <a-input v-model="editActiveData.address" required />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <!--    Distributor Table-->
    <a-table
      :data-source="getDistributorData"
      :columns="columns"
      rowKey="distributor"
    >
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
      <a-button
        type="primary"
        slot="editAction"
        slot-scope="record"
        @click="toggleEditModal(record)"
        >Edit</a-button
      >
    </a-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DISTRIBUTOR, DISTRIBUTOR_URL } from '~/utils/Constants'

export default {
  name: 'Distributor',
  head() {
    return {
      title: 'Distributor',
    }
  },
  data() {
    return {
      visible: false,
      formLayout: 'vertical',
      form: this.$form.createForm(this, { name: 'coordinated' }),

      editVisible: false,
      editForm: this.$form.createForm(this, { name: 'coordinated' }),
      editActiveData: {},
      rules: {
        name: [{ required: true, message: 'Please input the name' }],
        contact: [{ required: true, message: 'Please input the contact' }],
        address: [{ required: true, message: 'Please input the address' }],
      },
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
        {
          title: '',
          dataIndex: '',
          key: 'y',
          scopedSlots: { customRender: 'editAction' },
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

    //  For Modal
    //  region
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
        this.$message.success(result.data.msg, 0.75)
      } else {
        this.$message.error(result.data.msg, 0.75)
      }
      this.updateLoadingState(false)
      this.visible = false
    },
    modalHandleCancel(e) {
      this.visible = false
    },
    //  endregion
    //  For table data
    //  region
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

        this.$message.success(`Deleted ${e.distrib_name} successfully`, 0.75)
      } else {
        this.$message.error(res.data.msg, 0.75)
      }
      this.updateLoadingState(false)
    },
    //  endregion
    //  For Edit Modal
    //  region
    toggleEditModal(values) {
      this.editVisible = true
      this.editActiveData = { ...values }
    },

    async editModalHandleOk() {
      await this.updateLoadingState(true)
      console.log(this.editActiveData)
      const postData = {
        ...this.editActiveData,
        name: this.editActiveData.distrib_name,
      }
      const result = await this.$axios.put(
        DISTRIBUTOR_URL + `/${postData.distrib_id}`,
        postData
      )
      if (result.status === 200) {
        const distributor = result.data.distributor
        const toUpdateData = this.getDistributorData.map((val) =>
          val.distrib_id === distributor.distrib_id ? distributor : val
        )
        this.updateBackendData({
          part: DISTRIBUTOR,
          data: toUpdateData,
        })
        this.$message.success(result.data.msg, 0.75)
      } else {
        this.$message.error(result.data.msg, 0.75)
      }
      this.updateLoadingState(false)
      this.editVisible = false
    },
    editModalHandleCancel(e) {
      this.editVisible = false
    },
    //  endregion
  },
}
</script>

<style scoped></style>
