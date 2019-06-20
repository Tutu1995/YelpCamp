// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Show the HTML for the Google homepage.
//   }
// })

const rp = require('request-promise');
rp('https://jsonplaceholder.typicode.com/users/1')    
   .then((body) => {
        const parseData = JSON.parse(body);
        console.log(`${parseData.name} lives in ${parseData.address.city}`);
   })
   .catch((err) => {
        console.log('Error', err);
   });
    
