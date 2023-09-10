<template>
    <div id="trading-terminal">
        <Menu />
        <div id="trading-heading"> 
            Trading Terminal
        </div>
        <div id="balance-strip"> 
            <select name="cars" class="custom-select" v-if="listOfSymbols.length != 0" v-model="selectedOption" @change="handleOptionChange">
                <option :value="item" class="dropdown-content" v-for="(item, index) in listOfSymbols" :key="index">{{item}}</option>
            </select>
            <select name="opts" class="custom-select" v-model="frequency" @change="handleFrequencyChange">
                <option value="5m" class="dropdown-content" >5m</option>
                <option value="15m" class="dropdown-content" >15m</option>
                <option value="30m" class="dropdown-content" >30m</option>
                <option value="1h" class="dropdown-content" >1h</option>
                <option value="2h" class="dropdown-content" >2h</option>
                <option value="4h" class="dropdown-content" >4h</option>


            </select>
            <span class="p-id"> <b> {{getPoolName()}} </b> </span>
            <span class="p-id"> <b>{{getPoolId()}}</b> </span>
            <span id="p-amt"> <span id="bal-img">💰</span><span id="amnt"><b>₹ {{poolBalance}}</b></span> </span>
            <Button id="go-back" @click="goBack"> ⬅️ <b>Back</b> </Button>
        </div>

        <div id="trading-view-container">
            <div id="other-items" class="flex-container">
                <div id="candlestick-chart" class="flex-item" ref="chartContainer">

                </div>
                <div id="order-book" class="flex-item">
                        <p id="head-p">
                            <span class="left-span"><b>Price</b></span>
                            <span class="right-span"><b>Qty</b></span>
                        </p>
                        <p v-for="(item1, index1) in orderBid" :key="index1">
                            <span class="left-span">{{truncateFloat(item1.price, 6)}}</span>
                            <span class="right-span">{{truncateFloat(item1.qty, 6)}}</span>
                        </p>
                        <p id="head-ask">
                            <span class="left-span"><b>Price</b></span>
                            <span class="right-span"><b>Qty</b></span>
                        </p>
                        <p v-for="(item2, index2) in orderAsk" :key="index2">
                            <span class="left-span">{{truncateFloat(item2.price, 6)}}</span>
                            <span class="right-span">{{truncateFloat(item2.Qty, 6)}}</span>
                        </p>
                </div>
                <div id="action-item" class="flex-item">
                    <form id="create-limit-order" @submit.prevent>
                        <label> Quantity </label>
                        <input type="number" id="qty-inp" min="0" v-model="sideQuantity"/>
                        <label> Price (USD) </label>
                        <input type="number" id="price-inp" min="0" v-model="sidePrice"/>
                        <div id="action-btn-container">
                        <Button id="buy-limit-btn" @click="startBuySell('BUY')" :disabled="sidePrice <= 0 || sideQuantity <= 0"> Buy </Button>
                        <Button id="sell-limit-btn" @click="startBuySell('SELL')" :disabled="sidePrice <= 0 || sideQuantity <= 0"> Sell </Button>
                        </div>

                        <p id="form-error-pg" v-if="myOwnErrorMessage != ''"> {{myOwnErrorMessage}} </p>
                    </form>


                </div>
            </div>
            <div id="order-items">
                <div>
                    <Button id="pos-btn" @click="handlePositionHistory(1)" :class="{active: positionActive}"> Positions </Button>
                    <Button id="hst-btn" @click="handlePositionHistory(2)" :class="{active: historyActive}"> Order History </Button>
                </div>
                    <table v-if="historyActive">
                        <thead class="t-head-head">
                            <th>order-id</th>
                            <th>symbol</th>
                            <th>size</th>
                            <th>side</th>
                            <th>type</th>
                            <th>price</th>
                            <th>earned</th>
                            <th>status</th>
                            <th> time </th>
                        </thead>
                        <tbody v-if="poolOrders != null && poolOrders.length != 0">
                            <tr v-for="(item, index) in poolOrders" :key="index">
                                <td> {{item.orderId}} </td>
                                <td> {{item.symbol}} </td>
                                <td> {{truncateFloat(item.origQty,4)}} </td>
                                <td> {{item.side}} </td>
                                <td> {{item.type}} </td>
                                <td> {{truncateFloat(item.price, 4)}} </td>
                                <td :class="{ 'positive': item.totalEarned >= 0, 'negative': item.totalEarned < 0 }"> $ {{item.totalEarned == null ? 0 : truncateFloat(item.totalEarned, 4)}} </td>
                                <td> {{item.status}} </td>
                                <td> {{new Date(item.time)}} </td>
                            </tr>
                        </tbody>
                    </table>

                    <table v-if="positionActive">
                        <thead class="t-head-head">
                            <th>order-id</th>
                            <th>symbol</th>
                            <th>size</th>
                            <th>side</th>
                            <th>type</th>
                            <th>price</th>
                            <th>earned</th>
                            <th>status</th>
                            <th>Action</th>
                        </thead>

                        <tbody v-if="openOrders != null && openOrders.length != 0">
                            <tr v-for="(item, index) in openOrders" :key="index">
                                <td> {{item.orderId}} </td>
                                <td> {{item.symbol}} </td>
                                <td> {{truncateFloat(item.origQty,4)}} </td>
                                <td> {{item.side}} </td>
                                <td> {{item.type}} </td>
                                <td> {{truncateFloat(item.price, 4)}} </td>
                                <td :class="{ 'positive': item.profitComponent >= 0, 'negative': item.profitComponent < 0 }"> $ {{item.profitComponent}} </td>
                                <td> {{item.status}} </td>
                                <td><img src="../../assets/cancel_btn.png" id="cancel-button" @click="cancelOrderButton(index)"/></td>
                            </tr>
                        </tbody>
                    
                    </table>
            </div>
        </div>
        <Notifications  position="top right"/>
    </div>
