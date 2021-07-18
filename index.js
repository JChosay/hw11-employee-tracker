const { Console } = require('console');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const { Sequelize } = require('sequelize');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'jj1234',
//     database: 'cms_db',
//   });

cons

//! Sweet banner, right? See: https://manytools.org/hacker-tools/ascii-banner/

console.log('----------------------------------------------------------------------');
console.log('----------------------------------------------------------------------');
console.log('███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗');
console.log('██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝');
console.log('█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  ');
console.log('██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  ');
console.log('███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗');
console.log('╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝');
console.log('     ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ ');
console.log('     ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗');
console.log('        ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝');
console.log('        ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗');
console.log('        ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║');
console.log('        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝');
console.log('----------------------------------------------------------------------');
console.log('----------------------------------------------------------------------');
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
            choices: ['View All Employees','View All Employees by Department','View All Employees by Manager','Add Employee','Update Employee Role','Update Employee Manager','Quit'],
        }
    ])
    .then((answers) => {
        if (answers.prompt === "View All Employees"){
            queryAllEmployees();
        }else if (answers.prompt === "View All Employees by Department"){
            employeesByDept();
        }else if (answers.prompt === "View All Employees by Manager"){
            employeesByManager();
        }else if (answers.prompt === "Add Employee"){
            addEmployee();
        }else if (answers.prompt === "Update Employee Role"){
            updateRole();
        }else if (answers.prompt === "Update Employee Manager"){
            updateManager();
        }else if (answers.prompt === "Quit"){
            console.log('----------------------------------------------------------------------');
            console.log('     ██████╗  ██████╗  ██████╗ ██████╗ ██████╗ ██╗   ██╗███████╗██╗');
            console.log('    ██╔════╝ ██╔═══██╗██╔═══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝██║');
            console.log('    ██║  ███╗██║   ██║██║   ██║██║  ██║██████╔╝ ╚████╔╝ █████╗  ██║');
            console.log('    ██║   ██║██║   ██║██║   ██║██║  ██║██╔══██╗  ╚██╔╝  ██╔══╝  ╚═╝');
            console.log('    ╚██████╔╝╚██████╔╝╚██████╔╝██████╔╝██████╔╝   ██║   ███████╗██╗');
            console.log('     ╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝');
            console.log('----------------------------------------------------------------------');
            console.log("Thanks for using YerTEAM CMS.");
            connection.end();
        }
    })
}

mainPrompt();

//! This works; but, it doesn't pull in the right fields to satisfy the reqs.
// const queryAllEmployees = () => {
//     connection.query('SELECT * FROM employee', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ id, first_name, last_name, role_id, manager_id}) => { 
//         });
        
//         console.log('----------------------------------------------');
//         console.log("Viewing All Employees:")
//         console.log('----------------------------------------------');
//         console.table(res);
//         console.log('----------------------------------------------');
//         mainPrompt();
//     });
// };

const queryAllEmployees = () => {
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, position.title, position.salary, employee.manager_id';
    query += 'FROM (employee INNER JOIN position ON employee.role_id = position.id)';

    connection.query(query, (err, res) => {
        if (err) throw err;
        res.ForEach(({id, first_name, last_name, title, salary, manager_id}) => {
        })

        console.log('----------------------------------------------');
        console.log("Viewing All Employees:")
        console.log('----------------------------------------------');
        console.table(res);
        console.log('----------------------------------------------');
        mainPrompt();
    })
};

                                            

// function employeesByDept(){
//     console.log("EmployeesByDept selected");
// }

// function employeesByManager(){  
//     console.log("EmployeesByManager selected");
// }

// function addEmployee(){
//     console.log("AddEmployee selected");
// }

// function updateRole(){
//     console.log("updateRole selected");
// }

// function updateManager(){
//     console.log("updateManager selected");
// }