<template>
    <div id="parent-container-pool"> 
        <Menu/>

        <div id="heading-container"> <b> Pool Description Page </b> </div>
        <div id="buttons-container"> 
            <Button class="deposit-button" @click="goBack"> 🔙 Back </Button>
            <Button class="deposit-button" @click="redirectToTrade"> <b>💹 Trade </b></Button>
            <Button class="deposit-button" @click="onPoolDepositModalShow"> <b>Pool Deposits </b></Button>
            <Button class="deposit-button" @click="showTopupModal=true"> <b>Top Up</b> ⬆️ </Button>
            <Button class="deposit-button" @click="displayMembersPage"> <b>👥 Members </b></Button>
            <Button class="deposit-button" @click="showAddMemberModal=true"> <b>➕ Add </b></Button>
            <label id="balance-tab"> <b> <span id="money-bag">💰</span> ₹ {{poolBalance}}</b> </label>
            <label class="pool-id"> <b>{{getPoolIdFromStorage}}</b> </label>
            <Button class="deposit-button" @click="exitMyselfFromPool"> <b>🚫 Exit Pool </b></Button>


        </div>

        <div id="container-chat-pool-member">
            <div id="chat-container" class="display-inline">
                <div class="chat-heading">
                    💬 <b>Chats</b>
                </div>

                <div id="text-box">
                    <p class="xt" v-for="(chat, index) in chats.chatRecord" :key="index"> 
                        <span class="chat-sender"><b>{{chat.sender}}</b> : </span> <span class="chat-message">{{chat.message}}</span> <br> 
                        <span id="g">{{ getDate(chat.timeStamp)}}</span> 
                    </p>
                </div>

                <div id="inp-box-btn">
                    <textarea id="my-in-box" v-model="message"/>
                    <img src="../../assets/send_cht_btn.png" @click="sendChatToPool"/>
                </div>

            </div>

            <div id="members-container" class="display-inline">
                <div class="chat-heading">
                    🔒 <b>Inactive Polls</b>
                </div>
                <div id="members-box" >
                    <p class="members-names" v-for="(inactPolls, idxd) in inactivePolls" :key="idxd" @click="startModalShowForPoolDetails(inactPolls.pollId)"> <b>🔒&nbsp;&nbsp;{{inactPolls.pollId}}</b>  </p>
                </div>

            </div>

            <div id="poll-container" class="display-inline">
                <div class="chat-heading">
                    📋 <b>Polls</b>
                </div>
                <div id="poll-box" >
                    <div id="poll-card" v-for="(actPoll, index) in activePolls" :key="index">
                        <p id="poll-heading"> <b>Poll By {{actPoll.pollCreatorEmail}}</b> </p>
                        <form id="options-form" @submit.prevent>
                            <p id="poll-message"><i> {{actPoll.message}} </i> </p>
                            <label class="options" v-for="(option, idx) in actPoll.options" :key="idx"> 
                                <input type="radio" :name="actPoll.pollId" :value="idx" v-model="actPoll.choice"/>
                                {{option}}
                                <br>
                            </label>
                            <div id="poll-action-items">
                                <br>
                                <Button id="vote-button" @click="startVoting(index)" :disabled="actPoll.votingDone"> Vote </Button>
                                <Button id="close-button" :disabled="actPoll.isCurrentUserCreator" @click="closePoll(index)"> Close </Button>
                            </div><br>
                        </form>
                    </div>
                
                </div>

                <div id="creat-poll-btn">
                    <Button id="create-poll-btn" @click="showPollCreateModal=true"> Create Poll </Button>
                </div>

            </div>
        </div>

        <Notifications position="top right"/>
        <!-- <members-list-modal v-show="showModal" @close-modal="showModal = false"/> -->
        <poll-modal v-show="showPollModal" @close-modal="showPollModal = false"/>
        <poll-create-modal v-show="showPollCreateModal" @close-modal="tryClosingPollCreation"/>
        <add-member-modal v-show="showAddMemberModal" @close-modal="tryClosingAddMemberModal"/>
        <topup-modal v-show="showTopupModal" @close-modal="onTopupModalExit"/>
        <pool-deposit-modal v-show="showPoolDepositModal" @close-modal="showPoolDepositModal=false"/>
    </div>
</template>


