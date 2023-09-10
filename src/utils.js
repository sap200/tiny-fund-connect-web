export default async function checkToken(host) {

    let email = localStorage.getItem("email");
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


    // make a get request
    const apiPath = host + '/token/check'; // Replace with your API endpoint URL
    const params = {
        "email": email,
        "token": token
    };

    const url = new URL(apiPath);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    try {
        console.log("Reached here")
        const response = await fetch(url);
   
        const data = await response.json(); // You can also use response.json() if the response is in JSON format
        console.log(data);

         
        if (!response.ok) {
            return false
          }

        if (data.status != "SUCCESS") {
            return false;
        } 

        return true;

    } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          return false;
      }

}