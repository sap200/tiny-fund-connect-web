<template>
  <div class="modal-overlay">
    <div class="modal">
        <p id="heading-create"> <b> Balance Withdrawl Form </b> </p><br>
        <form id="create-pool-form" @submit.prevent>
            <label class="modal-texts p-name"> <b> Bank-Account-Number </b></label><br><br>
            <input type="text" class="rm-shad p-shad" v-model="bankAcc1" required><br><br>
            <label class="modal-texts p-name"> <b> Re-enter Bank-Account-Number </b></label><br><br>
            <input type="text" class="rm-shad p-shad" v-model="bankAcc2" required><br><br>
            <label class="modal-texts p-name"> <b> IFSC code </b></label><br><br>
            <input type="text" class="rm-shad p-shad" v-model="ifsc" required><br><br>
            <label class="modal-texts p-name"> <b> Amount </b></label><br><br>
            <input type="number" class="rm-shad p-shad" v-model="amount" min="100" required><br><br>
            <div id="sbtn-div">
            <Button class="submit-btn" :disabled="shouldDisableCreateBtn" @click="withdrawAmount"> <b>Withdraw</b> </Button>
            </div>
        </form>
        <div id="error-message" v-if="errorMessage != '' || newErrorMessage != ''">
            <i>{{errorMessage + "" +  newErrorMessage}}</i>
        </div>
    </div>
    <div class="close" @click="$emit('close-modal')">
      <img class="close-img" src="../../assets/cancel_btn.png" alt="" />
    </div>
    <Notifications position="top right"/>
  </div>
</template>

<script>
import {HOST} from '../../../secret.js'

  export default {
      name: "WithdrawModal",

      data() {
          return{
              amount: 0,
              bankAcc1: "",
              bankAcc2: "",
              ifsc: "",
              newErrorMessage: "",
          }
      },

      computed: {
          shouldDisableCreateBtn() {
            return (this.amount < 100 || this.amount > this.$store.withdrawlLimit) || this.bankAcc1 == "" || this.bankAcc2 == "" || this.ifsc == "" || this.bankAcc1 != this.bankAcc2;
          },

          errorMessage() {
              if(this.amount < 100 || this.amount > this.$store.withdrawlLimit) {
                  return "Amount has to be greater than equal to 100 and less than " + this.$store.withdrawlLimit;
              }

              return ""
          }
      },

      methods: {

          async withdrawAmount() {
              console.log("Inside")
                if(this.bankAcc1 != this.bankAcc2) {
                    this.newErrorMessage = "Bank acc nos. are not equal"
                    return;
                }

                this.$notify("Payment processing.. Please wait for 10 secs...")

                // get token
                let loginResponse = localStorage.getItem("loginResponse")
                let loginResponseJson = {}

                try {
                    loginResponseJson = JSON.parse(loginResponse)
                } catch(error) {
                    console.log(error)
                    return;
                }
                // check token validity here
                // to be implemented
                let token = loginResponseJson.activeToken;

                // get email
                let email = localStorage.getItem("email")

                let payload = {
                    "bankAccountNumber1": this.bankAcc1,
                    "BankAccountNumber2": this.bankAcc2,
                    "bankBranchCode": this.ifsc,
                    "PhoneNumber": "0918901934078",
                    "email": email,
                    "amount": this.amount
                }

                // do set all vars to empty string
                this.bankAcc1 = ''
                this.bankAcc2 = ''
                this.ifsc = ''
                this.amount = 0

                const apiPath = HOST + "/withdraw/start"

                const headers = {
                    'token': token,
                    'Content-Type': 'application/json'
                };

                const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                };

                this.$notify("Payment processing.. Please wait for 7 secs...")
                this.$notify("Payment processing.. Please wait for 5 secs...")


                try {

                    const response = await fetch(apiPath, requestOptions);

                    const responseData = await response.json();

                    this.$notify("Payment processing.. Please wait for 2 secs...")

                    
                    if (!response.ok) {
                        this.newErrorMessage = responseData.message;
                        this.$notify(responseData.message)
                        console.log(responseData)
                        return;
                    }

                    if(responseData.status == "SUCCESS") {
                        this.$notify("A payout of rs "+ responseData.amount +" has been completed towards your bank account with payout Id: " + responseData.payoutId)
                        this.$store.wasWithdrawlDone = true;
                        return;
                    }
                    // Handle the response data here
                    console.log(responseData);

                } catch(error) {
                    console.log(error)
                }

          }

      }
    }
</script>

<style scoped>

#error-message {
    background-color: white;
    margin-top: 15px;
    color: red;
    font-style: cursive;
}
.rm-shad {
  border: none;
  border-bottom: 1px solid #333; /* Adjust the color and thickness as desired */
  padding: 5px; /* Adjust padding as needed */
  outline: none; /* Remove the default focus outline */
  font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.submit-btn {
    background-image: linear-gradient(to right, pink, skyblue, pink);
    width: 90px;
    height: 30px;
    border-radius: 10px;
      outline: none;
      border: none;
      cursor: pointer;

}
.submit-btn:enabled:hover {
     background-image: linear-gradient(to right, skyblue, pink, skyblue);
       box-shadow: 0px 0px 5px 2px skyblue;
}

.submit-btn:disabled {
    background-image: linear-gradient(to right, grey,white,grey);
}

.sub-btn {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.p-shad {
    width: 60%;
}

.l-shad {
    width: 50%;
}

#sbtn-div {
    text-align: right;
    margin-top: 25px;
    margin-right: 25px;
}

.l-inp {
    margin-right: 30px;
}


.l-name {
    margin-right: 5px;
}

.add-btn {
    margin-left: 310px;
    width: 25px;
    height: 25px;
    cursor: pointer;
}

.add-btn:hover {
    box-shadow: inset 0 0 10px green, inset 0 0 10px green; /* Add the box shadow */
}

#members-list {
    margin-bottom: 10px;
}

.modal-texts {
    color: black;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 16px;
    font-style: bold;
}

#heading-create {
    font-size: 25px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    width: 100%;
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

#create-pool-form {
    text-align: left;
}

.modal {
  text-align: center;
  background-color: white;
  height: 60%;
  width: 500px;
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

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

#create-pool {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}
</style>