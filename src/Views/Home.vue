<template>
  <div class="container">
    <h3>Drop your file here.</h3>
    <div class="form-group">
      <label>File</label>
      <input type="file" v-on:change="readfile" class="form-control-file"/>

    </div>

    <div class="row">
      <div class="col-md-8">

      </div>
      <div class="col-md-4">
        <b>Total earning: </b> <i>{{ total.sum  }}</i> <br />
        <b>Total withdraw: </b> <i>{{ total.withdraw  }}</i> <br />
        <b>Total refund: </b> <i>{{ total.refund  }}</i> <br />
        <b>Total Upwork Fee: </b> <i>{{ total.fee  }}</i> <br />

      </div>
    </div>
    <div class="table-responsive">
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
</template>

<script>
import csvJSON from "../csv.js"

export default {
  name: "Home",
  data() {
    return {
      loading: false,
      file: null,
      data: {},
      earning: [],
      withdraw: [],
      serviceFee: [],
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
      return sum;
    },
    readfile(event) {
      let reader = new FileReader();
      reader.onload =  () => {
        this.data = JSON.parse(csvJSON(reader.result));
        //console.log(this.data);
        //console.log(this.data[101]['Ref ID']);

        let earn = [];
        let fee = [];
        let withdraw = [];
        let refund = [];
        for (let item in this.data) {
          // get the earning of contracts and hourly contracts.
          if (this.data[item]['Type'] === 'Fixed Price' || this.data[item]['Type'] === 'Hourly' || this.data[item]['Type'] === 'Bonus' || this.data[item]['Type'] === 'Miscellaneous' || this.data[item]['Type'] === 'Adjustment') {
            earn.push(this.data[item]);
          }
          if (this.data[item]['Type'] === 'Withdrawal') {
            withdraw.push(this.data[item]);
          }
          if (this.data[item]['Type'] === 'Service Fee') {
            fee.push(this.data[item]);
          }
          if (this.data[item]['Type'] === 'Refund') {
            refund.push(this.data[item]);
          }
          //console.log(this.data[item]);
        }
        console.log("Test", earn)

        this.earning = earn;
        this.serviceFee = fee;
        this.withdraw = withdraw;
        this.refund = refund;

        //console.log("earning", this.sum(this.withdraw));
        //console.log(this.data[0]);
      };

      //console.log(event.target.files[0]);
      reader.readAsBinaryString(event.target.files[0])

      // reset the input.
      event.target.value = '';

    },
  },
  computed: {
    total(x) {
      console.log("Withdraw", (this.fee))
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
        //console.log("sum", sum)
      }
      sum = sum - refund
      return {
        sum: parseFloat(sum).toFixed(2),
        refund: parseFloat(refund).toFixed(2),
        withdraw: parseFloat(this.sum(this.withdraw)).toFixed(2),
        fee: parseFloat(this.sum(this.serviceFee)).toFixed(2)
      }
    }
  }
}
</script>