

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb+srv://Ma661370:661370@cluster0.jwvms.mongodb.net/web322Asg5?retryWrites=true&w=majority");

const schema = mongoose.Schema;


//check theseeee
const userSchema = new schema({
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

let User = mongoose.model("User", userSchema);



module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection("mongodb+srv://Ma661370:661370@cluster0.jwvms.mongodb.net/web322Asg5?retryWrites=true&w=majority");

    db.on('error', err => reject(err));
    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });


  });
};


module.exports.registerUser = userData => {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject('Passwords do not match!');
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userData.password, salt, (err, hash) => {
          if (err) {
            reject('There was an error encrypting the password');
          } else {
            userData.password = hash;
            let newUser = new User(userData);
            newUser
              .save()
              .then(() => {
                resolve();
              })
              .catch(err => {
                if (err.code == 11000) {
                  reject('User Name already taken!');
                } else {
                  reject('There was an error creating the user: ' + err);
                }
              });
          }
        });
      });
    }
  });
}


    module.exports.checkUser = userData => {
      return new Promise((resolve, reject) => {
          User.find({ userName: userData.userName })
              .exec().then((users) => {
                  if (users) {
                      bcrypt.compare(userData.password, users[0].password).then(res => {
                          if (res === true) {
                              users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                              User.updateOne(
                                  { userName: users[0].userName },
                                  { $set: { loginHistory: users[0].loginHistory } },
                              ).exec().then(() => {
                                  resolve(users[0]);
                              }).catch(err =>  reject("There was an error verifying the user: " + err)
                              );
                          } else  reject("Incorrect Password for user: " + userData.userName);
                          
                      })
                  }
              }).catch(err => reject("Unable to find user: " + userData.userName)
              )
  
      })
  };