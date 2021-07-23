const { Console } = require('console');
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');
const { Sequelize } = require('sequelize');

//! some global variables here...
var rolePick = "";
var mgrAssign = "";
var mgrSelectID = [];


const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'jj1234',
    database: 'cms_db',
  });

//! Sweet banner, right? See: https://manytools.org/hacker-tools/ascii-banner/

console.log('|-----------------------------------------------------------------------|');
console.log('|-----------------------------------------------------------------------|');
console.log('|                                                                       |');
console.log('| ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗ |');
console.log('| ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝ |');
console.log('| █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗   |');
console.log('| ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝   |');
console.log('| ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗ |');
console.log('| ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝ |');
console.log('|     ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗          |');
console.log('|     ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗         |');
console.log('|        ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝         |');
console.log('|        ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗         |');
console.log('|        ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║         |');
console.log('|        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝         |');
console.log('|                                                                       |');
console.log('|-----------------------------------------------------------------------|');
console.log('|-----------------------------------------------------------------------|');
console.log("Welcome to YerTEAM CMS, a product of FRUOsoft!")


//! This is the central prompt - it begins when users run the app, and after each action
//! it is called again until users choose "quit."
function mainPrompt(){

    //! Resets the globals each time the prompt is run
    rolePick = "";
    mgrAssign = "";
    mgrSelectID = [];

    //! Asks users what action they'd like to take and calls a matching function
    inquirer.prompt([
        {
            message: 'What action would you like to take?',
            type: 'list',
            name: 'prompt',
            choices: ['View All Employees','View All Employees by Department','View All Employees by Manager','Add Employee', 'Remove Employee','Update Employee Role','Update Employee Manager', 'Add or Remove a Department', 'Add or remove a role', 'Quit'],
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
            addEmployeeSwitch();
        }else if (answers.prompt === "Remove Employee"){
            removeEmployee();
        }else if (answers.prompt === "Update Employee Role"){
            updateRole();
        }else if (answers.prompt === "Update Employee Manager"){
            updateManager();
        }else if (answers.prompt === "Add or Remove a Department"){
            updateDept();
        }else if (answers.prompt === "Add or remove a role"){
            updateNewRole();
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
        
        //! starts by grabbing the whole answer, where "[index number]: [Manager's first name]"
        let chozeMgr = answer.manager;
        //! Next grabs just the number from that string, which it can pass to the select query...
        let mgrInd = parseInt(chozeMgr, 10);
        //! then, parses out that same index value from the original answer string
        let choiceTrim1 = chozeMgr.replace(mgrInd,"");
        //! finally, trims out the ": " to leave only the manager's first name
        let choiceTrim2 = choiceTrim1.replace(": ","");
        
            connection.query(`SELECT employee.id, employee.first_name, employee.last_name, position.title, department.dept_name, position.salary FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id WHERE employee.manager_id = '${mgrInd}'`, (err, res) => {
                if (err) throw err;
                res.forEach(({ id, first_name, last_name, title, salary, manager_id}) => { 
                });

                console.log('----------------------------------------------');
                console.log(`Viewing All of ${choiceTrim2}'s Subordinates:`);
                console.log('----------------------------------------------');
                console.table(res);
                console.log('----------------------------------------------');
                mainPrompt();
            });
        });
    });
}


const addEmployeeSwitch = () => {
    inquirer.prompt([
        {
            message: "Will the new employee be a manager?",
            type: 'list',
            choices: ['Yes','No'],
            name: 'switch',
        }
    ])
    .then((answers) => {
        if (answers.switch === "Yes"){
            addManager();
        }else{
            addEmployee();
        }
    });
}


