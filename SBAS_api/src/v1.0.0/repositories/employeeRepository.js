const db = require('../database/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function existsInTable(table, idColumn, id) {
    const [result] = await db.execute(`SELECT 1 FROM ${table} WHERE ${idColumn} = ? LIMIT 1`, [id]);
    return result.length > 0;
}

const EMPLOYEE_SELECT = `SELECT e.employee_id,
       e.name,
       e.email,
       l.location AS location,
       d.department AS department,
       r.role AS role
FROM employee e
JOIN location l ON e.location_id = l.location_id
JOIN department d ON e.department_id = d.department_id
JOIN role r ON e.role_id = r.role_id`;

async function getEmployees() {
    try {
        let sql = EMPLOYEE_SELECT;
        
        const [result] = await db.execute(sql);

        return result;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
}

async function getEmployeeById(employeeId) {
    try {
        const [result] = await db.execute(
            `${EMPLOYEE_SELECT} WHERE e.employee_id = ?`,
            [employeeId]
        );

        return result[0];
    } catch (error) {
        console.error('Error fetching employee by id:', error);
        throw error;
    }
}

async function getLocations() {
    try {
        const [result] = await db.execute('SELECT location_id, location FROM location');
        return result;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

async function getDepartments() {
    try {
        const [result] = await db.execute('SELECT department_id, department FROM department');
        return result;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
}

async function getRoles() {
    try {
        const [result] = await db.execute('SELECT role_id, role FROM role');
        return result;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

async function registerEmployee(employeeData) {
    try {
        const { name, email, password, role_id, department_id, location_id } = employeeData;
        const [existing] = await db.execute('SELECT employee_id FROM employee WHERE email = ?', [email]);

        if (existing.length > 0) {
            const error = new Error('Email already exists');
            error.code = 'EMAIL_EXISTS';
            throw error;
        }

        if (!(await existsInTable('role', 'role_id', role_id))) {
            const error = new Error('Invalid role_id');
            error.code = 'INVALID_ROLE';
            throw error;
        }

        if (!(await existsInTable('department', 'department_id', department_id))) {
            const error = new Error('Invalid department_id');
            error.code = 'INVALID_DEPARTMENT';
            throw error;
        }

        if (!(await existsInTable('location', 'location_id', location_id))) {
            const error = new Error('Invalid location_id');
            error.code = 'INVALID_LOCATION';
            throw error;
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.execute(
            'INSERT INTO employee (name, email, password, role_id, department_id, location_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashed, role_id, department_id, location_id]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error registering employee:', error);
        throw error;
    }
}

async function loginEmployee(email) {
    try {
        const [result] = await db.execute(
            `SELECT e.employee_id, e.name, e.email, e.password, r.role, e.role_id
             FROM employee e
             JOIN role r ON e.role_id = r.role_id
             WHERE e.email = ?`,
            [email]
        );

        return result[0];
    } catch (error) {
        console.error('Error logging in employee:', error);
        throw error;
    }
}

async function getRoleNameById(roleId) {
    try {
        const [result] = await db.execute('SELECT role FROM role WHERE role_id = ?', [roleId]);
        return result[0] ? result[0].role : null;
    } catch (error) {
        console.error('Error fetching role by id:', error);
        throw error;
    }
}

async function updateEmployeeRole(employeeId, employeeData) {
    try {
        const { role_id } = employeeData;

        if (!(await existsInTable('role', 'role_id', role_id))) {
            const error = new Error('Invalid role_id');
            error.code = 'INVALID_ROLE';
            throw error;
        }

        const [result] = await db.execute(
            'UPDATE employee SET role_id = ? WHERE employee_id = ?',
            [role_id, employeeId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating employee role:', error);
        throw error;
    }
}

async function deleteEmployee(employeeId) {
    try {
        const [result] = await db.execute(
            'DELETE FROM employee WHERE employee_id = ?',
            [employeeId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

async function updateEmployee(employeeId, leaving) {
    try {
        const [result] = await db.execute(
            'UPDATE employee SET leaving = ? WHERE employee_id = ?',
            [leaving, employeeId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

module.exports = {
    getEmployees,
    getEmployeeById,
    getLocations,
    getDepartments,
    getRoles,
    registerEmployee,
    loginEmployee,
    getRoleNameById,
    updateEmployeeRole,
    deleteEmployee,
    updateEmployee
};