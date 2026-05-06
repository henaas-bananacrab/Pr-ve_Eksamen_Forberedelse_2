const express = require('express');

const {
    fetchEmployees,
    fetchNewEmployees,
    fetchEmployeeById,
    fetchLocations,
    fetchDepartments,
    fetchRoles,
    addEmployee,
    updateRole,
    deleteEmployeeInfo
} = require('../controller/employeeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateEmployeeCreation, validateUpdateRole } = require('../middleware/validationMiddleware');

const router = express.Router();

// GET /employees?role=&department=&location=&new=true
router.get('/employees', authenticateToken, authorizeRoles(['admin', 'manager']), fetchEmployees);

// GET /employees/new
router.get('/employees/new', authenticateToken, authorizeRoles(['admin', 'manager']), fetchNewEmployees);

// GET /employees/:id
router.get('/employees/:id', authenticateToken, authorizeRoles(['admin', 'manager']), fetchEmployeeById);

// GET /locations
router.get('/locations', authenticateToken, authorizeRoles(['admin', 'manager']), fetchLocations);

// GET /departments
router.get('/departments', authenticateToken, authorizeRoles(['admin', 'manager']), fetchDepartments);

// GET /roles
router.get('/roles', authenticateToken, authorizeRoles(['admin', 'manager']), fetchRoles);

// POST /employees
router.post('/employees', authenticateToken, authorizeRoles(['admin', 'manager']), validateEmployeeCreation, addEmployee);

// PUT /employees/:id/role
router.put('/employees/:id/role', authenticateToken, authorizeRoles(['admin', 'manager']), validateUpdateRole, updateRole);

// DELETE /employees/:id
router.delete('/employees/:id', authenticateToken, authorizeRoles(['admin', 'manager']), deleteEmployeeInfo);

module.exports = router;