</template>

<script>
import Menu from '../dashboard/Menu.vue'
import { createChart } from 'lightweight-charts';
import {HOST} from '../../../secret.js'
import checkToken from '../../utils';
export default {
    name: "TradingTerminal",

    components: {
        Menu,
    },

    data() {
        return {
            chart: null,
            candlestickSeries: null,
            listOfSymbols: [],
            intervalId: null,
            selectedOption: 'BNBUSDT',
            frequency: '15m',
            orderBid: [],
            orderAsk: [],
            orderBookInterval: null,
            historyActive: true,
            positionActive: false,
            poolOrders: [],
            poolOrderInterval: null,
            poolBalance: 0,
            sidePrice: 0,
            sideQuantity: 0,
            myOwnErrorMessage: "",
            openOrders: [],
        }
    },

  mounted() {

      this.doWhileCreated();
    
  },

    methods: {

        async handlePositionHistory(idx) {
            if(idx == 1) {
                this.positionActive = true;
                this.historyActive = false;
                await this.fetchAllOpenOrders();
            } else if (idx == 2) {
                this.positionActive = false;
                this.historyActive = true;
                await this.fetchAllOrderByPoolId()
            }

            console.log(idx)
            console.log(this.positionActive);
            console.log(this.historyActive);
        },

        truncateFloat(number, decimalPlaces) {
            return parseFloat(number).toFixed(decimalPlaces);
        },

        async doWhileCreated() {

                let res =  await checkToken(HOST)
                console.log("Result here", res)
                if(!res) {
                    localStorage.clear()
                    this.$router.replace("/login_email_password_view")
                    window.history.replaceState({}, '', '/login_email_password_view');
                }
                

                await this.getUpdatedPool();


                this.poolBalance = this.getPoolBalance();

                await this.getSymbols()
                console.log(this.listOfSymbols);
                await this.createCandlestickChart();
                // Fetch live data every 5 seconds
            this.intervalId = setInterval(async () => {
                                    await this.updateChartData();
                               }, 15000);

                console.log(this.intervalId);


            await this.getOrderBook()
            this.orderBookInterval = setInterval(async () => {
                await this.getOrderBook()
            }, 15000)

            await this.fetchAllOrderByPoolId();

            await this.fetchAllOpenOrders()
            setInterval(async ()=> {
                for(let i = 0; i < this.openOrders.length; i++) {
                    this.openOrders[i].profitComponent = this.getRandomNumber((this.openOrders[i].price*this.openOrders[i].origQty)/10.0) 
                }
            }, 5000);


        },
        
        getRandomNumber(price) {
            let min = -price;
            let max = price;
            const decimalPlaces = 2; // Adjust the number of decimal places as needed
            const multiplier = 10 ** decimalPlaces;
            min = Math.ceil(min * multiplier);
            max = Math.floor(max * multiplier);
            const randomDecimal = Math.floor(Math.random() * (max - min + 1)) + min;
            return randomDecimal / multiplier;
        },

        async createCandlestickChart() {
            const chartOptions = { 
                layout: { 
                    textColor: 'white', 
                    background: { 
                        type: 'solid', 
                        color: 'black' 
                    } 
                },
                grid: {
                        vertLines: {
                            color: 'rgba(255,255,255,0.1)', // Make vertical grid lines transparent
                        },
                        horzLines: {
                            color: 'rgba(255,255,255,0.1)', // Make horizontal grid lines transparent
                        },
                },
                priceScale: {
                    mode: 1, // Use PriceScaleMode.Percentage for automatic scaling
                    autoScale: true,
                    position: 'right',
                },
                timeScale: {
                     rightOffset: 12, // Adjust the right offset for time scale
                     autoScale: true, 
                     timeVisible: true,
                     secondsVisible: true, // Display seconds (optional)
                     secondsInMinute: 15,
                },
                crosshair: {
                mode: 2, // Display the tooltip on hover
                },

            };
            const chartContainer = this.$refs.chartContainer;
            this.chart = createChart(chartContainer, chartOptions);
            
            // Create a candlestick series
            this.candlestickSeries = this.chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350', wickWidth: 2, borderWidth: 2 });

            // Customize the chart and series configuration as needed
            // For example, you can set the color scheme, time zone, etc.
            // this.chart.applyOptions({ /* options */ })
            // Subscribe to crosshair movement

            // Fetch and add initial data
            await this.updateChartData();
        },

        async updateChartData() {
            console.log(this.selectedOption);
            // Fetch live data using an API (e.g., Axios or Fetch)
            // For demonstration purposes, we'll use random data
            const newData = await this.getAndSetDataItem();
            
            // Add the new data to the candlestick series
            // Clear the existing data
            this.candlestickSeries.setData([]);

            // Add the new data to the candlestick series
            this.candlestickSeries.setData(newData);
        },

      async getAndSetDataItem() {
          let chartData = []



            const apiPath = HOST + "/candle/data"
            const params = {
              symbol: this.selectedOption,
              interval: this.frequency,
              limit: 10000,
            };

              const queryParams = new URLSearchParams(params);
              const apiUrl = apiPath + `?${queryParams.toString()}`;

              console.log(apiUrl)

            try {
              const response = await fetch(apiUrl);
              const data = await response.json();
              if (!response.ok) {
                console.log(data);
                return;
              }


              for(let i = 0; i < data.length; i++) {
                let dp1 = {
                  open: data[i].openPrice, 
                  high: data[i].highPrice, 
                  low: data[i].lowPrice, 
                  close: data[i].closePrice,
                  time: data[i].closeTime/1000,
                }

                chartData.push(dp1)
              }


                console.log(chartData);
                return chartData;


 
            } catch(error) {
              console.log(error)
            }
      },


      async getSymbols() {

            try {
                // Define the URL you want to make a GET request to
                const url = HOST + '/symbols/get';

                // Send the GET request and await the response
                const response = await fetch(url);

                const data = await response.json(); // Use response.text() for plain text

                // Check if the response status is in the range of 200-299 (successful)
                if (!response.ok) {
                    console.log(data);
                    return;
                }

                this.listOfSymbols = data;
            } catch (error) {
                console.error(error);
            }
      },

      async handleOptionChange() {
          this.myOwnErrorMessage = ""
           console.log(this.selectedOption);
           console.log("I am creating new chart")
            // Fetch live data every 5 seconds
            console.log("I have created new chart")
            await this.updateChartData();
            await this.getOrderBook()
            await this.fetchAllOrderByPoolId();

      },

      async handleFrequencyChange() {
           console.log("Frequency change", this.frequency)
            // Fetch live data every 5 seconds
            await this.updateChartData();
      },

      async getOrderBook() {
            try {

                const params = {
                    symbol: this.selectedOption,
                    limit: 5,
                };

                const queryParams = new URLSearchParams(params);
                // Define the URL you want to make a GET request to
                const url = HOST + '/orderbook/get?' +  queryParams.toString();

                console.log(url)

                // Send the GET request and await the response
                const response = await fetch(url);

                const data = await response.json(); // Use response.text() for plain text

                // Check if the response status is in the range of 200-299 (successful)
                if (!response.ok) {
                    console.log(data);
                    return
                }

                this.orderBid = data.bids
                this.orderAsk = data.asks
            } catch (error) {
                console.error(error);
            }
      },

      async fetchAllOrderByPoolId() {
          try {

              const poolData = JSON.parse(localStorage.getItem("poolData"));
              const poolId = poolData.currentPool.poolId;

              const params = {
                  symbol: this.selectedOption,
                  poolId: poolId,
              }

              const queryParams = new URLSearchParams(params);
               // Define the URL you want to make a GET request to
              const url = HOST + '/orders/getbypoolid?' +  queryParams.toString();


                // Send the GET request and await the response
              const response = await fetch(url);

              const data = await response.json(); // Use response.text() for plain text

                // Check if the response status is in the range of 200-299 (successful)
                if(!response.ok) {
                    console.log(data);
                    return;
                }

                console.log(data);

                this.poolOrders = []

                for(let i = data.length-1; i >= 0; i--) {
                    if(data[i].status != "NEW") {
                        if(data[i].status == "CANCELED") {
                            data[i].status = "CLOSED"
                        }
                        this.poolOrders.push(data[i])
                    } else {
                        console.log(data[i].status);
                    }
                }
            
          } catch(error) {
              console.log(error)
          }
      },

      getPoolId() {
          const poolDetails = JSON.parse(localStorage.getItem("poolData"));
          const poolId = poolDetails.currentPool.poolId;
          return poolId;
      },

      getPoolBalance() {
          const poolBalance = JSON.parse(localStorage.getItem("poolData"));
          const bal = poolBalance.currentPool.poolBalance;
          return bal;

      },

      getPoolName() {
          const poolBalance = JSON.parse(localStorage.getItem("poolData"));
          const bal = poolBalance.currentPool.poolName;
          return bal;
      },

      async startBuySell(side) {
          console.log(side, this.sideQuantity, this.sidePrice);
          this.myOwnErrorMessage = ""

          const myEmail = localStorage.getItem("email");
          const poolDetails = JSON.parse(localStorage.getItem("poolData"));
          const poolId = poolDetails.currentPool.poolId;

          const myQty = this.sideQuantity;
          const myPrice = (this.sidePrice).toFixed(2);

          const poolBalanceInDollar = (poolDetails.currentPool.poolBalance / 83.12).toFixed(2);

          

          if(this.sidePrice > poolBalanceInDollar) {
              this.$notify("Insufficient fund");
              this.myOwnErrorMessage = "Insufficient fund";
              return;
          }

          this.sideQuantity = 0;
          this.sidePrice = 0;

          const params = {
              symbol: this.selectedOption,
              poolId: poolId,
              email: myEmail,
              side: side,
              quantity: myQty,
              price: myPrice,
          }

          const apiPath = HOST + "/orders/create"
          // Create a URL with query parameters
          const url = new URL(apiPath);
          Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
           });

           try {
                 const response = await fetch(url, {method: 'POST'});

                 const data = await response.json();
                 if (!response.ok) {
                     console.log(data)
                     this.myOwnErrorMessage = data.message;
                     this.$notify(data.message);
                     return;
                 }

                 this.$notify("order placed successfully");
                 let myPoolDetails = JSON.parse(localStorage.getItem("poolData"))
                 myPoolDetails.currentPool.poolBalance -= myPrice*83.12
                 localStorage.setItem("poolData", JSON.stringify(myPoolDetails))

                 this.poolBalance -= myPrice*83.12
                


           } catch(error) {
               console.log(error)
           }
      },

      async fetchAllOpenOrders() {

          const poolDetails = JSON.parse(localStorage.getItem("poolData"))
          const poolId = poolDetails.currentPool.poolId;

          const params = {
              poolId: poolId,
              symbol: this.selectedOption,
          }

          const apiPath = HOST + "/orders/getopenordersbypoolid"

            // Create a URL with query parameters
          const url = new URL(apiPath);
          Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
            });

          try {
              const response = await fetch(url);
              const data = await response.json();

              if(!response.ok) {
                  this.myOwnErrorMessage = data.message;
                  this.$notify(data.message);
                  return;
              }

              this.openOrders = data;
            for(let i = 0; i < this.openOrders.length; i++) {
                this.openOrders[i].profitComponent =  this.getRandomNumber(this.openOrders[i].price) 
            }

          } catch (error) {
              console.log(error);
          }
      },

      async cancelOrderButton(index) {
          console.log(this.openOrders[index])
          let myOrder = this.openOrders[index];
          this.openOrders.splice(index, 1); 

          const poolDetails = JSON.parse(localStorage.getItem("poolData"));
          const poolId = poolDetails.currentPool.poolId;

          const myEmail = localStorage.getItem("email");

          const params = {
              symbol: this.selectedOption,
              orderId: myOrder.orderId,
              poolId: poolId,
              email: myEmail,
              earned: myOrder.profitComponent,
          }

          console.log(params)

          const apiPath = HOST + "/orders/cancel";
          // Create a URL with query parameters
            const url = new URL(apiPath);
            Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
            });

            try {

                const response = await fetch(url, {method: 'DELETE'});
                const data = await response.json();

                console.log(data);

                if (!response.ok) {
                    console.log(data);
                    this.$notify(data.message);
                    return;
                }

                this.$notify("Order closed successfully !!")

                // call the get updated pool after 5 secs...
                setTimeout(async () => {
                    await this.getUpdatedPool();
                }, 5000);

                // call the get updated pool after 10 secs... for safety...
                setTimeout(async () => {
                    await this.getUpdatedPool();
                }, 10000);


            } catch(error) {
                console.log(error)
            }
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

    goBack() {
        this.$router.push("/pool_description_view")
    }
    },
}
</script>

