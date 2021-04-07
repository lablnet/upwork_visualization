<template>
  <div className="container">
    <h3>Drop your file here.</h3>
    <div className="form-group">
      <label>File</label>
      <input type="file" v-on:change="readfile" className="form-control-file"/>

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
    readfile(event) {
      let reader = new FileReader();
      reader.onload = function () {
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

        console.log("earning", this.refund);
        //console.log(this.data[0]);
      };

      //console.log(event.target.files[0]);
      reader.readAsBinaryString(event.target.files[0])
    }
  },
}
</script>