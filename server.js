const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const data = require("./data-service.js");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const { resolve } = require("path");
const { rejects } = require("assert");
const dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require("client-sessions");
const app = express();
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",

    helpers: {
      //or helper1
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) return options.inverse(this);
        else return options.fn(this);
      },
    },
  })
);

app.set("view engine", ".hbs");
app.use(express.static("public"));

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.use(
  clientSessions({
    cookieName: "session",
    secret: "myWeb322Asg5",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) res.redirect("/login");
  else next();
}

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  dataServiceAuth
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect("/employees");
    })

    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

app.post("/register", (req, res) => {
  dataServiceAuth
    .registerUser(req.body)
    .then((user) => res.render("register", { successMessage: "User created" }))
    .catch((err) =>
      res.render("register", { errorMessage: err, userName: req.body.userName })
    );
});

app.post("/department/update", ensureLogin, (req, res) => {
  data
    .updateDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.status(500).send("Unable to Update Department");
    });
});

app.post("/departments/add", ensureLogin, (req, res) => {
  data
    .addDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      res.status(500).send("unable to add departments");
    });
});

app.post("/employee/update", ensureLogin, (req, res) => {
  data
    .updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch((err) => res.status(500).send("Unable to Update Employee"));
});

app.post("/employees/add", ensureLogin, (req, res) => {
  data
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      res
        .status(500)
        .render("employee", { message: "500: Unable to add the employee" });
    });
});

app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => {
  res.redirect("/images");
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/images/add", ensureLogin, (req, res) => {
  res.render("addImage");
});

app.get("/employees/add", ensureLogin, (req, res) => {
  data
    .getAllEmployees()
    .then((data) => res.render("addEmployee", { departments: data }))
    .catch((err) => res.render("addEmployee", { departments: [] }));
});
app.get("/images", ensureLogin, (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, items) {
    res.render("images", { images: items });
  });
});

app.get("/employees", ensureLogin, (req, res) => {
  if (req.query.status) {
    data
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.department) {
    data
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.manager) {
    data
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else {
    data
      .getAllEmployees()
      .then((data) => {
        if (data.length > 0) res.render("employees", { employees: data });
        else res.render("employees", { message: "no results" });
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  }
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
  let viewData = {};
  data
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data;
      } else {
        viewData.employee = null;
      }
    })
    .catch((err) => {
      viewData.employee = null;
    })
    .then(data.getDepartments)
    .then((data) => {
      viewData.departments = data;

      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch((err) => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.employee == null) {
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData });
      }
    });
});

app.get("/managers", ensureLogin, (req, res) => {
  data.getManagers().then((data) => {
    res.render("employees", { employees: data });
  });
});

app.get("/departments", ensureLogin, (req, res) => {
  data
    .getDepartments()
    .then((data) => {
      if (data.length > 0) res.render("departments", { departments: data });
      else res.render("departments", { message: "no results" });
    })
    .catch((err) => {
      res.render("departments", { message: "no results" });
    });
});

app.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartment");
});

app.get("/department/:departmentId", ensureLogin, (req, res) => {
  data
    .getDepartmentById(req.params.departmentId)
    .then((data) => {
      if (data.length > 0) res.render("department", { department: data });
      else res.status(404).send("Department Not Found");
    })
    .catch((err) => res.status(404).send("DepartmentNot Found"));
});

app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
  data
    .deleteDepartmentById(req.params.departmentId)
    .then(() => res.redirect("/departments"))

    .catch((err) =>
      res.status(500).send("Unable to Remove Department/ Departmentnot found")
    );
});

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
  data
    .deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect("/employees"))
    .catch((err) =>
      res.status(500).send("Unable to Remove Employee / Employee not found")
    );
});

const HTTP_PORT = process.env.PORT || 5000;

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

data
  .initialize()
  .then(dataServiceAuth.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start server: " + err);
  });
