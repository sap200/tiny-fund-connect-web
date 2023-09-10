<template>
    <div id="container">
        <!-- Left pane consisting of Login form -->
        <div id="left-pane">
            <div id="signup-form">
                 <img id="tiny_fund_logo" src="../../assets/tiny_fund_logo.png"/>
                 <p id="signup-heading">Signup Form</p>
                <p id="verify-text"> 
                    Hi <span id="email"> <b> {{$store.state.firstName}} </b></span>,<br><br>
                    <i>We're excited to have you on board! To complete your registration and unlock all the benefits of our platform, please check your email at <span id="email"> <b> {{$store.state.email}} </b></span> for a verification link.
                    Once you've found the email from us, simply click the <b>"Verify"</b> button or link provided. This step is essential to ensure the security of your account and to help us keep you updated with the latest information and features.
                    If you haven't received the email, please check your spam or junk folder just in case it ended up there. If you still can't find it, you can request a new verification email from your account settings.</i><br><br>
                    <b>Thank you for choosing us, and welcome to our community!</b><br><br>
                    
                    Best regards,<br>
                    Tiny Fund Connect
                </p><br>
                <Button id="check-verification" @click="checkIfEmailIsVerified" :disabled="checkButtonDisabled"> Verification Done </Button><br><br>
                <p id="resend-verification"> <a href="#" @click.prevent="resendEmailVerification" :disabled="resendButtonDisabled">Click here </a> to resend the verification mail if you haven't received it.</p><br>

                <p id="error-message"> <b> {{errorMessage}} </b></p>
            </div>
        </div>

    <!-- Right pane consisting of an image that fills -->
        <div id="right-pane">
        </div>
    <notifications position="bottom right"/>

    </div>
</template>

<script>
import  {HOST} from '../../../secret.js'


export default {
    name: "EmailVerificationPending",
    data() {
        return {
            errorMessage: "",
            checkButtonDisabled: false,
            resendButtonDisabled: false,

        }
    },

    methods: {
        async checkIfEmailIsVerified() {
            this.checkButtonDisabled = true;
            this.errorMessage = ""
            // call the api
            let apiPath = HOST + "/check/emailverified"
            // get the response
            let payload = {
                    "email": localStorage.getItem("email"),
                    "flowId": localStorage.getItem("flowId"),
                    "ip": localStorage.getItem("ip"),
                }

            console.log(payload)

            // make a post call
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

                console.log(responseData)

                if (!response.ok) {
                    this.checkButtonDisabled = false;
                    this.errorMessage = responseData.message;
                    return;
                }

                if(responseData.isVerified == true) {
                    this.checkButtonDisabled = false;
                    console.log(responseData)
                    // email is verified move to next page that is mfa verification.
                    this.$notify("Email Verified!")
                    this.$router.push('/email_otp_input_page_view');

                } else {
                    this.checkButtonDisabled = false;
                    this.errorMessage = "Email Verification pending"
                    return;

                }

            } catch(error) {
                this.checkButtonDisabled = false;
                this.errorMessage = error;
                console.log(error)
            }

            // if email verification pending set the error message

            // else push the router state 
        },

        async resendEmailVerification() {
            this.errorMessage = ""
            console.log("I am here")
            // make an api call to resend verification code
            let apiPath = HOST+"/emailverification/resend"

            let payload = {
                    "email": localStorage.getItem("email"),
                    "flowId": localStorage.getItem("flowId"),
                    "ip": localStorage.getItem("ip"),
            }

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

                if (!response.ok) {
                    this.errorMessage = responseData.message;
                    return;
                }

                console.log("Verification sent successfully")
                this.$notify("Verification mail sent")





            } catch (error) {
                this.errorMessage = error;
                console.log(error)
            }



        }
    }
}
</script>

<style scoped>

    #resend-verification {
        font-family: 'Arial', sans-serif; /* Change the font-family */
        margin-top: 1px;
        color: black;
        font-size: 16px;
        display: block; /* Display labels as block elements */
        text-align: left; /* Align text to the left */
        margin-bottom: 0px;
    }

    #container {
        font-family: 'Arial', sans-serif; /* Change the font-family */
    }

    #error-message{
        color: red;
        font-family: 'Arial', sans-serif; /* Change the font-family */
    }

    #email {
        color: blueviolet;
        font-family: 'Arial', sans-serif; /* Change the font-family */
        font-size: 16px

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
        display: block; /* Display labels as block elements */
        text-align: left; /* Align text to the left */
        margin-bottom: 0px;
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
        background-image: url("../../assets/side_image.jpg");
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

    #check-verification {
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

   #check-verification:hover {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
  }
   #check-verification:active {
    background-image: linear-gradient(to left, pink, skyblue, aliceblue);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  }


</style>
