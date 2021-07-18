const Sequelize =require('sequelize');

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


module.exports.initialize = function () {
    return new Promise(function(resolve,reject){

        reject();
    });
};

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve,reject){

        reject();
    });
}

module.exports.addEmployee = function (employeeData) {
    
    return new Promise(function(resolve,reject){

        reject();
    });
};

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function(resolve,reject){

        reject();
    });
};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function(resolve,reject){

        reject();
    });
};


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function(resolve,reject){

        reject();
    });
};

module.exports.getEmployeesByManager = function (manager) {
   return new Promise(function(resolve,reject){
       reject();
   });
};

module.exports.getManagers = function () {
   return new Promise(function(resolve,reject){
       reject();
   });
};

module.exports.getDepartments = function(){
   return new Promise(function(resolve,reject){
       reject();
   });
};



module.exports.updateEmployee = function(employeeData){
   return new Promise(function(resolve,reject){
       
    reject();
});
};

  