const addEmployee = () => {
    connection.query('SELECT position.id, position.title, employee.first_name FROM position JOIN employee ON employee.role_id = position.id', (err, results) => {

    inquirer.prompt([
        
        {
            message: "What is the new employee's first name?",
            type: 'input',
            name: 'newFirst',
        },
        {
            message: "What is the new employee's last name?",
            type: 'input',
            name: 'newLast',
        },
        {
            message: "What will be this new employee's role?",
            type: 'list',
            name: 'newRole',
            choices () {
                const roleArrayRaw = [];
                
                results.forEach(({id, title}) => {
                    roleArrayRaw.push(id+": "+title);
                });

                let roleArray = parseInt(roleArrayRaw, 10);
                return roleArrayRaw;
            }
        },
        {
            message: "To which manager will this employee be reporting?",
            type: 'list',
            name: 'newMgr',
            choices () {
                const mgrArrayRaw = [];
                
                results.forEach(({id, first_name}) => {
                    mgrArrayRaw.push(id+": "+first_name);
                });

                const mgrArray = parseInt(mgrArrayRaw, 10);
                return mgrArrayRaw;
            }
        },
    ])

    .then((answers) => {
        
        let newRoleRaw = answers.newRole;
        let newRole = parseInt(newRoleRaw, 10);
        
        let newMgrRaw = answers.newMgr;
        let newMgr = parseInt(newMgrRaw, 10);

        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.newFirst}", "${answers.newLast}", "${newRole}", "${newMgr}")`, (err, results) => {
            console.log(results);
            console.log(`${answers.newFirst} has been added to the database.`)
            mainPrompt();
        });
    })
    
})    
}

const addManager = () => {
    connection.query('SELECT position.id, position.title, employee.first_name FROM position JOIN employee ON employee.role_id = position.id', (err, results) => {

    inquirer.prompt([
        
        {
            message: "What is the new Manager's first name?",
            type: 'input',
            name: 'newFirst',
        },
        {
            message: "What is the new Manager's last name?",
            type: 'input',
            name: 'newLast',
        },
        {
            message: "What will be this new Manager's role?",
            type: 'list',
            name: 'newRole',
            choices () {
                const roleArrayRaw = [];
                
                results.forEach(({id, title}) => {
                    roleArrayRaw.push(id+": "+title);
                });

                let roleArray = parseInt(roleArrayRaw, 10);
                return roleArrayRaw;
            }
        },
    ])

    .then((answers) => {
        
        let newRoleRaw = answers.newRole;
        let newRole = parseInt(newRoleRaw, 10);
        
        let newMgrRaw = answers.newMgr;
        let newMgr = parseInt(newMgrRaw, 10);

        connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answers.newFirst}", "${answers.newLast}", "${newRole}")`, (err, results) => {
            console.log(`${answers.newFirst} has been added to the database.`)
            mainPrompt();
        });
    })
    
})    
}

const removeEmployee = () => {

    connection.query('SELECT id, first_name, last_name FROM employee', (err, results) => {

    inquirer.prompt([
        {
            message: "Which employee would you like to remove from the database?",
            type: 'list',
            name: 'removePick',
            choices () {
                const pickArray = [];
                
                results.forEach(({id, first_name, last_name}) => {
                    pickArray.push(id+": "+first_name+" "+last_name);
                });

                return pickArray;
            }
        },
    ])

    .then((answer) => {
        
        let removePick = answer.removePick;
        let removeInd = parseInt(removePick, 10);
        let removeTrim = removePick.replace(removeInd, "");
        let removeName = removeTrim.replace(": ","");          
        
            connection.query(`DELETE FROM cms_db.employee WHERE id='${removeInd}'`, (err, res) => {
                if (err) throw err;
                console.log('---------------------------------------------------');
                console.log(`${removeName} has been deleted from the database.`); 
                console.log('---------------------------------------------------');
                mainPrompt();
            });
        });
    });
}

const updateRole = () => {

    connection.query('SELECT employee.id, employee.first_name, employee.last_name, position.title FROM employee JOIN position ON employee.role_id=position.id', (err, results) => {

        console.table("----------------------------------------");
        console.table(results);

    inquirer.prompt([
        {
            message: "Which employee's role would you like to update?",
            type: 'list',
            name: 'rolePick',
            choices () {
                const pickArray = [];
                
                results.forEach(({id, first_name, last_name}) => {
                    pickArray.push(id+": "+first_name+" "+last_name);
                });

                return pickArray;
            }
        },
    ])

    .then((answer) => {
        
        rolePick = answer.rolePick;
        updateRoleAssign();  
        });
    });
}

