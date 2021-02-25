const express = require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");

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

  const jsonData= JSON.stringify(data);
  const url= "https://us1.api.mailchimp.com/3.0/lists/5e6089a1c7";
  const options= {
      method: "POST",
      auth:"nuru1:05f3a6ed4da9bdcf7a022afde4a54a6f-us1"

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

