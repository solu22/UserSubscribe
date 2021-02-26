const express = require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");
require('dotenv').config();

const app= express();
app.use(bodyParser.urlencoded({extended :true}));

/*To override bootstrap remote statements */
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname +"/signup.html");
});

app.post("/", (req, res)=>{
  const fname=req.body.firstname;
  const lname=req.body.lastname;
  const email=req.body.email;
  

  const data={
      members: [
       {
        email_address:email,
        status: "subscribed",
        merge_fields: {
            FNAME: fname,
            LNAME: lname
        
        }

       }   
      ]
  };
  const apikey= process.env.API_KEY;
  const jsonData= JSON.stringify(data);
  const url= "https://us{digit}.api.mailchimp.com/3.0/lists/{list_id}";
  const options= {
      method: "POST",
      auth:"nuru1:apikey"

  }

  const request=  https.request(url, options, (response)=>{
    
    if(response.statusCode=== 200){
        res.sendFile(__dirname + "/success.html")
    }else
    {
        res.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", (data)=>{
        console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", (req, res)=>{
    res.redirect("/");
})

app.post("/", (req, res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 ,()=>{
    console.log("Server is running on port 3000");
});

