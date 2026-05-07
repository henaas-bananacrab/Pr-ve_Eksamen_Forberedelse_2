const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const { registerEmployee, loginEmployee, getRoleNameById } = require('../repositories/employeeRepository');

const register = async (req, res) => {
    try {
        const employeeData = req.body;
        const employeeId = await registerEmployee(employeeData);
        const roleName = await getRoleNameById(employeeData.role_id);

        const token = jwt.sign({ id: employeeId, role: roleName }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error('Failed to register employee:', error);

        if (error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        res.status(500).json({ error: 'Failed to register employee' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await loginEmployee(email);

        console.log("Employee fetched for login:", employee);

        if (!employee) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, employee.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        

        const token = jwt.sign({ id: employee.employee_id, role: employee.role }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Failed to login employee:', error);
        res.status(500).json({ error: 'Failed to login employee' });
    }
};

module.exports = {
    register,
    login
};