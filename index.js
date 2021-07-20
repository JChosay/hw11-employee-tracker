const { Console } = require('console');
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');
const { Sequelize } = require('sequelize');

var mgrSelectID = [];


const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'jj1234',
    database: 'cms_db',
  });

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//   {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
//   }
// );

// module.exports = sequelize;

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

const queryAllEmployees = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, position.title, department.dept_name, position.salary, employee.manager_id FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id;', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, role_id, manager_id}) => { 
        });
        
        console.log('----------------------------------------------');
        console.log("Viewing All Employees:")
        console.log('----------------------------------------------');
        console.table(res);
        console.log('----------------------------------------------');
        mainPrompt();
    });
};

const employeesByDept = () => {
    connection.query('SELECT * FROM department', (err, results) => {

        inquirer.prompt([
            {
                message: "Which department's employees would you like to view?",
                type: 'list',
                name: 'department',
                choices () {
                    const deptArray = [];
                    
                    results.forEach(({dept_name}) => {
                        deptArray.push(dept_name);
                    });
                    return deptArray;
                }
            },
        ])

        .then((answer) => {
            let chozeDept = answer.department;

            connection.query(`SELECT employee.id, employee.first_name, employee.last_name, position.title, position.salary, employee.manager_id FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id WHERE department.dept_name = '${chozeDept}'`, (err, res) => {
                if (err) throw err;
                res.forEach(({ id, first_name, last_name, title, salary, manager_id}) => { 
                });

                console.log('----------------------------------------------');
                console.log(`"Viewing All Employees in the ${chozeDept} Department:"`)
                console.log('----------------------------------------------');
                console.table(res);
                console.log('----------------------------------------------');
                mainPrompt();
            });
        });
    });
}
     

const employeesByManager = () => {
    mgrSelectID = [];

    connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL', (err, results) => {

    inquirer.prompt([
        {
            message: "Which manager's subordinates would you like to view?",
            type: 'list',
            name: 'manager',
            choices () {
                const mgrArray = [];
                
                
                results.forEach(({id, first_name}) => {
                    mgrArray.push(id+": "+first_name);
                });

                return mgrArray;
            }
        },
    ])

    .then((answer) => {
        
        let chozeMgr = answer.manager;
        console.log (answer.manager);
        let mgrInd = parseInt(chozeMgr, 10);
        console.log (mgrInd);
        let choiceTrim1 = chozeMgr.replace(mgrInd,"");
        let choiceTrim2 = choiceTrim1.replace(": ","");
        console.log("ChoiceTrim1: "+choiceTrim1);

            connection.query(`SELECT employee.id, employee.first_name, employee.last_name, position.title, department.dept_name, position.salary FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id WHERE employee.manager_id = '${mgrInd}'`, (err, res) => {
                if (err) throw err;
                res.forEach(({ id, first_name, last_name, title, salary, manager_id}) => { 
                });

                console.log('----------------------------------------------');
                console.log(`Viewing All of ${choiceTrim2}'s Subordinates:`)
                console.log('----------------------------------------------');
                console.table(res);
                console.log('----------------------------------------------');
                mainPrompt();
            });
        });
    });
}

// function addEmployee(){
//     console.log("AddEmployee selected");
// }

// function updateRole(){
//     console.log("updateRole selected");
// }

// function updateManager(){
//     console.log("updateManager selected");
// }
