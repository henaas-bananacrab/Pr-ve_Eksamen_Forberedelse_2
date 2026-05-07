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
    updatedEmployee,
    deleteEmployeeInfo
} = require('../controller/employeeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateEmployeeCreation, validateUpdateRole } = require('../middleware/validationMiddleware');

const router = express.Router();

// GET /employees (requires authentication only, any authenticated user)
router.get('/employees', authenticateToken, fetchEmployees);

// GET /employees/new (requires authentication only, any authenticated user)
router.get('/employees/new', authenticateToken, authorizeRoles("admin", "management"), fetchNewEmployees);

// GET /employees/:id (requires authentication only, any authenticated user)
router.get('/employees/:id', authenticateToken, fetchEmployeeById);

// GET /locations (public - needed for registration)
router.get('/locations', fetchLocations);

// GET /departments (public - needed for registration)
router.get('/departments', fetchDepartments);

// GET /roles (public - needed for registration)
router.get('/roles', fetchRoles);

// POST /employees (requires admin or management role)
router.post('/employees', authenticateToken, authorizeRoles("admin", "management"), validateEmployeeCreation, addEmployee);

// PUT /employees/:id/role (requires admin or management role)
router.put('/employees/:id/role', authenticateToken, authorizeRoles("admin", "management"), validateUpdateRole, updateRole);

// DELETE /employees/:id (requires admin or management role)
router.delete('/employees/:id', authenticateToken, authorizeRoles("admin", "management"), deleteEmployeeInfo);

// PUT /employees/:id (requires admin or management role)
router.put('/employees/:id', authenticateToken, authorizeRoles("admin", "management"), updatedEmployee);

module.exports = router;