<style scoped>

#go-back {
    width: 100px;
    border: 0;
    border-radius: 5px;
    background-image: linear-gradient(to right, skyblue, pink, skyblue);
    cursor: pointer;
    margin-left: 10px;

}

#go-back:hover {
    box-shadow: 1px 2px 4px skyblue;
}

#cancel-button {
    cursor: pointer;
}

#cancel-button:hover {
    box-shadow: 1px 1px 5px white;

}

#form-error-pg {
    color: red;
    margin-top: 20px;
    text-align: center;
}

#buy-limit-btn {
    margin-right: 25px;
    border: 0;
    width: 90px;
    height: 40px;
    border-radius: 8px;
    background-image: linear-gradient(to right, green, darkgreen, green);
    color: white;
    font-family: cursive;
    cursor: pointer;
}

#sell-limit-btn {
    border: 0;
    width: 90px;
    height: 40px;
    border-radius: 8px;
    background-image: linear-gradient(to right, red, darkred, red);
    color: white;
    font-family: cursive;
    cursor: pointer;
}

#buy-limit-btn:enabled:hover {
    background-image: linear-gradient(to right, darkgreen, green, darkgreen);
    box-shadow: 1px 2px 5px yellowgreen;
}

#buy-limit-btn:disabled {
    background-image: linear-gradient(to right, gray, lightgray, gray);
}

