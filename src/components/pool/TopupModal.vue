<template>
  <div class="modal-overlay">
    <div class="modal">
        <p id="heading-create"> <b> Topup Form</b> </p><br>
        <div id="topup-form"> 
        <p id="info-text"> <i>Deposit amount should be of minimum ₹ 100</i> </p>

          <label id="topup-label"><b>Topup amount</b></label><br><br>
          ₹ <input type="number" id="topup-amnt" v-model="amount" min="0"/>
          <div id="submit-div">
              <Button id="topup-btn" @click="startDeposit" :disabled="isButtonDisabled"> Topup </Button>
          </div>
          <br>
          <p id="em-msg" v-if="errorMessage != ''"> {{errorMessage}} </p>
        </div>
    </div>
    <div class="close" @click="$emit('close-modal')">
      <img class="close-img" src="../../assets/cancel_btn.png" alt="" />
    </div>
    <Notifications position="top right"/>
  </div>
</template>

<script>
import {HOST, REDIRECT_NETWORK} from '../../../secret.js'

  export default {
      name: "TopupModal",

      data() {
          return{
              amount: 0,
              errorMessage: "",
          }
      },

      computed: {
        isButtonDisabled () {
          return this.amount <100
        }
      },


      methods: {
        async startDeposit() {
            this.errorMessage = ""
            console.log("Started deposit")
            const myAmnt = this.amount;
            this.amount = 0;
            console.log(myAmnt);

            let poolDetails = JSON.parse(localStorage.getItem("poolData"));
            let poolId = poolDetails.currentPool.poolId;

            let myEmail = localStorage.getItem("email");

            let successRedirectLink = REDIRECT_NETWORK + window.location.host + "/#/payment_success_page_view"; 
            let errorRedirectLink = REDIRECT_NETWORK + window.location.host + "/#/payment_success_page_view";

            let payload = {
                    "poolId": poolId,
                    "successRedirectLink": successRedirectLink,
                    "errorRedirectLink": errorRedirectLink,
                    "amount": myAmnt,
                    "userEmail": myEmail,
                }

            const loginResp = JSON.parse(localStorage.getItem("loginResponse"))
            const token = loginResp.activeToken;

            let headers = {
              "token": token,
            }

            const apiPath = HOST + "/deposit/start";

            const options = {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(payload), // Convert the data object to JSON
            };

            try {

              const response = await fetch(apiPath, options);

              const responseData = await response.json();

              if(!response.ok) {
                this.errorMessage = responseData.message;
                console.log(responseData);
                return;
              }

              console.log(responseData);

              localStorage.setItem("checkoutId", responseData.checkoutId);

              window.open(responseData.checkoutLink, "_blank");

            } catch(error) {
              console.log(error);
            }

        }
      }
    }
</script>

<style scoped>

#em-msg {
  color: red;
  background-color: white;
  text-align: center;
  border-radius: 10px;
}

#topup-form {
  text-align: left;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

#topup-label {
  font-size: 21px;
  color: black;
}

#info-text {
  color: red;
  background-color: white;
}

#topup-amnt {
  width: 90%;
  height: 35px;
  border: 0px;
  border-bottom: 1px solid black;
  background-color: rgb(255, 255, 255, 0.52);
  padding: 2px;
  font-size: 18px;
}

#heading-create {
    font-size: 25px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    width: 100%;
}

#submit-div {
  margin-top: 20px;
}

#topup-btn {
  width: 100px;
  height: 35px;
  border-radius: 8px;
  background-image: linear-gradient(to right, violet,skyblue,violet );
  border: 0px;
  cursor: pointer;
  font-family: cursive;
  color: white;
}

#topup-btn:enabled:hover {
    background-image: linear-gradient(to right, skyblue,violet,skyblue );
    box-shadow: 1px 1px 5px black;
}

#topup-btn:disabled {
  background-image: linear-gradient(to right, gray, lightgray, gray);
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
  height: 50%;
  width: 350px;
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