<script>
import Menu from '../dashboard/Menu.vue'
import {HOST} from '../../../secret.js'
// import MembersListModal from './MembersListModal.vue'
import PollModal from './PollModal.vue'
import PollCreateModal from './PollCreateModal.vue'
import AddMemberModal from './AddMemberModal.vue'
import TopupModal from './TopupModal.vue'
import PoolDepositModal from './PoolDepositModal.vue'
import checkToken from '../../utils'
export default {
    name: "PoolDescription",
    components: {
        Menu,
        // MembersListModal,
       PollModal,
        PollCreateModal,
       AddMemberModal,
        TopupModal,
     PoolDepositModal,

    },
    data() {
        return {
            poolId: "",
            chats: { },
            message: "",
            showModal: false,
            inactivePolls: [],
            activePolls: [],
            choices: [],
            selected: [],
            showPollModal: false,
            showPollCreateModal: false,
            showAddMemberModal: false,
            showTopupModal: false,
            poolBalance: 0,
            showPoolDepositModal: false,
        }
    }, 

    created() {
        this.callWhileCreated()
    },

    computed: {

        getPoolIdFromStorage() {
            let x = localStorage.getItem("poolData")
            let jsa = JSON.parse(x);
            return jsa.currentPool.poolId;
        }
    },

    methods: {


        goBack() {
            this.$router.replace("/pool_view_page")
        },

        displayMembersPage() {
             window.open('#/member_list_modal_view', '_blank');
        },

        redirectToTrade() {
            this.$router.push("/trading_terminal_view")
        },

        async onPoolDepositModalShow() {

                console.log("Hello world")


                const apiPath = HOST + "/deposit/getallbypoolid"

                const poolDetails = JSON.parse(localStorage.getItem("poolData"))

                const params = {
                    poolId: poolDetails.currentPool.poolId,
                }

                const loginResp = JSON.parse(localStorage.getItem("loginResponse"))

                const headers = {
                    token: loginResp.activeToken,
                }

                const queryString = new URLSearchParams(params).toString();

                const requestOptions = {
                    method: 'GET',
                    headers: headers,
                };

                this.$notify("Started syncing pool deposits ...")

                try {
                    const response = await fetch(`${apiPath}?${queryString}`, requestOptions);

                     const responseData = await response.json();

                     if(!response.ok) {
                         this.$notify("Unable to sync deposits...")
                         return;
                     }

                     this.$store.poolDeposits = responseData;

                } catch(error) {
                    console.log(error)
                }

                this.showPoolDepositModal = true;
          
        },
        
        async onTopupModalExit() {
            this.showTopupModal = false;
            setTimeout(async () => {
                await this.getUpdatedPool(); 

            }, 5000);
        },

        getPoolBalance() {
            let x = localStorage.getItem("poolData")
            let jsa = JSON.parse(x);
            return jsa.currentPool.poolBalance;
        },

        async callWhileCreated() {
            let res =  await checkToken(HOST)
            console.log("Result here", res)
            if(!res) {
                localStorage.clear()
                this.$router.replace("/login_email_password_view")
            }

            await this.getUpdatedPool()
            await this.getChats();
            await this.getAllPollsById()
            this.poolBalance = this.getPoolBalance()
        },

        async tryClosingPollCreation() {
            this.showPollCreateModal = false;
            if(this.$store.isPollApiHit) {
                await this.getAllPollsById()
            }
            
        },

        async tryClosingAddMemberModal() {
            console.log("here")
            this.showAddMemberModal = false;
        },


        async getUpdatedPool() {
            const poolData = JSON.parse(localStorage.getItem("poolData"))
            const poolId = poolData.currentPool.poolId;
            console.log(poolId);

            const loginResp = JSON.parse(localStorage.getItem("loginResponse"))
            const token = loginResp.activeToken;

            const headers = {
                "token": token
            }

            const params = new URLSearchParams({
                poolId: poolId, 
            });

            const apiPath = HOST + "/pool/details";

            const url = `${apiPath}?${params.toString()}`;


            try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: headers,
                    });

                    const data = await response.json();

                    
                    if (!response.ok) {
                        console.log(data)
                        return;
                    }

                    let cp = {
                        currentPool: data,
                        isActive: poolData.isActive,
                        isButtonDisabled: poolData.isButtonDisabled,
                    }

                    console.log("Inside pool fetch")
                    console.log(cp)

                    // update pool balance
                    this.poolBalance = data.poolBalance;


                    localStorage.setItem("poolData", JSON.stringify(cp))

            } catch(error) {
                console.log(error);
            }
        },

        async exitMyselfFromPool() {
            const loginResp = JSON.parse(localStorage.getItem("loginResponse"))
            const token = loginResp.activeToken;

            const poolData = JSON.parse(localStorage.getItem("poolData"))
            const poolId = poolData.currentPool.poolId;

            const myEmail = localStorage.getItem("email");

            let payload = {
                poolId:poolId,
                oneMember: {
                    email: myEmail,
                }
            }

            const headers = {
                'token': token, 
                'Content-Type': 'application/json', 
            };

            const apiPath = HOST + "/pool/exit";

            console.log(JSON.stringify(payload))

            try {
            
                const response = await fetch(apiPath, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(payload) // Convert the payload to JSON format
                });

                const data = await response.json();

                if(!response.ok) {
                    console.log(data);
                    return;
                }

                this.$notify("Exited from pool");
                localStorage.removeItem('poolData');

                this.$router.push("/pool_view_page");

            } catch(error) {
                console.log("Here I am ")
                console.log(error)
            }
        },

        async getPollDetailsById() {
            console.log(this.$store.currentPollId)
            const baseUrl = HOST + "/poll/get" // Replace with your API endpoint URL
            const params = new URLSearchParams({
                pollId: this.$store.currentPollId, 
            });

            const url = `${baseUrl}?${params.toString()}`;

            try {
                const response = await fetch(url);

                const data = await response.json();

                if (!response.ok) {
                    console.log(data);
                    return;
                }

                this.$store.myOwnPollDetails = data;
                
                console.log(data); // Do something with the response data
            } catch (error) {
                console.error('Error:', error);
            }
        },

        async getPollVotes() {
            console.log(this.$store.currentPollId);
            const baseUrl = HOST + "/poll/getresult" // Replace with your API endpoint URL
            const params = new URLSearchParams({
                pollId: this.$store.currentPollId, 
            });

            const url = `${baseUrl}?${params.toString()}`;

            try {
                const response = await fetch(url);

                const data = await response.json();

                if (!response.ok) {
                    console.log(data);
                    return;
                }

                this.$store.myOwnVoteDetails = data.pollResultByOptionNames;
                
                console.log(data); // Do something with the response data
            } catch (error) {
                console.error('Error:', error);
            }
            
        },

        async startModalShowForPoolDetails(pollId) {
            console.log(pollId)
            this.$notify("Initializing view please wait for 5 secs...")
            this.$store.currentPollId = pollId;
            await this.getPollVotes();
            await this.getPollDetailsById();
            console.log("store", this.$store.myOwnPollDetails);
            this.showPollModal = true;
        },

        getDate(time) {
            const date = new Date(time);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            return formattedDate;
        },

        async sendChatToPool() {
              if(this.message == "" ) {
                  this.$notify("Message is empty")
                  return;
              }

              let poolDetails = JSON.parse(localStorage.getItem("poolData"))
              console.log(poolDetails);
              const poolId = poolDetails.currentPool.poolId;
              const url = HOST + '/chat/send';
              const myEmail = localStorage.getItem("email")
              console.log("MyEmail", myEmail);
              const data = {
                 "poolId": poolId,
                 "sender": myEmail,
                 "message": this.message,
             };

             this.message = ""

             console.log("Here")

             try {
                 const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Set the content type to JSON
                    },
                    body: JSON.stringify(data), // Convert the data to JSON format
                });

                const responseData = await response.json();
                console.log(responseData);
                
                if(!response.ok) {
                    console.log(responseData);
                    this.$notify("Error in sending chat" + responseData.message)
                    return;
                }

                await this.getChats()

                console.log(this.chats);

             } catch(error) {
                 console.log(error)
             }
        },

        async getChats() {
            console.log("step 1")
            let poolDetails = JSON.parse(localStorage.getItem("poolData"))
            console.log(poolDetails);
            const poolId = poolDetails.currentPool.poolId;

            const baseURL = HOST + "/chat/getallbypool";
            const params = new URLSearchParams();
            params.append('poolId', poolId);

            const urlWithParams = `${baseURL}?${params.toString()}`;

            try {
                const response = await fetch(urlWithParams);
                
                const data = await response.json();

                console.log(data)

                if (!response.ok) {
                   console.log(data)
                   return;
                }

                this.chats = data;


            } catch(error) {
                console.log(error)
            }

        },

        async getAllPollsById() {
            console.log("step 1")
            let poolDetails = JSON.parse(localStorage.getItem("poolData"))
            console.log(poolDetails);
            const poolId = poolDetails.currentPool.poolId;

            const baseURL = HOST + "/poll/getall";
            const params = new URLSearchParams();
            params.append('poolId', poolId);

            const urlWithParams = `${baseURL}?${params.toString()}`;
            

            try {
                const response = await fetch(urlWithParams);
                    
                const data = await response.json();

                console.log(data)

                if (!response.ok) {
                    console.log(data)
                    return;
                }

                // sort out active and inactive polls and assign
                this.activePolls = []
                this.inactivePolls = []
                for(let i = 0; i < data.length; i++) {
                    if(data[i].isActive) {

                        const hasVoted = await this.didUserVoted(data[i].pollId, localStorage.getItem("email"))
                        data[i].choice = 0;
                        data[i].votingDone = hasVoted;
                        data[i].isCurrentUserCreator = data[i].pollCreatorEmail != localStorage.getItem("email");
                        this.activePolls.push(data[i])
                    } else {
                        this.inactivePolls.push(data[i]);
                    }
                }

                console.log(this.activePolls);
                console.log(this.inactivePolls);

            } catch(error) {
                console.log(error);
            }
        },

        async startVoting(index) {
            console.log(this.activePolls[index]);
            let payload = {
                "pollId": this.activePolls[index].pollId,
                "voterEmail": localStorage.getItem("email"),
                "choice": this.activePolls[index].choice,
            }

            const alreadyVotingDone = await this.didUserVoted(this.activePolls[index].pollId, localStorage.getItem("email"));
            if(alreadyVotingDone) {
                this.activePolls[index].votingDone = true;
                this.$notify("Don't tamper, voting is already done")
                return;
            }

            const loginResp = JSON.parse(localStorage.getItem("loginResponse"));
            const token = loginResp.activeToken


             const url = HOST + "/vote/create" // Replace with your API endpoint URL
             const headers = {
                'token': token, // Replace with your authentication header
             };

            this.activePolls[index].votingDone = true;


             try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload) // Convert the payload to JSON format
                    });

                const data = await response.json();
                console.log(data); // Do something with the response data
                if (!response.ok) {
                    console.log(data)
                    this.activePolls[index].votingDone = false;
                    return;
                }

                this.$notify("Voted successfully")
                await this.getAllPollsById();

             } catch(error) {
                this.activePolls[index].votingDone = false;
                 console.log(error)
                 return;
             }
        },

        async didUserVoted(pollId, email) {

            const baseURL = HOST + '/poll/alreadyvoted';
            const params = new URLSearchParams();
            params.append('pollId', pollId);
            params.append('email', email);

            // Construct the URL with parameters
             const urlWithParams = `${baseURL}?${params.toString()}`;

             try {
                    // Send the GET request using fetch
                    const response = await fetch(urlWithParams);

                    // Parse the JSON response (assuming it's JSON)
                    const data = await response.json();


                    if (!response.ok) {
                        console.log(data);
                        return true;
                    }

                    return data.hasVoted;

             } catch(error) {
                 console.log(error)
                 return true;
             }
        },

        async closePoll(index) {
            let pollDetails = this.activePolls[index];


            let payload = {
                "pollId": pollDetails.pollId,
            }

            let url = HOST + "/poll/inactivate"


            this.activePolls[index].isCurrentUserCreator = true;


            try {
                 const response = await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(payload) // Convert the payload to JSON format
                    });

                const data = await response.json();

                if(!response.ok) {
                    console.log(data)
                    return;
                }

                this.$notify("Poll successfully closed")
                await this.getAllPollsById()

            } catch(error) {
                console.log(error)
            }

        }
    }
}
</script>

