<template>
  <div>
    <h1>Medicine/ Home</h1>
    <ul>
      <!--      TODO: Create a table here to edit filter and all that stuff-->
      <!--      TODO: Make the inputs in them editable as well as deletable-->
      <li
        v-for="(item, indx) in getMedicineData"
        :key="'Medicine-Item-' + indx"
      >
        {{ item.medicine_name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MEDICINE } from '~/utils/Constants'

export default {
  data() {
    return {
      temp: 'ASDf',
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
        this.$message.success(result.data.msg)
        this.updateBackendData({
          part: MEDICINE,
          data: result.data.medicineList,
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
