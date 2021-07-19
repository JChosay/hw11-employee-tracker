-- Without a WHERE
SELECT 
	employee.id,
    employee.first_name,
    employee.last_name,
    position.title,
    department.dept_name,
    position.salary,
    employee.manager_id
FROM position
JOIN employee
ON employee.role_id = position.id
Join department
ON position.department_id = department.id;

-- one-line version:
SELECT employee.id, employee.first_name, employee.last_name, position.title, department.dept_name, position.salary, employee.manager_id FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id;

-- With a WHERE
SELECT 
	employee.id,
    employee.first_name,
    employee.last_name,
    position.title,
    department.dept_name,
    position.salary,
    employee.manager_id
FROM position
JOIN employee
ON employee.role_id = position.id
Join department
ON position.department_id = department.id
WHERE department.dept_name = 'Sales'

-- one-line version:
SELECT employee.id, employee.first_name, employee.last_name, position.title, department.dept_name, position.salary, employee.manager_id FROM position JOIN employee ON employee.role_id = position.id Join department ON position.department_id = department.id WHERE department.dept_name = 'Sales';