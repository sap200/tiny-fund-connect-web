<!-- Modal.vue -->
<template>
  <div id="logo"> <img src="../../assets/logo.png" id="nl-img" /> <img id="logo-image" src="../../assets/tiny_logo.jpeg" /> </div>
  <div id="parent-menu">
    <Button @click="goToDashboard" id="dashboard"><label id="text-logout"><b>Dashboard</b></label>  </Button>
    <Button id="deposit" @click="renderDeposits"> <label id="text-logout"><b>Deposits</b></label> </Button>
    <Button id="withdrawl" @click="renderWithdrawls"> <label id="text-logout"><b>Withdrawls</b></label> </Button>
    <Button id="logout" @click="doLogout"> <label id="text-logout"><b>Logout</b></label> </Button>


  </div>
</template>

<script>
import {HOST} from '../../../secret.js'
export default {
  name: "Menu",

  methods: {
    created() {
      // call the get all pools api by email

    },

    async doLogout() {
       console.log("Logout")
      const apiPath = HOST + "/logout" // Replace with your API endpoint URL
      //get token from lcoalstorage
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


      const payload = {
        "activeToken": token,
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
          // Add any other headers you may need
        },
        body: JSON.stringify(payload), // Convert the data to JSON string
      };

      try {
         const response = await fetch(apiPath, requestOptions);

          const responseData = await response.json(); // Parse the response as JSON


          if (!response.ok) {
            console.log(responseData)
          }

          if(responseData.code == "LOGOUT000") {
            console.log("Logout success")
            localStorage.clear()
            this.$router.replace("/login_email_password_view")
            window.history.replaceState({}, '', '/login_email_password_view');

          }

          // Handle the response data here
        console.log(responseData);
      } catch(error) {
        console.log(error);
      }







    },
    goToDashboard() {
      console.log("Dashboard")
      console.log("Current Path", this.$route.path)
      const currentPath = this.$route.path;
      const dashboardPath = "/pool_view_page"
      if(currentPath != dashboardPath) {
        this.$router.push(dashboardPath)
        return;
      }

      console.log("Both paths are equal")
    },

    renderDeposits() {
      console.log("Dashboard")
      console.log("Current Path", this.$route.path)
      const currentPath = this.$route.path;
      const depositPath = "/deposit_list_view"
      if(currentPath != depositPath) {
        this.$router.push(depositPath)
        return;
      }

      console.log("Both paths are equal")
    },

    renderWithdrawls() {
        console.log("Dashboard")
      console.log("Current Path", this.$route.path)
      const currentPath = this.$route.path;
      const withdrawlPath = "/withdrawl_list_view"
      if(currentPath != withdrawlPath) {
        this.$router.push(withdrawlPath)
        return;
      }

      console.log("Both paths are equal")
    }
 
  }
};
</script>

<style scoped>

#nl-img {
  width: 25px;
  height: 25px;
}

#logo {
  background-color: black;
  border-bottom: 2px solid yellowgreen;
  color: white;
  padding: 10px;
}

#logo-image {
  height: 30px;
}

#deposit:hover, #withdrawl:hover, #dashboard:hover {
    margin-right: 15px;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, skyblue, pink, skyblue);
    border: 0px;
    cursor: pointer;
    box-shadow: 0px 2px 1px pink;
}

#deposit, #withdrawl, #dashboard {
    margin-right: 15px;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    border: 0px;
    padding: 4px;
    cursor: pointer;
}

#text-logout {
    font-family: cursive;
    font-style: bold;

}

  #parent-menu{
    background-color: black;
    padding: 10px;
    text-align: right;
    height: 32px;
  }

  #logout {
    margin-right: 15px;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, pink, skyblue, pink);
    border: 0px;
    cursor: pointer;
  }

    #logout:hover {
    margin-right: 15px;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-image: linear-gradient(to right, skyblue, pink, skyblue);
    border: 0px;
    cursor: pointer;
    box-shadow: 0px 2px 1px pink;
  }

</style>