<style scoped>

#create-poll-btn {
    width: 150px;
    height: 45px;
    border: 0px;
    border-radius: 35px;
    background-image: linear-gradient(to right, violet, blue, violet);
    color: white;
    font-family: cursive;
    cursor: pointer;
}

#create-poll-btn:hover {
    background-image: linear-gradient(to right, blue, violet, blue);
    box-shadow: 1px 1px 5px violet;
}

#vote-button {
    margin-right: 40px;
    width: 70px;
    height: 30px;
    background-image: linear-gradient(to right, green, rgb(127, 186, 38), green);
    border: 0px;
    border-radius: 5px;
    cursor: pointer;
    font-family: cursive;
    color: white;
}

#vote-button:enabled:hover {
    background-image: linear-gradient(to right, rgb(127, 186, 38), green, rgb(127, 186, 38));
    box-shadow: 1px 1px 5px green;
}

#vote-button:disabled {
    background-image: linear-gradient(to right, grey, lightgray, grey);
}

#close-button {
    margin-right: 40px;
    width: 70px;
    height: 30px;
    background-image: linear-gradient(to right, red, darkred, red);
    border: 0px;
    border-radius: 5px;
    cursor: pointer;
    font-family: cursive;
    color: white;
}

#close-button:enabled:hover {
    background-image: linear-gradient(to right, darkred, red, darkred);
    box-shadow: 1px 1px 5px darkred;
}