#sell-limit-btn:disabled {
    background-image: linear-gradient(to right, gray, lightgray, gray);
}

#sell-limit-btn:enabled:hover {
    background-image: linear-gradient(to right, darkred, red, darkred);
    box-shadow: 1px 2px 5px violet;
}

#action-btn-container {
    text-align: center;
}

#qty-inp {
    margin-top: 15px;
    margin-bottom: 20px;
    width: 90%;
}

#price-inp {
    margin-top: 15px;
    margin-bottom: 30px;
    width: 90%;
}

.t-head-head {
    color: greenyellow;
    font-size: 13px;
}

tbody {
    font-size: 11px;
}


table {

  margin-top: 8px;
  border-collapse: collapse; /* Collapse table borders into a single border */
  width: 100%; /* Adjust the width as needed */
}

/* Style for table header (th) cells */
th {
  border: 1px solid skyblue; /* Border style, width, and color */
  padding: 8px; /* Padding for cell content */
  text-align: left; /* Adjust text alignment as needed */
}

/* Style for table data (td) cells */
td {
  border: 1px solid white; /* Border style, width, and color */
  padding: 8px; /* Padding for cell content */
  text-align: left; /* Adjust text alignment as needed */
}

td.positive {
    color: greenyellow;
}

td.negative {
    color: red;
}

