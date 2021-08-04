

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Ma661370:661370@cluster0.jwvms.mongodb.net/web322Asg5?retryWrites=true&w=majority");

const schema = mongoose.Schema;

const myTable = new schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]

});

let User = mongoose.model("User", myTable);



module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("");

        db.on('error', err => reject(err));
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });


    });
};

module.exports.registerUser = userData => {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password) reject("Passwords do not match");
        else {
            //create a new User n save
            let newUser = new User(userData);
            newUser.save(err=>{
                if(err){
                    if(err.code===11000 ) reject("User Name already taken");
                    else reject(`There was an error creating the user: ${err}`)
                }
                else resolve();
            });
        }
    });
};

