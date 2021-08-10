/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Mahrokh Sadrolodabaee______ Student ID: __159436195_____ Date: ______
*
* Online (Heroku) Link: 
*
********************************************************************************/

const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const data = require("./data-service.js");
const bodyParser = require('body-parser');
const fs = require("fs");
const multer = require("multer");
const { resolve } = require("path");
const { rejects } = require("assert");
const dataServiceAuth = require('data-service-auth.js');
const clientSessions = require('client-sessions');
const app = express();
app.engine('.hbs', exphbs({
    extname: '.hbs',

    helpers: {
        //or helper1
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) return options.inverse(this);
            else return options.fn(this);

        }


    }




}));

//whe redirevt when render?


app.set('view engine', '.hbs');
app.use(express.static("public"));

const HTTP_PORT = process.env.PORT || 8080;

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.use(clientSessions({
    cookieName: "session",
    secret: "myWeb322Asg5",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60


}));

/*
Once this is complete, incorporate the following custom middleware function to ensure that all of your 
templates will have access to a "session" object (ie: {{session.userName}} for example) - we will need this to 
conditionally hide/show elements to the user depending on whether they're currently logged in. */

app.use((req, res, next) => {
    res.locals.session = req.session;//what locals???
    next();
});

function ensureLogin() {
    if (!req.session.user) resolve.redirect("/login");
    else next();

}

//req.body  post data
app.post("/login", (req, res) => {

    //set the value of the client's "User-Agent" to the request body //wats useeagent??
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.CheckUser(req.body)
        .then(user => {
            req.session.user = {
                userName: user.req.body.userName,
                email: user.req.body.email,
                loginHistory: user.req.body.loginHistory
            }
            res.redirect('/employees');
        })
      
        .catch(err => {
            res.render('login', { errorMessage: err, userName: req.body.userName })
        })

})


app.post("/register", (req, res) => {
    dataServiceAuth.RegisterUser(req.body)
        .then(() => res.render('register', { successMessage: "User created" }))
        .catch(err => res.render('register', { errorMessage: err, userName: req.body.userName }));
})



app.post("/department/update", ensureLogin, (req, res) => {
    data.updateDepartment(req.body)//info from the from
        .then(() => {
            res.redirect('/departments')
        }).catch((err) => {
            res.status(500).send("Unable to Update Department");
        });
});

app.post("/departments/add", ensureLogin, (req, res) => {
    data.addDepartment(req.body)
        .then(() => {
            res.redirect('/departments');
        }).catch((err) => {
            res.status(500).send("unable to add departments");
        })
});


app.post("/employee/update", ensureLogin, (req, res) => {

    // data.updateEmployee(req.body)
    //     .then(res.redirect('/employees'))right?
    data.updateEmployee(req.body)//when use req.body???
        .then(() => res.redirect("/employees"))
        .catch(err => res.status(500).send("Unable to Update Employee"));


});

app.post("/employees/add", ensureLogin, (req, res) => {
    data.addEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        });
});

app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => {//wats this
    res.redirect("/images");
});

/*
GET /logout 
• This "GET" route will simply "reset" the session (Hint: refer to the Week 10 notes) and redirect the user to  
the "/" route, ie: res.redirect('/'); 

*/

app.get("/logout",(req,res)=>{
    req.session.reset();
    res.redirect('login')
})
/*
GET /userHistory 
• This "GET" route simply renders the "userHistory" view without any data (See userHistory.hbs under Adding 
New Routes below).  IMPORTANT NOTE: This route (like the 15 others from above) must also be protected by 
your custom ensureLogin helper middleware. 

*/

app.get("/userHistory",ensureLogin,(req,res)=>{
res.render('userHistory',{                                  //////////////                              });
})

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
})

app.get("/register", (req, res) => {
    res.render('register');
})

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/images/add", ensureLogin, (req, res) => {
    res.render('addImage');
})

app.get("/employees/add", ensureLogin, (req, res) => {
    data.getAllEmployees()
        .then(data => res.render('addEmployee', { departments: data }))
        .catch(err => res.render('addEmployee', { departments: [] }));

});
//whers array of images???
app.get("/images", ensureLogin, (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render("images", { images: items });
    });
});

app.get("/employees", ensureLogin, (req, res) => {
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then((data) => {

            res.render("employees", { employees: data })

        }).catch((err) => {
            res.render("employees", { message: "no results" });
        });
    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then((data) => {

            res.render("employees", { employees: data })

        }).catch((err) => {
            res.render("employees", { message: "no results" });
        });
    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then((data) => {


            res.render("employees", { employees: data })


        }).catch((err) => {
            res.render("employees", { message: "no results" });
        });
    } else {
        data.getAllEmployees()
            .then(data => {

                if (data.length > 0) res.render("employees", { employees: data })
                else res.render("employees", { message: "no results" })

            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
    }
});



app.get("/employee/:empNum", ensureLogin, (req, res) => {// initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum)///////////////////////its data
        .then((data) => {
            if (data) {
                viewData.employee = data; //store employee data in the "viewData" object as "employee"
            }/////////////////////////////////////////////////////////////////////////////////////////////////////?wtf???

            else {
                viewData.employee = null; // set employee to nullifnone were returned
            }
        })
        .catch(() => {
            viewData.employee = null; // set employee to null if there was an error
        })
        .then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        })
        .then(() => {
            if (viewData.employee == null) { // if no employee -return an error
                res.status(404).send("Employee Not Found");
            }
            else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});


app.get("/managers", ensureLogin, (req, res) => {
    data.getManagers().then((data) => {
        res.render("employees", { employees: data })
    });
});

app.get("/departments", ensureLogin, (req, res) => {
    data.getDepartments()
        .then(data => {

            if (data.length > 0) res.render("departments", { departments: data })
            else res.render("departments", { message: "no results" })

        }).catch(err => {
            res.render("departments", { message: "no results" });
        });

});


app.get("/departments/add", ensureLogin, (req, res) => {
    res.render('addDepartment');
});

app.get("/department/:departmentId", ensureLogin, (req, res) => {
    data.getDepartmentById(req.params.departmentId)
        .then(data => {
            if (data.length > 0) res.render('department', { department: data });
            else res.status(404).send('Department Not Found');
        }).catch(err => res.status(404).send("DepartmentNot Found"));

});

app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
    data.deleteDepartmentById(req.params.departmentId)                                          //if else or catch???
        .then(() => res.redirect('/departments'))

        .catch(err => res.status(500).send("Unable to Remove Department/ Departmentnot found"));
});

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    data.deleteEmployeeByNum(req.params.empNum)
        .then(() => res.redirect('/employees'))
        .catch(err => res.status(500).send("Unable to Remove Employee / Employee not found"));

});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

data.initialize()
    .then(dataServiceAuth.initialize)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("app listening on: " + HTTP_PORT)
        });
    }).catch(err => {
        console.log("unable to start server: " + err);
    });









// when we use 
// .then(
//     res.render("addEmployee", { departments: data })
// )

// when we use 
// .then(()=>)