<template>
<div id="container-parent">
    <Menu />

    <div id="heading"> <b> Withdrawls </b></div>
    <div id="balance-strip"> 
        <Button id="withdraw-money" @click="displayModal"> <span style="font-family:cursive"><b>Withdraw</b></span> </Button>
        <label id="balance-text"> <span id="wallet">💼</span> ₹ {{walletBalance}} </label> 
    </div>

    <div id="container-1">

        <table class="styled-table" v-if="items.length > 0">
            <thead>
            <tr>
                <th> <b><i>SL No</i></b> </th>
                <th><b><i>Email</i></b></th>
                <th> <b><i>Payout-Id</i></b> </th>
                <th> <b><i>Amount</i></b></th>
                <th> <b><i>Paid</i></b></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <td> {{index+1}} </td>
                <td> {{item.userEmail}}</td>
                <td>{{item.payoutId}} </td>
                <td>{{"₹ " + item.amount}}</td>
                <td>{{item.paid}}</td>
            </tr>
            </tbody>
        </table>

    </div>
    <p id="no-pool" v-if="shouldItBeDisplayed">{{noWithdrawls}}</p>
    <withdrawl-modal v-show="showModal" @close-modal="initiateClosureOfModal"/>
    </div>
</template>

<script>
import Menu from './Menu.vue'
import {HOST} from '../../../secret.js'
import WithdrawlModal from './WithdrawlModal.vue'
import checkToken from '../../utils.js'
export default {
    name: "WithdrawlList",
    components: {
        Menu,
        WithdrawlModal,
    },
    data() {
        return {
            items: [],
            noWithdrawls: "You dont have any withdrawls yet",
            walletBalance: 0,
            showModal: false,
        }
    },

    computed: {
        shouldItBeDisplayed() {
            return this.items.length == 0;
        }
    },

    created() {

        this.callWhileCreated()
    },

    methods: {

        async initiateClosureOfModal() {
            this.showModal = false;
            if(this.$store.wasWithdrawlDone) {
                this.$store.wasWithdrawlDone = false;
                await this.getAllWithdrawls();
                await this.getWithdrawlLimit();
            }
        },

        displayModal() {
            this.showModal = true;
        },

        async callWhileCreated() {
            let res =  await checkToken(HOST)
            console.log("Result here", res)
            if(!res) {
                localStorage.clear()
                this.$router.replace("/login_email_password_view")
                window.history.replaceState({}, '', '/login_email_password_view');
            }

            let x = this.getWithdrawlLimit()
            let y = this.getAllWithdrawls()
            let finalResult = [await x, await y];
            console.log(finalResult);
        },


        async getAllWithdrawls() {
            console.log("Getting all withdrawls")
            let email = localStorage.getItem("email")
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

            const apiPath = HOST + "/withdraw/getall"

            const params = {
                "email": email
            }

                const url = new URL(apiPath);
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                const headers = {
                'token': token,
                'Content-Type': 'application/json'
            // Add other headers as needed
                };

                // Create an options object with the headers and other configurations
                const requestOptions = {
                method: 'GET', // You can change the HTTP method if needed
                headers: headers
                };

                console.log(url)

                try {
                      const response = await fetch(url.toString(), requestOptions);

                        // Parse the response JSON
                      const data = await response.json();

                      console.log(data)

                    // Check if the response status is OK (200)
                    if (!response.ok) {
                        this.items = []
                        this.noWithdrawls = data.message;
                        console.log(data)
                        return;
                    }

                    if (data.length === 0) {
                        this.items = data;
                        this.noWithdrawls = "You don't have any deposits"
                        console.log("No deposits")
                        return;
                    }

                    this.items = data;
                    this.noWithdrawls = ""
                    console.log("Response fetched, rendering data")
                    return;

                } catch(error) {
                    this.noWithdrawls = error;
                    console.log(error)
                }
        },

        async getWithdrawlLimit() {
              // make a get request to get withdrawl limit
              let email = localStorage.getItem("email")

              let loginResponse = localStorage.getItem("loginResponse")
              let loginResponseJson = {}

                try {
                    loginResponseJson = JSON.parse(loginResponse)
                } catch(error) {
                    console.log(error)
                    return;
                }


                let token = loginResponseJson.activeToken;

                const params = {
                    "email": email
                }

                let apiPath = HOST + "/withdraw/limit"

                const url = new URL(apiPath);
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                const headers = {
                    'token': token,
                    'Content-Type': 'application/json'
                    // Add other headers as needed
                };

                // Create an options object with the headers and other configurations
                const requestOptions = {
                    method: 'GET', // You can change the HTTP method if needed
                    headers: headers
                };

                console.log(url)

                try {

                    const response = await fetch(url.toString(), requestOptions);

                        // Parse the response JSON
                    const data = await response.json();

                    if (!response.ok) {
                        this.$notify(data.message)
                        console.log(data.message)
                        return;
                    }

                    if(data.code == "PAYMENT000") {
                        this.walletBalance = data.amount;
                        this.$store.withdrawlLimit = data.amount;
                    }

                    console.log(data)

                } catch(error) {
                    console.log(error)
                    return;
                }




        }
    }

}
</script>

<style scoped>

#withdraw-money {
    margin-right: 20px;
    height: 25px;
    border-radius: 4px;
    border: 0px;
    padding-left: 4px;
    padding-right: 4px;
    background-image: linear-gradient(to right, violet, skyblue, violet);
    cursor: pointer;
}

#withdraw-money:hover {
    background-image: linear-gradient(to right, skyblue, violet, skyblue);
    box-shadow: 2px 2px 2px skyblue; /* Add the box shadow */

}

#wallet {
    font-size: 20px;
}

#balance-strip {
    background-color: black;
    padding: 10px;
    text-align: right;
    padding-right: 10px;
    color: white;
}

#balance-text {
    margin-right: 15px;
}

#add-button-container {
    margin-top: 25px;
    width: 100%;
    text-align: right;
}

#add-button {
  margin-right: 5%;
  width: 40px; /* Adjust the width as needed */
  height: 40px; /* Make the height equal to the width to create a circle */
  border-radius: 50%; /* Set border-radius to 50% to create a circle */
  background-image: url("../../assets/add_btn.png");
  background-size: fill;
  background-position: center; 
  background-repeat: no-repeat;
  cursor: pointer;
  border: 0px solid black;
}

#add-button:hover{
        box-shadow: inset 0 0 10px green, inset 0 0 10px green; /* Add the box shadow */

}

#no-pool {
    color: red;
    font-family: cursive;
    font-style: italic;
    font-size: 14px;
    background-color: white;
    padding: 8px;
}

#heading {
    font-size: 24px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    width: 100%;
    height: 50px;
    background-image: linear-gradient(to right , violet, skyblue, violet);
    text-align: center;
    padding-top: 50px;
    font-size: 25px;
    font-family: cursive;
    color: blueviolet;		
}

#container-parent {
      background-image: url('../../assets/bank_img.jpg');
      height: 100vh;
      overflow: auto;
}

#container-1 {
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
    border-radius: 20px;
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

.table-button {
    width: 100px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    cursor: pointer;
    border: 0px;
}

.table-button:hover {
    width: 100px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to left, violet, skyblue, violet);
    cursor: pointer;
    border: 0px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* Add the box shadow */
}


</style>
