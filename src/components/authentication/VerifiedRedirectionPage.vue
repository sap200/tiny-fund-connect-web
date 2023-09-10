<template>
    <div id="container">
    <div class="box-1">
        <img src="../../assets/green_tick.jpg" id="green-tick"/>
    </div>
        <div id="verified-text" class="box-1"> 
            Congratulations, your email has been successfully verified! 🎉

We are thrilled to confirm that your email address has been officially verified and linked to your account. This verification step is an essential part of ensuring the security and integrity 
        </div> 
    </div>
</template>

<script>

export default {
    name: "VerifiedRedirectionPage"
}
</script>

<style scoped>

   #container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh; /* Adjust this to control the container's height */

   }

    #verified-text {
        color: green;
        font-size: 18px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
    }

    #green-tick {
        width: 50px;
        height: 50px;
    }

    .box1 {
          width: 200px; /* Adjust the width as needed */
            height: 100px; /* Adjust the height as needed */
            background-color: lightgray;
            text-align: center;
            line-height: 100px; /* Vertically center text */
            margin: 10px; /* Add margin between the divs */
    }

</style>