const updateRoleAssign = () => {    
    let roleAssign = "";
    let assignIndex = "";

    connection.query('SELECT * FROM position', (err, results) => {
            
            let roleInd = parseInt(rolePick, 10);
            let roleTrim = rolePick.replace(roleInd,"");
            let roleName = roleTrim.replace(": ","");  
        
            inquirer.prompt([
                {
                    message: `What role would you like to assign ${roleName}?`,
                    type: 'list',
                    name: 'roleAssign',
                    choices () {
                        const roleArray = [];
                        
                        results.forEach(({id, title}) => {
                            roleArray.push(id+": "+title);
                        });
        
                        return roleArray;
                    }
                },
            ])
            .then((answer) => {
                
                roleAssign = answer.roleAssign;
                assignIndex = parseInt(roleAssign, 10);

                connection.query(`UPDATE employee SET role_id='${assignIndex}' WHERE id='${roleInd}'`, (err, results) => {
                    
                    console.log('-------------------------------------------');
                    console.log(`${roleName}'s role has been updated.`);
                    console.log('-------------------------------------------');
                    mainPrompt();
                
            });    
        });
    })
}

const updateManager = () => {
    connection.query('SELECT * FROM employee WHERE manager_id IS NOT NULL', (err, results) => {
        
        inquirer.prompt([
            {
                message: "To which employee would you like to assign a new manager?",
                type: 'list',
                name: 'mgerPick',
                choices () {
                    const pickArray = [];
                    
                    results.forEach(({id, first_name, last_name}) => {
                        pickArray.push(id+": "+first_name+" "+last_name);
                    });
    
                    return pickArray;
                }
            },
        ])
        .then ((answer) => {
            mgrAssign = answer.mgerPick;
            updateManagerThrow();
            
        });
    });
}

const updateManagerThrow = () => {
    let newManager = "";
    let newManagerIndex = "";
    let newManagerTrim = "";
    let newManagerName = "";

    connection.query('SELECT id, first_name, last_name, manager_id FROM employee WHERE manager_id IS NULL', (err, results) => {
        
            let mgrAssignIndex = parseInt(mgrAssign, 10);
            console.log(mgrAssign);
            console.log(mgrAssignIndex);
            let mgrAssignTrim = mgrAssign.replace(mgrAssignIndex,"");
            let mgrAssignName = mgrAssignTrim.replace(": ","");

            inquirer.prompt([
                {
                    message: `Which manager would you like to assign to ${mgrAssignName}?`,
                    type: 'list',
                    name: 'mgrAssign',
                    choices () {
                        const AssignArray = [];
                        
                        results.forEach(({id, first_name, last_name}) => {
                            AssignArray.push(id+": "+first_name+" "+last_name);
                        });
        
                        return AssignArray;
                    }
                }
            ])
            .then ((answer) => {
                newManager = answer.mgrAssign;
                newManagerIndex = parseInt(newManager);
                newManagerTrim = newManager.replace(newManagerIndex,"");
                newManagerName = newManagerTrim.replace(": ","");

                connection.query(`UPDATE employee SET manager_id='${newManagerIndex}' WHERE id='${mgrAssignIndex}'`, (err, results) => {
                console.log('----------------------------------------------------------');
                console.log(`${mgrAssignName}'s manager has been updated to: ${newManagerName}.`)
                console.log('----------------------------------------------------------');
                mainPrompt();
            });
        });
    });
}

const updateDept = () => {
    inquirer.prompt([
        {
            message: 'Would you like to add or remove a department?',
            type: 'list',
            name: 'yesNoSwitch',
            choices: ['Add Department', 'Remove Department', "CANCEL"],
        }
    ])
    .then ((answer) => {
        if (answer.yesNoSwitch === 'Add Department'){
            addDepartment();
        }else if (answer.yesNoSwitch === 'Remove Department'){
            removeDepartment();
        }else{
            console.log("Action Cancelled.");
            mainPrompt();
        }
    })
};

