const request = require('request');

// make this driver function async so we can use await which allows waiting for
// a request to finish before starting the next one

// wrap the request call in a Promise so that it will run synchronously
function requestPromise(url) {
    return new Promise(function(resolve, reject) {
        request({
            url,
            method: 'GET',
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
                // console.log("request successful for user", user, " at ", (new Date()).getTime());
            } else {
                console.log('############### ERROR ###############');
                console.log(error);
                console.log('############### BODY ###############');
                console.log(body);
                console.log('############### RESPONSE ###############');
                console.log(response);

                reject(error);
            }
        });
    });
}

module.exports = {
    requestPromise
}