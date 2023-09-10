<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal">
        <p id="heading-create"> <b> Members List </b> </p><br>
        
        <div class="members-list">
            <ul v-for="(member,index) in membersList" :key="index">
                <li class="members-name-list">
                    <p><span id="member-name">{{getTagSymbol(member.email, member.hasJoined)}}&nbsp;&nbsp;{{member.email}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id="member-balance"> <b>₹ {{getBalanceOfMember(index)}} </b></span> </p>
               </li>
               
            </ul>
        </div>
    </div>
    <div class="close" @click="$emit('close-modal')">
      <img class="close-img" src="../../assets/cancel_btn.png" alt="" />
    </div>
    <Notifications position="top right"/>
  </div>
</template>

<script>
export default {
    name: "MembersListModal",
    data() {
        return {
            membersList: []
        }
    },

    created() {
        this.callWhileCreated();
    },

    methods: {

        callWhileCreated() {
            const poolDetails = JSON.parse(localStorage.getItem("poolData"))
            this.membersList = poolDetails.currentPool.membersList;
        },

        getBalanceOfMember(idx) {
            const poolDetails = JSON.parse(localStorage.getItem("poolData"))
            this.membersList = poolDetails.currentPool.membersList;
            return this.membersList[idx].balance;
        },

        getTagSymbol(email, hasJoined) {
            const poolDetails = JSON.parse(localStorage.getItem("poolData"))
            if(poolDetails.currentPool.creatorEmail == email) {
                return "👨🏻‍💼";
            } else if(hasJoined) {
                return "✅";
            } else {
                return "⏳";
            }
        }
    }
}
</script>

<style scoped>

#member-balance {
    color: darkblue;
    text-align: right;
}

.members-name-list {
    border-bottom: 1px solid black;
}

.members-list {
    text-align: left;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

}

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
  height: 70%;
  width: 650px;
  margin-top: 10%;
  padding: 20px;
  border-radius: 5px;
  overflow: auto;
  background-image:url("../../assets/bank_img.jpg");
  background-attachment: fixed;
  background-size: fill;
  overflow: auto;
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