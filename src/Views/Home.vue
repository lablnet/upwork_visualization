<template>
  <nav class="header">
    <div class="text ml-5">
      Upwork Visualization
    </div>
    <a class="source" href="https://github.com/lablnet/upwork_visualization">Source Code</a>

  </nav>
  <main class="mt-5 justify-content-center">
    <div class="container">
      <div class="" v-if="!loaded">
        <h1>Drop your file here.</h1>
        <div class="form-group">
          <label>File</label>
          <input type="file" v-on:change="readfile" class="form-control-file"/>
        </div>
        <h1>How to get transaction history CSV?</h1>
        <a href="https://support.upwork.com/hc/en-us/articles/211068188-Invoices-and-Transactions"> Follow the follwing guide</a>
      </div>
      <div class="col" v-if="loaded">
        <h1>Here's is your report.</h1> <br />
      </div>
      <div class="row" v-if="loaded">
        <div class="col-md-8">
          <h1 class="h2">Chart:</h1>
          <div style="display: flex;flex-direction:column;" >
            <EarningChart
                :labels="labels"
                :datasets="dataset"
            ></EarningChart>
          </div>

        </div>
        <div class="col-md-4">
          <h1 class="h2">Stats:</h1>

          <b>Total earning: </b> <i>{{ total.sum  }} USD</i> <br />
          <b>Total withdraw: </b> <i>{{ total.withdraw  }} USD</i> <br />
          <b>Total Withdraw Fee: </b> <i>{{ total.withdrawFee  }} USD</i> <br />
          <b>Total refund: </b> <i>{{ total.refund  }} USD</i> <br />
          <b>Total Upwork Fee: </b> <i>{{ total.fee  }} USD</i> <br />
          <b>Total Spend on Upwork: </b> <i>{{ total.membership  }} USD</i> <br />
        </div>
      </div>

      <div class="table-responsive" v-if="loaded">
        <h1 class="mt-3 h2">Feeds:</h1>

        <table class="table table-primary">
          <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Team</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          </thead>
          <tbody v-for="(item, idx) in earning" :key="idx" >
          <tr v-if="item['Ref ID']">
            <td>{{ item['Ref ID'] }}</td>
            <td>{{ item['Date'].replace('"', "") }} </td>
            <td>{{item['Type']}}</td>
            <td>{{ item['Team'] }}</td>
            <td>{{item['Description']}}</td>
            <td>
              {{ item['Amount'] }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <footer :class="getFooterPosition">
    <p class="note"><b>Note: This is an open source project built using Javascript, vuejs and chartjs, no server is involved here, your file is not uploaded to any server. For confirmation you can look to source code.</b></p>
    <p class="copyright">Made with 💕 by <a href="https://www.upwork.com/fl/lablnet">Muhammad Umer Farooq</a>.</p>
    <a href="https://github.com/lablnet/upwork_visualization">Source Code</a>
  </footer>
</template>

<script>
import csvJSON from "../csv.js"
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import EarningChart from '../components/EarningChart.vue'

export default {
  name: "Home",
  components: {
    Vue3ChartJs,
    EarningChart,
  },
  data() {
    return {
      labels: [],
      dataset: [],
      loading: false,
      loaded: false,
      file: null,
      data: {},
      earning: [],
      withdraw: [],
      serviceFee: [],
      membership: [],
      withdrawFee: [],
      refund: [],
      validType: [
        'application/vnd.ms-excel'
      ],
    }
  },
  methods: {
    sum(arr) {
      let sum = 0.0
      for (let item in arr) {
        sum += Math.abs(arr[item]['Amount'])
      }
      return sum
    },
    readfile(event) {
      let reader = new FileReader();
      reader.onload =  () => {
        this.data = JSON.parse(csvJSON(reader.result))

        let earn = []
        let fee = []
        let withdraw = []
        let refund = []
        let membership = []
        let withdrawFee = []
        let labels = []
        let dataset = {
          earning: [],
          withdraw: [],
          membership: [],
          withdrawFee: [],
          serviceFee: [],
          refund: [],
        }
        for (let item in this.data) {
          if (this.data[item]['Type'] === 'Fixed Price' || this.data[item]['Type'] === 'Hourly' || this.data[item]['Type'] === 'Bonus' || this.data[item]['Type'] === 'Miscellaneous' || this.data[item]['Type'] === 'Adjustment') {
            earn.push(this.data[item])
            labels.push(this.data[item]['Date'].replace('"', "").replace('"', ""))
            dataset.earning.push(Math.abs(this.data[item]['Amount']))
          }
          if (this.data[item]['Type'] === 'Withdrawal') {
            withdraw.push(this.data[item])
            dataset.withdraw.push(Math.abs(this.data[item]['Amount']))
          }
          if (this.data[item]['Type'] === 'Service Fee') {
            fee.push(this.data[item])
            dataset.serviceFee.push(Math.abs(this.data[item]['Amount']))
          }
          if (this.data[item]['Type'] === 'Refund') {
            refund.push(this.data[item])
            dataset.refund.push(Math.abs(this.data[item]['Amount']))
          }
          if (this.data[item]['Type'] === 'Membership Fee') {
            membership.push(this.data[item])
            dataset.membership.push(Math.abs(this.data[item]['Amount']))
          }
          if (this.data[item]['Type'] === 'Withdrawal Fee') {
            withdrawFee.push(this.data[item])
            dataset.withdrawFee.push(Math.abs(this.data[item]['Amount']))
          }
        }

        this.labels = labels
        this.dataset = dataset
        this.earning = earn
        this.serviceFee = fee
        this.withdraw = withdraw
        this.refund = refund
        this.membership = membership
        this.withdrawFee = withdrawFee
        this.loaded = true
        console.log("map", this.dataset)
      };
      reader.readAsBinaryString(event.target.files[0])
      // reset the input.
      event.target.value = ''
    },
  },
  computed: {
    getFooterPosition() {
      return (this.loaded) ? "" : 'fixed'
    },
    total(x) {
      let refund = this.sum(this.refund)
      let sum = 0.0
      for (let item in this.earning) {
        let amount = this.earning[item]['Amount']
        if (amount !== 0.0) {
          if (amount > 500) {
            let temp = amount - 500
            sum = sum + (500 - (500 * 0.20))
            sum = sum + (temp - (temp * 0.10))
          } else {
            sum = sum + (amount - (amount * 0.20))
          }
        }
      }
      sum = sum - refund
      return {
        sum: parseFloat(sum).toFixed(2),
        refund: parseFloat(refund).toFixed(2),
        withdraw: parseFloat(this.sum(this.withdraw)).toFixed(2),
        fee: parseFloat(this.sum(this.serviceFee)).toFixed(2),
        membership: parseFloat(this.sum(this.membership)).toFixed(2),
        withdrawFee: parseFloat(this.sum(this.withdrawFee)).toFixed(2),
      }
    }
  }
}
</script>
