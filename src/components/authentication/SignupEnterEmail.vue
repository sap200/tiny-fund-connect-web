<template>
    <div id="container">
        <!-- Left pane consisting of Login form -->
        <div id="left-pane">
            <div id="signup-form">
                 <img id="tiny_fund_logo" src="../../assets/tiny_fund_logo.png"/>
                 <p id="signup-heading">Signup Form</p>
                <p id="verify-text"> <i><b> Verify your email address to signup </b></i> </p><br>
                <form id="signup-form-1" @submit.prevent>
                    <label id="first_name"> <b> First name </b> </label>
                    <input type="text" required  v-model="firstName"/><br><br><br>
                    <label id="last_name"> <b> Last name </b> </label>
                    <input type="text" required v-model="lastName"/><br><br><br>
                    <label id="email"> <b>Email</b> </label>
                    <input type="text" required v-model="emailId"/><br><br><br>
                    <label id="password"> <b>Password</b> </label>
                    <input type="password" required v-model="passworda"/><br><br><br>
                    <label id="password"> <b>Re-enter Password</b> </label>
                    <input type="password" required v-model="passwordb"/><br><br><br>
                    <Button id="verify-button" @click="callSignupStartApi"  :disabled="!areAllInputsGiven"> Register </Button>
                </form>
                <p id="login-text"> Already have an account <a href="#/login_email_password_view"> login </a></p>
                <p id="error-message"> <i>{{errorMessage}}</i> </p>

            </div>
        </div>

    <!-- Right pane consisting of an image that fills -->
        <div id="right-pane">
        </div>
    </div>
</template>

<script>
import  {HOST} from '../../../secret.js'
export default {
    name: 'SignupEnterEmail',
    data() {
        return {
            errorMessage: "",
            firstName: "",
            lastName: "",
            emailId: "",
            passworda: "",
            passwordb: "",
        }
    },

    computed: {
        areAllInputsGiven() {
            return this.firstName.trim() !== '' && this.lastName.trim() !== '' && this.emailId.trim() !== '' && this.passworda.trim() !== '' && this.passwordb !== ''
        }
    },

    methods: {
        async callSignupStartApi() {
            this.errorMessage = ""
            console.log(this.firstName)
            console.log(this.lastName)
            console.log(this.emailId)
            console.log(this.passworda)
            console.log(this.passwordb)
            let myFirstName = this.firstName
            this.firstName = ''
            let myLastName = this.lastName
            this.lastName = ''
            let myEmailId = this.emailId
            this.emailId = ''
            let myPassword1 = this.passworda
            this.passworda = ''
            let myPassword2 = this.passwordb
            this.passwordb = ''

            console.log(myFirstName, myLastName, myEmailId, myPassword1, myPassword2)

            if (myPassword1 !== myPassword2) {
                this.errorMessage = "Password you entered doesn't match"
                return
            }

            // make a call to api
            // if status is not 200 return error if success
            let apiPath = HOST + "/signup"
            console.log(apiPath)
            let publicIp = await this.getPublicIp()
            console.log("Public ip, "+ publicIp)

            let payload = {
                "email": myEmailId,
                "password": myPassword1,
                "firstName":myFirstName,
                "lastName": myLastName,
                "ip": publicIp,
            }

            console.log(payload)

            try {
                const response = await fetch(apiPath, {
                    method: 'POST', // Specify the HTTP method as POST
                    headers: {
                        'Content-Type': 'application/json', // Set the content type to JSON
                        // Add any other headers if needed
                    },
                    body: JSON.stringify(payload), // Convert the data object to JSON
                });

                // Parse the response as JSON and await it
                const responseData = await response.json();


                if (!response.ok) {
                    this.errorMessage = responseData.message
                    return
                }
                // set 4 vuex states
                console.log(responseData)
                // set vue state
                this.$store.state.firstName = myFirstName;
                this.$store.state.lastName = myLastName;
                this.$store.state.email = myEmailId;
                this.$store.state.flowId = responseData.flowId;
                this.$store.state.customerId = responseData.customerId;
                this.$store.state.ip = publicIp;
                //additionally set local storage 
                localStorage.setItem("firstName", myFirstName);
                localStorage.setItem("lastName", myLastName);
                localStorage.setItem("email", myEmailId);
                localStorage.setItem("customerId", responseData.customerId);
                localStorage.setItem("flowId", responseData.flowId);
                localStorage.setItem("ip", publicIp);

                console.log(this.$store.state)

                // redirect to email verification page
                this.$router.push('/email_verification_pending_view');

            } catch (error) {
                this.errorMessage = error
                console.error(error)
            }
            // set vuex state, so the flow can be carried on further
        },

        async  getPublicIp() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');

                if (!response.ok) {
                 this.errorMessage = "unable to fetch ip"
                 return
                }

                const data = await response.json();

                // Access the public IP address from the response
                const publicIp = data.ip;
            
                return publicIp
            } catch (error) {
                console.error('There was a problem getting your public IP address:', error);
                return ""
            }
         },
    }

};
</script>


