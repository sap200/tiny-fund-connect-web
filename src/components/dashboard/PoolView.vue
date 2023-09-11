<template>
<div id="container-parent">
    <Menu />

    <div id="heading"> <b> Pools </b></div>

    <div id="add-button-container">  
        <Button id="add-button" @click="createAPool"> </Button>
    </div>
    <div id="container-1">

        <table class="styled-table" v-if="items.length > 0">
            <thead>
            <tr>
                <th> <b><i>SL No</i></b> </th>
                <th> <b><i>Pool Name</i></b> </th>
                <th><b><i>Pool-Id</i></b></th>
                <th> <b><i>Pool-Creator</i></b> </th>
                <th> <b><i>Pool-Balance</i></b></th>
                <th> <b><i>Action</i></b> </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <td> {{index+1}} </td>
                <td> {{item.currentPool.poolName}} </td>
                <td> {{item.currentPool.poolId}}</td>
                <td>{{item.currentPool.creatorEmail}} </td>
                <td>{{item.currentPool.poolBalance}}</td>
                <td> <Button class="table-button" @click="takeActionDecision(index)"  :disabled="items[index].isButtonDisabled">{{item.isActive?buttonTextEnter: buttonTextJoin}} </Button></td>
            </tr>
            </tbody>
        </table>

    </div>
    <p id="no-pool" v-if="shouldDisplay">{{noPool}}</p>
    <create-pool-modal v-show="showModal" @close-modal="closeTheModalAndRefresh"/>
    <Notifications position="top right"/>
    </div>
</template>

<script>
import checkToken from '../../utils.js'
import Menu from './Menu.vue'
import {HOST} from '../../../secret.js'
import CreatePoolModal from './CreatePoolModal.vue'
export default {
    name: "PoolView",
    components: {
        Menu,
        CreatePoolModal
    },
    data() {
        return {
            buttonTextEnter: "Enter ➤",
            buttonTextJoin: "Join 🚀",
            noPool: "You are not a member of any pool. Feel free to create one by clicking on + button",
            items: [],
            shouldDisplay: false,
            showModal: false,
        }
    },

    created() {
        this.callWhileCreated()
    },

    methods: {
        createAPool() {
            console.log("Create a pool")
            this.showModal = true;
          
        },

        async callWhileCreated() {
            let res =  await checkToken(HOST)
            console.log("Result here", res)
            if(!res) {
                localStorage.clear()
                this.$router.replace("/login_email_password_view")
            }
            
            await this.getAllPoolsByEmailId()

        },

        async takeActionDecision(index) {
            console.log("Here")
            console.log(this.items[index])
            this.items[index].isButtonDisabled = true;
            console.log("Step2")
            console.log(this.items[index])

            let myEmail = localStorage.getItem("email");
            let poolId = this.items[index].currentPool.poolId;
            let hasJoinedPool = this.items[index].isActive
            let loginResponse = localStorage.getItem("loginResponse")
            let loginResponseJson = {}

            try {
                loginResponseJson = JSON.parse(loginResponse)
            } catch(error) {
                this.items[index].isButtonDisabled = false;
                console.log(error)
                return;
            }
            // check token validity here
            // to be implemented
            let token = loginResponseJson.activeToken;
            const apiPath = HOST + "/pool/statusupdate"


            let payload = {
                "poolId": poolId,
                "membersList": [
                    {
                        "email": myEmail,
                        "hasJoined": true
                    }
                ]
            }

            const headers = new Headers();
             headers.append('token', token); // Replace with your actual access token
             headers.append('Content-Type', 'application/json'); // Set the content type to JSON

            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(payload),
            };


            if(hasJoinedPool) {
                // push the route to somewhere else
                console.log("Push pool view route")
                localStorage.setItem("poolData", JSON.stringify(this.items[index]))
                this.$router.push("/pool_description_view")
                this.items[index].isButtonDisabled = false;
                return;

            } else {
                console.log(myEmail, poolId)
                console.log("Write update logic here")

                try {
                    
                    const response = await fetch(apiPath, requestOptions);
                    const responseData = await response.json();

                    console.log("Response Data", responseData);

                    if (!response.ok) {
                        this.items[index].isButtonDisabled = false;
                        this.$notify(responseData.message)
                        return;
                    }

                    // pool joined successfully
                    // refresh after 2 secs
                    console.log("Response Data");
                    console.log(responseData)
                    this.$notify("Pool Joined successfully: " + poolId)
                    // fetch the latest pools
                    await this.getAllPoolsByEmailId()             

                return;


                } catch(error) {
                    this.items[index].isButtonDisabled = false;
                    this.$notify("Error occured: " + JSON.stringify(error))
                    console.log(error)
                    return;
                }
            }
        },

        async closeTheModalAndRefresh() {
            this.showModal = false;
            if(this.$store.wasCreatePoolApiHit) {
                await this.getAllPoolsByEmailId();
            }
            console.log("Refershed page")
        },

        async getAllPoolsByEmailId() {
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

            const apiPath = HOST + "/pool/getall"

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

                try{
                    const response = await fetch(url.toString(), requestOptions);

                        // Parse the response JSON
                    const data = await response.json();

                    console.log(data)

                    // Check if the response status is OK (200)
                    if (!response.ok) {
                        console.log("I am inside response not ok")
                        this.noPool = data.message;
                        console.log(data)
                        return;
                    }

                    const dataList = data.poolList;

                    if(dataList.length === 0) {
                        this.noPool = "You are not a member of any pool. Feel free to create one by clicking on + button"
                        this.shouldDisplay = true;
                        console.log("I am here", this.shouldDisplay)
                    } else {
                        this.noPool = "You are not a member of any pool. Feel free to create one by clicking on + button"
                        this.shouldDisplay = false;
                        this.items = dataList;
                        for(let i = 0; i < this.items.length; i++) {
                            this.items[i].isButtonDisabled = false;
                        }
                    }
                        return;
                
                } catch(error) {
                    this.noPool = error;
                    console.log(error)
                    return;

                }
        },
    }

}
</script>



<style scoped>

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