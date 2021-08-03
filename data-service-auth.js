

const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Ma661370:661370@cluster0.jwvms.mongodb.net/web322Asg5?retryWrites=true&w=majority");

const schema=mongoose.Schema;

const myTable=new schema({
    "userName":{
        "type":String,
        "unique":true
    },
    "password":String,
    "email":String,
    "loginHistory":[{
        "dateTime":Date,
        "userAgent":String
    }]

});

let User=mongoose.model("User",myTable);

