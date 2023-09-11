<template>
    <div id="parent-member-container">
        <div id="heading"> <b>Members List</b> </div>

        <div id="table-view">
            <table>
                <thead>
                    <tr>
                        <th> SL. No </th>
                        <th> Role </th>
                        <th> Email</th>
                        <th> Balance </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in membersList" :key="index">
                        <td> <b>{{index+1}}</b></td>
                        <td> {{getTagSymbol(item.email, item.hasJoined)}} </td>
                        <td><b>{{item.email}}</b> </td>
                        <td><b> {{item.balance}}</b> </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

</template>

<script>
export default {
    name: "MembersListModal",
    components: {
    },

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

#table-view {
    margin-top: 20px;
    text-align: center;
}

#parent-member-container {
    background-image: url('../../assets/bank_img.jpg');
    width: 100%;
    overflow: auto;
    height: 100vh;
}

#heading {
    background-image:linear-gradient(to right, pink, skyblue, pink);
    height: 50px;
    font-family: cursive;
    display: flex;
   justify-content: center; /* Horizontally center content */
   align-items: center; /* Vertically center content */
   font-size: 24px;
   color: black;
}

 /* Style the table */
        table {
            border-collapse: collapse;
            width: 80%;
            max-width: 800px;
            background-color: rgb(255, 255, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
              margin: 0 auto; 
              font-family: cursive;
        }

        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            border: 1px solid black;
        }

        th {
            background-color: #333;
            color: white;
        }

        tr:hover {
            background-color: aliceblue;
            cursor: pointer;
        }




</style>