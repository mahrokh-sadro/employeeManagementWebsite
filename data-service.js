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


//wheres department?????
Department.hasMany(Employee, { foreign: 'department' });
///////////////////////////////////////////////////////////////////////////////////////my department is buggy

module.exports.initialize = () => {//wat does this do again???how to test
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(Employee => { resolve('Employee model synced'); })
            .then(Department => { resolve('Employee model synced'); })
            .catch(err => reject('unable to sync the database'));

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

            // data = data.map(value => value.dataValues);
            // resolve(data);

            .catch(err => reject('no results returned'));

    });
}
/*

*/
module.exports.addEmployee = employeeData => {

    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") employeeData[i] = null;
        }
        Employee.create(employeeData)//i forgot to pass the data
            .then(() => resolve())
            .catch(err => reject('unable to create employee'));
    });
};
/*
This function will invoke the Employee.findAll()function and filter the results by "employeeNum"
 (using the value passed to the function -ie: 1 or 2 or 3 ... etc
    •If the Employee.findAll()operation
  resolved successfully, invoke the resolve method for the promise (with the data[0], ie: only 
    providethe first object) to communicate back to server.js that the operation was a success and
     to provide the data.•If there was an error at any time during this process, invoke the 
     rejectmethod and pass a meaningful message, ie: "no results returned".
*/
module.exports.getEmployeeByNum = num => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(data => resolve(data[0]))//why???????????????????????????????????????
            .catch(err => reject('no results returned')); //wat err?

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
        }).then(data => resolve(data))
            .catch(err => reject('no results returned'))

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

module.exports.getEmployeesByDepartment = department => {//how to test each 1 here??
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                departmentId: department
            }
        }).then(data => resolve(data))
            .catch(err => reject('no results returned'));

    });
};
/*
This function will invoke the Employee.findAll()function and filter the results by
 "employeeManagerNum" (using the value passed to the function -ie: 1 or 2 or 3 ... etc•
    If the Employee.findAll()operation resolved successfully, invoke the resolve method for the
     promise (with the data) to communicate back to server.js that the operation was a success
      and to provide the data.•If there was an error at any time during this process,
      invoke the rejectmethod and pass a meaningful message, ie: "no results returned".
*/
module.exports.getEmployeesByManager = manager => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(data => resolve(data))
            .catch(err => reject('no results returned'))
    });
};

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};
/*
This function will invoke the Department.findAll()function •If the Department.findAll()operation
 resolved successfully, invoke the resolve method for the promise (with the data) to communicate back 
 to server.js that the operation was a success and to provide the data.•If there was an error at any
  time during this process(or no results were returned), invoke the rejectmethod and pass a meaningful
   message, ie: "no results returned".

*/
module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll()
            .then(data => resolve(data))
            .catch(err => reject('no results returned'));
    })
};



module.exports.updateEmployee = employeeData => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") employeeData[i] = null;
        }
        Employee.update({//syntaxs dif than create?
            employeeData
        },{
            where:{
                employeeNum:employeeData.employeeNum
            }
        })
            .then(() => resolve())
            .catch(err => reject('unable to updateemployee'))

    });
};


module.exports.addDepartment = departmentData => {
    return new Promise((resolve, reject) => {//y we need this?
        // for (property in departmentData) {
        //     if (departmentData.property == "") departmentData.property = null;
        // }
        for (let i in departmentData) {
            if (departmentData[i] == "") departmentData[i] = null;
        }
    //    await
        Department.create(departmentData)              ////////////////////////////////////////////////////////////////////////////wtf 
            .then(() => resolve())
            .catch(err => resolve('unable to create department'));
    });

};
/*
we can invoke the Department.update()function and filter the operation by "departmentId" 
(ie departmentData.departmentId)///////////////////////////////////////////////////////////////////////?
*/
module.exports.updateDepartment = departmentData => {//wats datadepartment??
    return new Promise((resolve, reject) => {
        // for (property in departmentData) {
        //     if (departmentData.property == "") departmentData.property = null;/////////////////////why
        // }
        for (let i in departmentData) {
            if (departmentData[i] == "") departmentData[i] = null;/////////////////////why
        }
        Department.update(departmentData,{  //wats this obj?????///
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(() => resolve())//do we have data??????????
            .catch(err => reject('no results returned'));

    });
}
//f the Department.findAll()operation resolved successfully, invoke the resolve method for the promise (with the data[0]
//wtf  data[0]  doesnt work fffffffffffffffffffffffffffffffffffffffffffffffffff
module.exports.getDepartmentById = id => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(data => resolve(data))
            .catch(err => resolve('no results returned'));

    });

}

module.exports.deleteDepartmentById = id => {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where:{
                departmentId: id
            }
        })
            .then(() => resolve('destroyed'))//or then(resolve())
            .catch(err => reject('was rejected'));
    })
}

module.exports.deleteEmployeeByNum = empNum => {
    return new Promise((resolve, reject) => {

        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(()=>resolve('destroyed'))
            .catch(err => reject('was rejected'));
    })

}



//updates buggy
//delets buggy