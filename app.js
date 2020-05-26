//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


//using get method to show up the html files
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/success", function (req, res) {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function (req, res) {
    res.sendFile(__dirname + "/failure.html");
});

//in the post method, methods are sending via mailapi
app.post("/", function (req, res) {

    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    //this is coming from the mailchimp documentation. check the website and look for it
    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    //parsing the data into json format and post to mailchimp servers 
    let jsonData = JSON.stringify(data);

    //making a route variable
    var options = {
        url: "https://us18.api.mailchimp.com/3.0/lists/1eec4828e7",
        method: "POST",
        headers: {
            "Authorization": "mali1 5b34c6a2e19ece512bbde29622287d56-us18"
        },
        body: jsonData
    };

    //making the http request and sending the data and route info to server
    request(options, function (error, response, body) {

        //checking the http responses and redirecting the user
        if (error) {
            res.redirect("/failure");
        } else {
            console.log("Status code : " + response.statusCode);
            if (response.statusCode === 200) {
                res.redirect("/success");
            } else {
                res.redirect("/failure");
            }
        }

    });
});

//taking user back to sign up page or home root
app.post("/failure", function (req, res) {
    res.redirect("/");
});


//listening the port
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running now..");
});