#display-tbl {
  display: flex;
  flex-direction: column; /* Change from "row" to "column" */
}

#pos-btn {
    float: left;
    margin-right: 10px;
    border: 0;
    cursor: pointer;
    background-color: black;
    color: white;
    font-family: cursive;
}

#hst-btn {
    float: left;
    border: 0;
    cursor: pointer;
    background-color: black;
    color: white;
    font-family: cursive;
}

#hst-btn:hover {
    color: yellow;
}

#pos-btn:hover {
    color: yellow;
}

#pos-btn.active {
    color: yellow !important;
}

#hst-btn.active {
    color: yellow !important;
}


#head-ask {
    font-family: cursive;
    background-image: linear-gradient(to right, red, darkred, red);
    color: blue;
    box-shadow: 1px 1px 1px white; 
    font-size: 22px;
}

#head-p {
    font-family: cursive;
    background-image: linear-gradient(to right, lightgreen, green, lightgreen);
    color: blue;
    box-shadow: 1px 1px 1px white;
    font-size: 22px;

}

.left-span {
  float: left;
  margin-left: 10px;
}

.right-span {
  float: right;
  margin-right: 10px;
}

.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  display: none;
}

#drop-down {
    margin-right: 18px;
}

#trading-terminal {
    height: 100vh;
}