#close-button:disabled {
    background-image: linear-gradient(to right, grey, lightgray, grey);
}

#options-form {
    margin-left: 20px;
    margin-bottom: 40px;
}

#poll-heading {
    color: black;
    font-family:'Times New Roman', Times, serif;
    text-align: center;
    background-image: linear-gradient(to right,pink, skyblue, pink);
    padding: 10px;
    
}

#poll-message {
    color: blue;
    font-family: cursive;
}

#poll-action-items {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

#poll-card {
    background-color: white;
    margin-right: 20px;
    margin-top: 20px;
    color: black;
    border-radius: 20px;
    box-shadow: 10px 10px 5px rgb(0, 0, 0, 0.5);
}

.members-names {
    margin-right: 20px;
    padding: 10px;
    border-bottom: 2px solid darkgreen;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 16px;
    color: black;
    cursor: pointer;
}

.members-names:hover {
    box-shadow: 1px 1px 3px violet;
}

#g {
    text-align: right;
    color: rgb(131, 64, 20);
}

.chat-sender {
    color: black;
    font-style: cursive;
}

.chat-message {
    color: blue;
}

#parent-container-pool {
    overflow: auto;
}

.xt {
    border: 1px;
    background-color: white;
    border-radius: 20px 20px 20px 0px;
    padding: 10px;
    padding-left: 20px;
    overflow: scroll;
}


