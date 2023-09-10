<template>
  <div class="modal-overlay">
    <div class="modal">
        <p id="heading-create"> Pool Deposits </p>
        <div id="table-view">
            <table class="styled-table" v-if="this.$store.poolDeposits != null && this.$store.poolDeposits.length != 0">
                <thead id="table-heading">
                    <th> SL. NO. </th>
                    <th> Member </th>
                    <th>Pool-id</th>
                    <th> Checkout-id</th>
                    <th> Amount </th>
                    <th> Paid </th>
                </thead>
                <tbody v-for="(pd, idx) in this.$store.poolDeposits" :key="idx" id="table-body">
                    <tr>
                        <td> {{idx+1}} </td>
                        <td> {{pd.userEmail}} </td>
                        <td> {{pd.poolId}} </td>
                        <td> {{pd.checkoutId}} </td>
                        <td> {{pd.amount}} </td>
                        <td> {{pd.paid}} </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="this.$store.poolDeposits != null && this.$store.poolDeposits.length == 0"> 
            <p id="em-msg"> You don't have any deposits on pool yet, please top up to add balance to pool.</p>
        </div>

    </div>
    <div class="close" @click="$emit('close-modal')">
      <img class="close-img" src="../../assets/cancel_btn.png" alt="" />
    </div>
  </div>
</template>

<script>
// import {HOST, REDIRECT_NETWORK} from '../../../secret.js'

  export default {
      name: "PoolDepositModal",

    }
</script>

<style scoped>

#em-msg {
    background-color: white;
    color: red;
    font-family: cursive;
}

#table-heading {
    background-image: linear-gradient(to right, lightpink, skyblue, lightpink)
}

#table-body {
    font-size: 16px;
}

#table-view {
   display: flex;
  justify-content: center; /* Center horizontally */   
  width: 100%;
}

.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    text-align: left;
    height: 15px;
    padding: 10px;
    border-radius: 50px;
}

.styled-table thead tr {
    background-image: linear-gradient(to right , violet, skyblue, violet);
    padding: 10px;
    color: black;
    text-align: left;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
    height: 50px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    
}


.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr:hover {
    background-color: skyblue;
    cursor: pointer;
}

.styled-table th {
    padding: 10px;
    border: 1px solid black; 
}

.styled-table td {
     border: 1px solid;
     padding: 10px;
}


#heading-create {
    font-size: 27px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    width: 100%;
    padding: 15px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}


.modal {
  text-align: center;
  background-color: white;
  height: 70%;
  width: 80%;
  margin-top: 10%;
  padding: 20px;
  border-radius: 5px;
  overflow: auto;
  background-image:url("../../assets/bank_img.jpg");
  background-attachment: fixed;
  background-size: fill;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}


p {
  font-size: 16px;
  margin: 20px 0;
}


</style>