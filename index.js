const { Console } = require('console');
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Yonjuuni$%646042',
    database: 'cms_db',
  });
  

console.log("Welcome to YerTEAM CMS, a product of FRUOsoft!")

//TODO: this code functions; use it to auto-populate list choices from the database.
//! const mainPrompt = () => {
//!    connection.query('SELECT * FROM position', (err, results) => {
//!         if (err) throw err;

//!         inquirer.prompt([
//!             {
//!!                 message: 'What action would you like to take?',
// !                type: 'list',
//!                 name: 'prompt',
//!                 choices () {
//!                     const actionArray = [];
//!                     results.forEach(({title}) => {
//!                         actionArray.push(title);
//!                     });
//!                     return actionArray;   
//!                 },
//!             }
//!         ])
//!         .then((answer) => {
//!             let chosenAction;
//!         })
//!     })
//! }

function mainPrompt(){
    inquirer.prompt([
        {
            message: 'What action would you like to take?',
            type: 'list',
            name: 'prompt',
            choices: ['View All Employees','View ALl Employees by Department','View ALl Employees by Manager','Add Employee','Update Employee Role','Update Employee Manager','Quit'],
        }
    ])
    .then((answer) => {
        if (answer === "View ALl Employees"){
            AllEmployees();
        }else if (answer === "View All Employees by Department"){
            employeesByDept();
        }else if (answer === "View ALl Employees by Manager"){
            employeesByManager();
        }else if (answer === "Add Employee"){
            addEmployee();
        }else if (answer === "Update Employee Role"){
            updateRole();
        }else if (answer === "Update Employee Manager"){
            updateManager();
        }else if (answer === "Quit"){
            Console.log("Thanks for using YerTEAM CMS.")
            askForInternInfo();
        }
    })
}

mainPrompt();

AllEmployees()

function employeesByDept(){

}

function employeesByManager(){
    
}

function addEmployee(){
    
}

function updateRole(){
    
}

function updateManager(){
    
}