<style scoped>


    #error-message{
        color: red;
        font-family: 'Arial', sans-serif; /* Change the font-family */
        font-size: 11px;
        display: block; /* Display labels as block elements */
        text-align: left; /* Align text to the left */
        margin-bottom: 0px;
    }

    #container {
        font-family: 'Arial', sans-serif; /* Change the font-family */
    }

    #tiny_fund_logo {
        width: 100%;
        height: 57px;

    }

    #login-text {
        font-family: 'Arial', sans-serif; /* Change the font-family */
        font-size: 14px;
        color: black;
    }

    #signup-heading {
            font-family: 'Arial', sans-serif; /* Change the font-family */
            background-image: linear-gradient(to right, #007bff, #ff4500); /* Gradient background */
            -webkit-background-clip: text; /* Clip text to the gradient background */
            color: transparent; /* Make the text transparent */
            font-size: 28px; /* Adjust the font size */
            text-align: center; /* Center the heading text */
    }

    #verify-text {
        font-family: 'Arial', sans-serif; /* Change the font-family */
        margin-top: 1px;
        color: black;
        font-size: 16px;
    }

    #signup-form {
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        height: 750px;
        margin-right: 15px;
        margin-left: 15px;
        width: 500px;
        border-radius: 5px;
        padding: 40px;
    }

    #left-pane {
        float: left;
        width: 40%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #right-pane {
        float: right;
        width: 60%;
        height: 100vh;
        background-image:  url("../../assets/side_image.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left center;
        margin-bottom: 15px;
        margin-top: 15px;
        border-radius: 5px;
    }

    #right-pane-image{
        max-height: 100%;
        max-width: 100%;
        height: 100%;
        width: 100%;
        object-fit: contain;
    }

    label {
        display: block; /* Display labels as block elements */
        text-align: left; /* Align text to the left */
        margin-bottom: 0px;
        color:midnightblue;
    }
    
    input[type="text"] {
            width: 100%; /* Make text inputs fill the width of the form */
            height: 15px;
            border: none; /* Remove the default border */
            border-bottom: 1px solid #000; /* Add a bottom border */
            outline: none; /* Remove the default outline */
            padding: 5px 0; /* Add padding to the bottom of the input */
    }

    input[type="password"] {
            width: 100%; /* Make text inputs fill the width of the form */
            height: 15px;
            border: none; /* Remove the default border */
            border-bottom: 1px solid #000; /* Add a bottom border */
            outline: none; /* Remove the default outline */
            padding: 5px 0; /* Add padding to the bottom of the input */
    }

    #verify-button {
            margin-top: auto; /* Push the button to the bottom */
            width: 150px; /* Adjust width to include 2px margin on each side */
            margin-top: 20px; /* Margin on all sides */
            height: 40px;
            border-radius: 20px;
            cursor: pointer;
            background-image: linear-gradient(to right, pink, skyblue, aliceblue);
            color: black;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            outline: none;
            border: none; /* Remove the default border */
            border-bottom: 1px solid aliceblue; /* Add a bottom border */
    }

   #verify-button:enabled:hover {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
  }
   #verify-button:enabled:active {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  }
    /* Styles for the button when it's enabled */
    #verify-button:enabled {
            margin-top: auto; /* Push the button to the bottom */
            width: 150px; /* Adjust width to include 2px margin on each side */
            margin-top: 20px; /* Margin on all sides */
            height: 40px;
            border-radius: 20px;
            cursor: pointer;
            background-image: linear-gradient(to right, pink, skyblue, aliceblue);
            color: black;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            outline: none;
            border: none; /* Remove the default border */
            border-bottom: 1px solid aliceblue; /* Add a bottom border */
    }

    /* Styles for the button when it's disabled */
        #verify-button:disabled {
        margin-top: auto; /* Push the button to the bottom */
        width: 150px; /* Adjust width to include 2px margin on each side */
        margin-top: 20px; /* Margin on all sides */
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        background-image: linear-gradient(to right, grey, rgb(170, 159, 159), rgb(85, 79, 79));
        color: black;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        outline: none;
        border: none; /* Remove the default border */
        border-bottom: 1px solid aliceblue; /* Add a bottom border */
    }
</style>