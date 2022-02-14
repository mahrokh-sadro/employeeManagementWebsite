const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
// var sequelize = new Sequelize("managementDB", "usernamee", "passs2233444ggg", {
//   host: "ec2-44-195-201-3.compute-1.amazonaws.com",
//   dialect: "postgres",
//   port: 5432,
//   dialectOptions: {
//     ssl: { rejectUnauthorized: false },
//   },
//   query: { raw: true },
// });

var sequelize = new Sequelize(
  "d5gsj1c7aehqq9",
  "eejcshgckbhheu",
  "0493627fda40a804ff0835b409510e679e5752e78dcdfe672cce4cac1b1d89cc",
  {
    host: "ec2-34-233-157-189.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

const Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING,
});

const Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

Department.hasMany(Employee, { foreign: "department" });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then((Employee) => {
        resolve();
      })
      .then((Department) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};
//crud doesnt have return
module.exports.addEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") employeeData[i] = null;
    }
    Employee.create(employeeData)
      .then(() => resolve())
      .catch((err) => reject("unable to create employee"));
  });
};

module.exports.getEmployeeByNum = (num) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeNum: num,
      },
    })
      .then((data) => resolve(data[0]))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getEmployeesByStatus = (status) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status: status,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getEmployeesByDepartment = (department) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        departmentId: department,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getEmployeesByManager = (manager) => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: manager,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {
    reject();
  });
};

module.exports.getDepartments = () => {
  return new Promise((resolve, reject) => {
    Department.findAll()
      .then((data) => resolve(data))
      .catch((err) => reject("no results returned"));
  });
};

module.exports.updateEmployee = (employeeData) => {
  return new Promise((resolve, reject) => {
    console.log(`best person ever ` + employeeData.firstName);
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") employeeData[i] = null;
    }
    Employee.update(employeeData, {
      //syntaxs dif than create?

      where: {
        employeeNum: employeeData.employeeNum, //from form body
      },
    })
      .then(() => resolve())
      .catch((err) => reject("unable to updateemployee"));
  });
};

module.exports.addDepartment = (departmentData) => {
  return new Promise((resolve, reject) => {
    for (let i in departmentData) {
      if (departmentData[i] == "") departmentData[i] = null;
    }
    //    await
    Department.create(departmentData)
      .then(() => resolve())
      .catch((err) => resolve("unable to create department"));
  });
};
/*
we can invoke the Department.update()function and filter the operation by "departmentId" 
(ie departmentData.departmentId)
*/
module.exports.updateDepartment = (departmentData) => {
  return new Promise((resolve, reject) => {
    for (let i in departmentData) {
      if (departmentData[i] == "") departmentData[i] = null;
    }
    Department.update(departmentData, {
      where: {
        departmentId: departmentData.departmentId,
      },
    })
      .then(() => resolve())
      .catch((err) => reject("no results returned"));
  });
};

module.exports.getDepartmentById = (id) => {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        departmentId: id,
      },
    })
      .then((data) => resolve(data))
      .catch((err) => resolve("no results returned"));
  });
};

module.exports.deleteDepartmentById = (id) => {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id,
      },
    })
      .then(() => resolve("destroyed")) //or then(resolve())
      .catch((err) => reject("was rejected"));
  });
};

module.exports.deleteEmployeeByNum = (empNum) => {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where: {
        employeeNum: empNum,
      },
    })
      .then(() => resolve("destroyed"))
      .catch((err) => reject("was rejected"));
  });
};
