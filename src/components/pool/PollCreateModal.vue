<template>
  <div class="modal-overlay">
    <div class="modal">
        <p id="heading-create"> <b> Create Poll Form </b> </p>
        <form id="create-pool-form" @submit.prevent>
            <label class="modal-texts p-name"> <b> Message</b></label>
            <input type="text" class="rm-shad p-shad" v-model="message"><br><br>
            <label class="modal-texts"> <b>Options</b> </label>
            <img class="add-btn" src="../../assets/add_btn.png" @click="addMember"/> <br>
            <ol>
                <li id="members-list" v-for="(member,index) in membersList" :key="index">
                    <label class="modal-texts l-name"> Option - {{index+1}} </label>
                    <input type="text" class="l-inp rm-shad l-shad" v-model="membersList[index]"/>
                    <img src="../../assets/del_btn.png" class="sub-btn" @click="delMember(index)"/>
                </li>

            </ol>
            <div id="sbtn-div">
            <Button class="submit-btn" :disabled="shouldDisableCreateBtn" @click="createPoll"> <b>Create</b> </Button>
            </div>
        </form>
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
      name: "PollCreateModal",

      data() {
          return{
              membersList: [""],
              message: ""
          }
      },

      computed: {
          shouldDisableCreateBtn() {
              let isAtleastOneElementEmpty = false;
              for(let i = 0; i < this.membersList.length; i++) {
                  if(this.membersList[i] == "") {
                      isAtleastOneElementEmpty = true;
                      break;
                  }
              }

              return isAtleastOneElementEmpty || this.message == ""
          }
      },

      methods: {

          addMember() {
              this.membersList.push("")
          },
          delMember(n) {
              if (this.membersList.length > 1) {
                this.membersList.splice(n, 1)
              }
          },
          async createPoll() {
              this.$store.isPollApiHit = true;
              let myPollMessage = this.message;
              let myOptionList =  this.membersList;
              this.message = ""
              this.membersList = [""]

              const apiPath = HOST + "/poll/create"

              const poolData = JSON.parse(localStorage.getItem("poolData"));
              const poolId = poolData.currentPool.poolId;

              let payload = {
                "poolId": poolId,
                "message": myPollMessage,
                "pollCreatorEmail": localStorage.getItem("email"),
                "options": myOptionList,
              }

              const loginResp = JSON.parse(localStorage.getItem("loginResponse"));
              const token = loginResp.activeToken;

               const headers = {
                  'token': token, // Replace with your authentication header
                  'Content-Type': 'application/json', // Set the content type to JSON
                  // You can add more headers as needed
                };

                try {

                  const response = await fetch(apiPath, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(payload) // Convert the payload to JSON format
                    });

                    const data = await response.json();

                    if (!response.ok) {
                       console.log(data);
                       return;
                    }

                  this.$notify("Poll Created successfully with id", data.pollId);

                } catch(error) {
                  console.log(error)
                }



          }
      }
    }
</script>

<style scoped>
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
    width: 80%;
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
    margin-right: 10px;
}

#heading-create {
    font-size: 30px;
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
  height: 70%;
  width: 600px;
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