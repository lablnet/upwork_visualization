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
        <b>Total earning: </b> <i>{{ total  }}</i>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-primary">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody v-for="(item, idx) in earning" :key="idx" >
          <tr v-if="item['Ref ID']">
            <td>{{ item['Ref ID'] }}</td>
            <td>{{ item['Date'].replace('"', "") }} </td>
            <td>{{item['Type']}}</td>
            <td>{{item['Description']}}</td>
            <td>
              {{ get_amount(item) }}
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
    get_amount(item) {
      let _amount = 0.0
      console.log("utnes", parseFloat(item['Amount']))
      if (!isNaN(parseFloat(item['Amount']))) {
        console.log("!Nah");
        _amount = item['Amount']
      } else if (!isNaN(parseFloat(item['Amount in local currency']))) {
        _amount = item['Amount in local currency']
      } else if (!isNaN(parseFloat(item['Currency']))) {
        _amount = item['Currency']
      }
      if (_amount === 0) {
        console.log("item", item)
      }
      return _amount
    },
  },
  computed: {
    total() {
      let earning
      let sum = 0.0
      for (let item in this.earning) {
        //console.log("amount", this.earning[item]['Amount'], this.earning[item])

        let amount = 0.0
        if (!isNaN(parseFloat((this.earning[item]['Amount'])))) {
          amount = this.earning[item]['Amount']
        } else if (!isNaN(parseFloat(this.earning[item]['Amount in local currency']))) {
          amount = this.earning[item]['Amount in local currency']
        } else if (!isNaN(parseFloat(this.earning[item]['Currency']))) {
          amount = this.earning[item]['Currency']
        }
        if (amount !== 0.0) {
          if (amount > 500) {
            sum = sum + (amount - (amount * 0.20))

          } else {
            sum = sum + (amount - (amount * 0.20))
          }
        }
        //console.log("sum", sum)
      }
      return sum
    }
  }
}
</script>