const addDepartment = () => {
    inquirer.prompt([
        {
            message: 'Please enter a name for the new department:',
            type: 'input',
            name: 'newDeptName'
        }
    ])
    .then ((answer) => {
        connection.query(`INSERT INTO department (dept_name) VALUES ("${answer.newDeptName}")`, (err, results) => {
            console.log('----------------------------------------------------------');
            console.log(`${answer.newDeptName} has been added to the database.`)
            console.log('----------------------------------------------------------');
            mainPrompt();
        })
    })
}

const removeDepartment = () => {
        connection.query('SELECT * FROM department', (err, results) => {
            
            inquirer.prompt([
                {
                    message: 'Which department would you like to remove from the database?',
                    type: 'list',
                    name: 'removeDept',
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
                let chozeRemove = answer.removeDept;
                connection.query(`DELETE FROM cms_db.department WHERE dept_name='${chozeRemove}'`, (err, res) => {     
                
                console.log('-----------------------------------------------------------------');
                console.log(`The ${chozeRemove} department has been removed from the database.`);
                console.log('-----------------------------------------------------------------');
                mainPrompt();
            })
        })
    })
}

const updateNewRole = () => {
    inquirer.prompt([
        {
            message: 'Would you like to add or remove a role?',
            type: 'list',
            name: 'roleSwitch',
            choices: ['Add Role', 'Remove Role', "CANCEL"],
        }
    ])
    .then ((answer) => {
        if (answer.roleSwitch === 'Add Role'){
            addRole();
        }else if (answer.roleSwitch === 'Remove Role'){
            removeRole();
        }else{
            console.log("Action Cancelled.");
            mainPrompt();
        }
    })    
};

const removeRole = () => {
    connection.query('SELECT * FROM position', (err, results) => {
        
        inquirer.prompt([
            {
                message: 'Which role would you like to remove from the database?',
                type: 'list',
                name: 'roleList',
                choices () {
                    const deptArray = [];
                    
                    results.forEach(({title}) => {
                        deptArray.push(title);
                    });
                    return deptArray;
                }
            }
        ])
        .then((answer) => {
            connection.query(`DELETE FROM position WHERE title='${answer.roleList}'`, (err, res) => {  
                console.log('----------------------------------------------------------');
                console.log(`The role of ${answer.roleList} has been removed from the database.`)
                console.log('----------------------------------------------------------');
                mainPrompt();       
            })
        })
    })
}

const addRole = () => {
    let roleTitle = "";
    let roleSalary = "";
    let roleDepartment = "";
    let roleDepartmentIndex = "";
    
    connection.query('SELECT * FROM department', (err, results) => {
        
        inquirer.prompt([
            {
                message: 'Please enter a name for the new role:',
                type: 'input',
                name: 'newRoleName'
            },
            {
                message: "Please enter a salary for this new role:",
                type: 'input',
                name : 'newSalary'
            },
            {
                message: 'To which department will this new role belong?',
                type: 'list',
                name: 'newDeptRole',
                choices () {
                    const deptArray = [];
                    
                    results.forEach(({id, dept_name}) => {
                        deptArray.push(id+": "+dept_name);
                    });
                    return deptArray;
                }
            },
        ])

        .then ((answers) => {

            connection.query('SELECT * FROM position', (err, res) => {

                roleTitle = answers.newRoleName;
                roleSalary = answers.newSalary;
                roleDepartment = answers.newDeptRole;
                roleDepartmentIndex = parseInt(roleDepartment, 10);

                console.log('roleTitle: '+roleTitle);
                console.log('roleSalary: '+roleSalary);
                console.log('roleDepartmentIndex: '+roleDepartmentIndex);

                connection.query(`INSERT INTO position (title, salary, department_id) VALUES ("${roleTitle}", "${roleSalary}", "${roleDepartmentIndex}")`, (err, results) => {
                
                    console.log(res);
                    
                    console.log('----------------------------------------------------------');
                    console.log(`The role of ${roleTitle} has been added to the database.`)
                    console.log('----------------------------------------------------------');
                    mainPrompt();
                });
            })
        })
    })
}