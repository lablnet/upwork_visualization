<template>
  <div className="container">
    <h3>Drop your file here.</h3>
    <div className="form-group">
      <label>File</label>
      <input type="file" v-on:change="readfile" className="form-control-file"/>

    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <tr>
          <th>ID</th>
          <th>Contact</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
        <tr v-for="item in data">
          <td>{{ item['Ref ID'] }}</td>
          <td>{{item['Description']}}</td>
          <td>{{ item['Date'] }}</td>
          <td>{{ item['Amount in local currency'] }}</td>
        </tr>
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
        sum += Math.abs(arr[item]['Amount in local currency'])
      }
      return sum;
    },
    readfile(event) {
      let reader = new FileReader();
      reader.onload =  () => {
        this.data = JSON.parse(csvJSON(reader.result));
        //console.log(this.data);
        console.log(this.data[101]['Ref ID']);

        let earn = [];
        let fee = [];
        let withdraw = [];
        let refund = [];
        for (let item in this.data) {
          // get the earning of contracts and hourly contracts.
          if (this.data[item]['Description'] === 'Fixed Price' || this.data[item]['Description'] === 'Hourly' || this.data[item]['Description'] === 'Bonus' || this.data[item]['Description'] === 'Miscellaneous') {
            earn.push(this.data[item]);
          }
          if (this.data[item]['Description'] === 'Withdrawal') {
            withdraw.push(this.data[item]);
          }
          if (this.data[item]['Description'] === 'Service Fee') {
            fee.push(this.data[item]);
          }
          if (this.data[item]['Description'] === 'Refund') {
            refund.push(this.data[item]);
          }
          //console.log(this.data[item]);
        }
        this.earning = earn;
        this.serviceFee = fee;
        this.withdraw = withdraw;
        this.refund = refund;

        console.log("Test", withdraw)
        //console.log("earning", this.sum(this.withdraw));
        //console.log(this.data[0]);
      };

      //console.log(event.target.files[0]);
      reader.readAsBinaryString(event.target.files[0])
    }
  },
}
</script>