#text-box {
    color: black;
    text-align: left;
    padding: 10px;
    line-height: 1.4;
}

#members-box {
    line-height: 1.4;
    color: black;
    text-align: left;
    padding-left: 20px;
}

#poll-box {
        line-height: 1.4;
        text-align: left;
        padding-left: 20px;
}

img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-left: 10px;
    cursor: pointer;
}

img:hover {
        box-shadow: 2px 2px 5px green;

}

#inp-box-btn {
    display: flex;
    margin-top: 15px;
    margin-left: 10px;
    padding-top: 20px;
}

#my-in-box {
    width: 80%;
    margin-right: 5px;
    height: 30px;
    border-radius: 30px;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 20px;
    background-color: rgba(0, 0, 0, 0.52);
    color: white;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    word-wrap: break-word;
    white-space: normal;
}

#text-box {
    width: 100%;
    height: 80vh;
    overflow: scroll;

}

#members-box {
    width: 100%;
    height: 94%;
    overflow: scroll;

}

#poll-box {
    height: 89vh;
    width: 100%;
    height: 80vh;
    overflow: scroll;
}

.pool-id {
    margin-right: 20px;
    background-color: violet;
    background-image: linear-gradient(to right, violet, turquoise, violet);
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 10px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color: black;
    margin-left: 20px;
    
}




#chat-container {
    width: 40%;
}

#poll-container {
    width: 25%;
}

#members-container {
    width: 35%;
}


.display-inline {
  flex: 1;
  display: inline-block; /* Display children inline */
  height: 100%;
  background-image: url('../../assets/bank_img.jpg');
  color: #ffffff; /* Text color for the children */
  text-align: center; /* Center-align text inside the children */
  line-height: 100px; /* Vertically center text */
  border-right: 1px solid black;
  background-size: cover;
  background-attachment: fixed;

}

.display-inline:nth-child(1) {
  flex: 40%; /* Set the width of the first child to 40% */
}

.display-inline:nth-child(2) {
  flex: 25%; /* Set the width of the second child to 25% */
}

.display-inline:nth-child(3) {
  flex: 35%; /* Set the width of the third child to 35% */
}

#container-chat-pool-member {
    height: 100vh;
    width: 100%;
    overflow: auto;
}

#heading-container {
    background-color: black;
    border-top: 1px solid red;
    padding: 3px;
    font-size: 18px;
    color: white;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

#buttons-container {
    text-align: right;
    padding: 10px;
    background-color: skyblue;
    margin-bottom: 0px;
}

.deposit-button {
    margin-right: 20px;
    border: 0px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    cursor: pointer;
}

.deposit-button:hover {
    background-image: linear-gradient(to right, skyblue, pink, skyblue);
    box-shadow: 2px 2px 5px aliceblue;

}

#balance-tab {
    color: green;
    font-size: 18px;
}

#money-bag{
    font-size: 20px;
}

.chat-heading {
    color: black;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    background-color: aliceblue;
    text-align: center;
    line-height: 1.4;
    height: 30px;
    padding: 10px;

}

#container-chat-pool-member {
   display: flex; /* Use flexbox to align children horizontally */
   justify-content: space-between; /* Space children evenly */
   margin: 0px;
   padding: 0px;
   overflow: auto;
  }

</style>