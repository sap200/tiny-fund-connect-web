<template>
    <div id="container">
        <!-- Left pane consisting of Login form -->
        <div id="left-pane">
            <div id="signup-form">
                 <img id="tiny_fund_logo" src="../../assets/tiny_fund_logo.png"/>
                 <p id="signup-heading">Signup Form</p>
                <p id="verify-text"> <i><b> Enter the otp sent on your mail </b></i> </p><br>
                <form id="signup-form-1" @submit.prevent>
                    <label id="otp"> <b>MFA Code</b> </label><br>
                    <input type="text" required v-model="otp"/><br><br>
                    <Button id="signup-button" @click="submitOtp" :disabled="isButtonDisabled"> Verify OTP </Button>
                </form>

                <p id="error-message"> <i>{{errorMessage}}</i> </p>
            </div>
        </div>

    <!-- Right pane consisting of an image that fills -->
        <div id="right-pane">
        </div>
        <notifications position="top left" />

    </div>
</template>

<script>
import  {HOST} from '../../../secret.js'

export default {
    name: 'EmailOtpInputPage',

    data() {
        return {
            errorMessage: "",
            otp: ""

        }
    },

    computed: {
        isButtonDisabled() {
            return this.otp == ""
        }
    },

    created() {
        let x = localStorage.getItem("mfaEnrolled")
        if (x == null || x!="done") {
            console.log("went inside");
            this.startMfaEnrollment();
            localStorage.setItem("mfaEnrolled", "done");
        }
    },

    methods: {
        async submitOtp() {
            this.errorMessage = ""
            // send request to an api path
            let apiPath = HOST + "/enrollmfa/verifyemailotp"    
            
            let payload = {
                "email": localStorage.getItem("email"),
                "flowId": localStorage.getItem("flowId"),
                "ip": localStorage.getItem("ip"),
                "code": this.otp.toString()
            }

            this.otp = ""

            try {
                const response = await fetch(apiPath, {
                    method: 'POST', // Specify the HTTP method as POST
                    headers: {
                        'Content-Type': 'application/json', // Set the content type to JSON
                        // Add any other headers if needed
                    },
                    body: JSON.stringify(payload), // Convert the data object to JSON
                });
            
            const responseData = await response.json();

            if(!response.ok) {
                this.$notify("Another OTP is being sent ! Please re-enter")
                this.errorMessage = responseData.message;
                return;
            }

            if(responseData.status == "SUCCESS") {
                console.log("Signup success")
                this.$router.push("/login_email_password_view")
            }

            } catch(error) {
                this.errorMessage = error;
                return;
            }

        },

        async startMfaEnrollment() {
            let apiPath = HOST + "/enrollmfa/emailotp"

                let payload = {
                   "email": localStorage.getItem("email"),
                   "flowId": localStorage.getItem("flowId"),
                   "ip": localStorage.getItem("ip"),
                }

            console.log(payload)
            // make a rest call
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

                if(!response.ok) {
                    this.errorMessage = responseData.message;
                    return;
                }

                // otp is sent to mail and now user should read mail
                this.$notify("Email with OTP is sent !")

            } catch (error) {
                this.errorMessage = error
                return
            }
        }
    }

};
</script>


<style scoped>

    #error-message {
        color: red;
        font-family: 'Arial', sans-serif; /* Change the font-family */
        font-size: 11px;
        display: block; /* Display labels as block elements */
        text-align: left; /* Align text to the left */
        margin-top: 30px;

    }

    #container {
        font-family: 'Arial', sans-serif; /* Change the font-family */
    }

    #tiny_fund_logo {
        width: 100%;
        height: 57px;

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

    #signup-button {
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

   #signup-button:hover {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
  }
   #signup-button:active {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  }

      /* Styles for the button when it's enabled */
    #signup-button:enabled {
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
        #signup-button:disabled {
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