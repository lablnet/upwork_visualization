<template>
  <div>
    <canvas id="chart"></canvas>
  </div>
</template>

<script>
import {Chart} from 'chart.js'

export default {
  name: 'EarningChart',
  props: {
    labels: {
      required: true,
      type: Array,
    },
    datasets: {
      required: true,
      type: Array,
    }
  },

  data() {
    return {
      ChartData : {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              label: "Earning",
              data: this.datasets.earning,
              backgroundColor: "#289c38",
              borderColor: "#39db4f",
              borderWidth: 3
            },
            {

              label: "Withdraw",
              data: this.datasets.withdraw,
              backgroundColor: "#db3939",
              borderColor: "#fc6262s",
              borderWidth: 1
            },
            {
              label: "Service Fee",
              data: this.datasets.serviceFee,
              backgroundColor: "#32b8c9",
              borderColor: "#53cbdb",
              borderWidth: 1
            },
            {
              label: "Membership",
              data: this.datasets.membership,
              backgroundColor: "#9d34d1",
              borderColor: "#a556cc",
              borderWidth: 1
            },
            {
              label: "Refund",
              data: this.datasets.refund,
              backgroundColor: "#e6dd37",
              borderColor: "#e3dd68",
              borderWidth: 1
            },
            {
              label: "Withdraw Fee",
              data: this.datasets.withdrawFee,
              backgroundColor: "#f08d30",
              borderColor: "#f0a660",
              borderWidth: 1
            },
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  padding: 10
                }
              }
            ]
          }
        }
      }
    }
  },
  mounted() {
    console.log("Chart mounted", this.labels)
    const ctx = document.getElementById('chart');
    new Chart(ctx, this.ChartData);

  }
}
</script>
