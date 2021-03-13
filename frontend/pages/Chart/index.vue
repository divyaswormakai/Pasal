<template>
  <div>
    <h2>Distributor Data</h2>
    <apexchart
      type="pie"
      width="600"
      :options="distribOptions.chartOptions"
      :series="distribOptions.series"
    ></apexchart>
    <hr />
    <h2>Medicine data</h2>
    <apexchart
      type="treemap"
      height="600"
      :options="medOptions.chartOptions"
      :series="medOptions.series"
    ></apexchart>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Index',
  computed: {
    ...mapGetters({
      getDistribChartData: 'getDistribChartData',
      getMedicineChartData: 'getMedicineChartData',
    }),
  },
  methods: {
    ...mapActions({
      updateLoadingState: 'updateLoadingState',
    }),
  },
  data() {
    return {
      distribOptions: {
        series: [10, 10, 10, 10, 10],
        chartOptions: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
          responsive: [
            {
              breakpoint: 650,
              options: {
                chart: {
                  width: 480,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      },
      medOptions: {
        series: [
          {
            data: [
              {
                x: 'New Delhi',
                y: 218,
              },
              {
                x: 'Kolkata',
                y: 149,
              },
              {
                x: 'Mumbai',
                y: 184,
              },
              {
                x: 'Ahmedabad',
                y: 55,
              },
              {
                x: 'Bangaluru',
                y: 84,
              },
              {
                x: 'Pune',
                y: 31,
              },
              {
                x: 'Chennai',
                y: 70,
              },
              {
                x: 'Jaipur',
                y: 30,
              },
              {
                x: 'Surat',
                y: 44,
              },
              {
                x: 'Hyderabad',
                y: 68,
              },
              {
                x: 'Lucknow',
                y: 28,
              },
              {
                x: 'Indore',
                y: 19,
              },
              {
                x: 'Kanpur',
                y: 29,
              },
            ],
          },
        ],

        chartOptions: {
          legend: {
            show: false,
          },
          chart: {
            height: 350,
            type: 'treemap',
          },
          title: {
            text: 'Basic Treemap',
          },
        },
      },
    }
  },
  created() {
    // Distributor chart
    this.distribOptions.series = Object.values(this.getDistribChartData)
    this.distribOptions.chartOptions.labels = Object.keys(
      this.getDistribChartData
    )
    // Medicine chart
    const medData = this.getMedicineChartData
    const keys = Object.keys(medData)
    const vals = Object.values(medData)
    const data = keys.map((key, idx) => ({ x: key, y: vals[idx] }))
    this.medOptions.series[0].data = [...data]

    this.updateLoadingState(false)
    console.log(this.getMedicineChartData)
  },
}
</script>

<style scoped></style>
