<template>

<div id="parent-container">
    <img src="../../assets/green_tick.jpg" v-if="message==message2"/>
    <img src = "../../assets/loading.png" v-if="message==message1"/>
    <img src="../../assets/red_tick.png" v-if="message != '' && message != message1 && message != message2"/>
    <p id="success-message">
        {{message}}
    </p>
</div>

</template>


<script>

import {HOST} from '../../../secret.js'
export default {
    name: "PaymentSuccessPage",

    data() {
        return {
            message: "",
            message1: "Your Payment is processing ! Please do not press back button or refresh or your payment data will be lost... 7 secs ....",
            message2: "Your payment is successfully done ! We are redirecting you in 4 secs ...!"
        }
    },

    created() {
        this.callWhileCreated();
    },

    methods: {

        async callWhileCreated() {
            await this.checkCheckoutStatus();
        },

        async checkCheckoutStatus() {
            this.message = this.message1;

            const loginResp = JSON.parse(localStorage.getItem("loginResponse"));
            const token = loginResp.activeToken;

            const poolDetails = JSON.parse(localStorage.getItem("poolData"));
            const poolId = poolDetails.currentPool.poolId;

            const userEmail = localStorage.getItem("email");

            const checkoutId = localStorage.getItem("checkoutId");

            let header = {
                "token": token,
            }

            let payload = {
                    "poolId": poolId,
                    "userEmail": userEmail,
                    "checkoutId": checkoutId
                }

            const apiPath = HOST + "/deposit/status"

              const options = {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(payload), // Convert the data object to JSON
                };


            try {
                 const response = await fetch(apiPath, options);

                 const responseData = await response.json();
                
                 if(!response.ok) {
                     console.log(responseData);
                     this.message = responseData.message;
                     return;
                 }

                 this.message = this.message2;
                 console.log(responseData)
                // Remove the item from localStorage
                localStorage.removeItem("checkoutId");                
                setTimeout(() => {
                    window.close();
                }, 4000);



            }catch(error) {
                console.log(error);
            }
        }

    }

}
</script>

<style scoped>

img {
    width: 50px;
    height: 50px;
}

#success-message {
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 18px;
}

</style>
