var http = require('http');

var requestOptions = {
    hostname:'localhost',
    port:'5000',
    method:'get',
    path:'/http_get_static_file_server.js'
};

var request = http.request(requestOptions, function (resp) {
    var returnData = '';
    resp.on('data', function (data) {
        returnData += data;
    })
    resp.on('end', function () {
        console.log(returnData);
    })

});
request.end();
