const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(
    'dc34jltbr39qoa',
    'okguwxhpdjxjqu',
    'a00be4da5f5fc95358c71cfc390b9c3b95e15b68228f06bfb8dabdd2063f8bd6',
    {
        host: 'ec2-52-6-77-239.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        },
        query: { raw: true }
    });

const Employee = sequelize.define(
    'Employee',
    {
        employeeNum: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        hireDate: Sequelize.STRING
    }
);

const Department = sequelize.define(
    'Department',
    {
        departmentId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        departmentName: Sequelize.STRING
    }
);

/*
This will ensure that our Employee model gets a "department" column that will act as a foreign key
 to the Department model.  When a Department is deleted, any associated Employee's will have a
  "null" value set to their "department" foreign key.
*/
//wheres department?????
Department.hasMany(Employee, { foreign: 'department' });

/*

This function will invoke the sequelize.sync()function, which will ensure that we can connected 
to the DB and that our Employee and Department models are represented in the database as tables.
•If the sync()operation resolved successfully, invoke the resolve method for the promise to
 communicate back to server.js that the operation was a success.•If there was an error at any 
 time during this process, invoke the rejectmethod for the promise and pass an appropriate message,
  ie: reject("unable to sync the database")

*/
module.exports.initialize = function () {//wat does this do again???how to test
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(Employee => { resolve('Employee model synced'); })
            .then(Department => { resolve('Employee model synced'); })
            .catch(err => { reject('unable to sync the database'); });

    });
};
/*
This function will invoke the Employee.findAll()function•If the Employee.findAll()operation 
resolved successfully, invoke the resolve method for the promise (with the data) to communicate 
back to server.js that the operation was a success and to provide the data.•If there was an error
 at any time during this process, invoke the rejectmethod and pass a meaningful message, ie: "no
  results returned".
*/
module.exports.getAllEmployees = () => {//when then has argument??
    return new Promise((resolve, reject) => {
        Employee.findAll()
            .then(data => resolve(data))
            .catch(err => reject('no results returned'));

    });
}

module.exports.addEmployee = function (employeeData) {

    return new Promise(function (resolve, reject) {

        reject();
    });
};

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {

        reject();
    });
};
/*
This function will invoke the Employee.findAll()function and filter the results by "status" 
(using the value passed to the function -ie: "Full Time" or "Part Time"•
If the Employee.
findAll()operation resolved successfully, invoke the resolve method for the promise (with the data)
 to communicate back to server.js that the operation was a success and to provide the data.•If
  there was an error at any time during this process, invoke the rejectmethod and pass a meaningful
   message, ie: "no results returned".
*/
module.exports.getEmployeesByStatus = status => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: status

            }
        }).then(data=>resolve(data))
        .catch(err=>reject('no results returned'))

    });
};
/*
This function will invoke the Employee.findAll()function and filter the results by "department" 
(using the value passed to the function -ie: 1 or 2 or 3 ... etc
•If the Employee.findAll()operation resolved successfully, invoke the resolve method for the promise
 (with the data) to communicate back to server.jsthat the operation was a success and to provide 
 the data.•If there was an error at any time during this process, invoke the rejectmethod and pass
  a meaningful message, ie: "no results returned
*/

module.exports.getEmployeesByDepartment = department=> {
    return new Promise( (resolve, reject)=> {
        Employee.findAll({
            where:{
                departmentId:department
            }
        }).then(data=>resolve(data))
        .catch(err=>reject('no results returned'));
  
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};



module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        reject();
    });
};