#bal-img {
    font-size: 20px;
}
#trading-heading {
    background-color: black;
    color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
    border-top: 2px solid violet
}

#balance-strip {
    justify-content: flex-end; /* Right-align elements */
    display: flex;
    background-image: linear-gradient(to right, rgb(69, 144, 174), rgb(113, 169, 218), rgb(69, 144, 174));
    padding: 5px;
}

.p-id {
    background-image: linear-gradient(to right, lightpink, skyblue, lightpink);
    border-radius: 5px;
    margin-right: 8px;
    padding: 10px;
    color: black;
    font-size: 14px;
    font-family: cursive;
}

#p-amt {
    color: black;
    margin-left: 10px;
    padding-right: 10px;
    font-family: cursive;
    font-size: 25px;
}
#amnt {
    font-size: 17px;
}

#trading-view-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.flex-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.flex-item {
    flex: 1;
}

#candlestick-chart {
    flex: 60%;
    background-color: black;
    color: white;
    border: 1px solid green;
}

#order-book {
    flex:15%; /* 15% */
    background-color: black;
    color: white;
    border: 1px solid green;
    display: flex;
    flex-direction: column; /* Stack paragraphs vertically */
}



#action-item {
    flex: 25%; /* 20% */
    background-color: black;
    color: white;
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    text-align: left;
}

#create-limit-order {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    font-family: cursive;
    margin-top: 20px;
}

#other-items {
    height: 70%;
}

#order-items {
    background-color: black;
    color: white;
    height: 30%;
    border: 1px solid green;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    text-align: left;
}


/* Style the container */
.custom-select {
  display: block;
  width: 180px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-image: linear-gradient(to right, lightpink, aliceblue, lightpink);
  margin-right: 18px;
  cursor: pointer;
  font-family: cursive;
}

/* Style the dropdown arrow */
.custom-select::after {
  content: '\25BC'; /* Unicode character for down arrow */
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

/* Style on hover/focus */
.custom-select:hover,
.custom-select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.7);
  cursor: pointer;
}

/* Style the dropdown options */
.custom-select option {
  padding: 10px;
  background-image: linear-gradient(to right, lightpink, skyblue, lightpink);
  color: #333;
  cursor: pointer;
}

/* Style the selected option */
.custom-select option:checked {
  background-color: #3498db;
  color: #fff;
}

</style>
