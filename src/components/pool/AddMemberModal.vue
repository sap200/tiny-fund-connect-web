<template>
  <div class="modal-overlay">
    <div class="modal">
        <p id="heading-create"> <b> Add Member </b> </p>
        <form id="create-pool-form" @submit.prevent>
            <label class="modal-texts p-name"> <b> Member's Email</b></label><br><br>
            <input type="text" class="rm-shad p-shad" v-model="membersEmail"><br><br>
            <div id="sbtn-div">
            <Button class="submit-btn" :disabled="shouldDisableCreateBtn" @click="addMemberToPool"> <b>Add</b> </Button>
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
      name: "AddMemberModal",

      data() {
          return{
              membersEmail: ""
          }
      },

      computed: {
          shouldDisableCreateBtn() {
              return this.membersEmail == ""
          }
      },

      methods: {
        async addMemberToPool() {
          console.log(this.membersEmail);
          const poolData = JSON.parse(localStorage.getItem("poolData"));
          const poolId = poolData.currentPool.poolId

          const loginResp = JSON.parse(localStorage.getItem("loginResponse"));
          const token = loginResp.activeToken;

          const headers = {
            "token": token,
          }

          const payload = {
                "poolId": poolId,
                "oneMember": {
                    "email": this.membersEmail,
                }
            }

            const myEmail = this.membersEmail;

            this.membersEmail = "";

            const apiPath = HOST + "/pool/addmember";

            try {
                  const response = await fetch(apiPath, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(payload) // Convert the payload to JSON format
                  });

                  const data = await response.json();

                  if(!response.ok) {
                    this.$notify(data.message);
                    console.log(data)
                    return;
                  }

                    let cp = {
                        currentPool: data,
                        isActive: poolData.isActive,
                        isButtonDisabled: poolData.isButtonDisabled,
                    }

                    localStorage.setItem("poolData", JSON.stringify(cp))

                  this.$notify("Request has been sent to Member with email " +  myEmail)
                  console.log(data)

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
  height: 25%;
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