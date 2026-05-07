const { getEmployees, getEmployeeById, getLocations, getDepartments, getRoles, registerEmployee, updateEmployeeRole, deleteEmployee, updateEmployee } = require('../repositories/employeeRepository');

const fetchEmployees = async (req, res) => {
    console.log("Test0");
    try {
        console.log("Test1");
        const employees = await getEmployees();
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch employees' });
    }
};

const fetchNewEmployees = async (req, res) => {
    try {
        const filters = {
            newHires: true,
            limit: parseInt(req.query.limit, 10) || 10
        };

        const employees = await getEmployees(filters);
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Failed to fetch new employees:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch new employees' });
    }
};

const fetchEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await getEmployeeById(id);

        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error('Failed to fetch employee by id:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch employee' });
    }
};

const fetchLocations = async (req, res) => {
    try {
        const locations = await getLocations();
        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch locations' });
    }
};

const fetchDepartments = async (req, res) => {
    try {
        const departments = await getDepartments();
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch departments' });
    }
};

const fetchRoles = async (req, res) => {
    try {
        const roles = await getRoles();
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch roles' });
    }
};

const addEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        const employeeId = await registerEmployee(employeeData);

        res.status(201).json({ success: true, data: { id: employeeId } });
    } catch (error) {
        console.error('Failed to register employee:', error);

        if (error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        res.status(500).json({ success: false, error: 'Failed to register employee' });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_id } = req.body;
        const updated = await updateEmployeeRole(id, { role_id });

        if (!updated) {
            return res.status(404).json({ success: false, error: 'Employee not found or role not updated' });
        }

        res.status(200).json({ success: true, updated });
    } catch (error) {
        console.error('Failed to update employee role:', error);
        res.status(500).json({ success: false, error: 'Failed to update employee role' });
    }
};

const deleteEmployeeInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteEmployee(id);

        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        res.status(200).json({ success: true, deleted });
    } catch (error) {
        console.error('Failed to delete employee:', error);
        res.status(500).json({ success: false, error: 'Failed to delete employee' });
    }
};

const updatedEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { leaving } = req.body;
        const updated = await updateEmployee(id, leaving);

        if (!updated) {
            return res.status(404).json({ success: false, error: 'Employee not found or not updated' });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error('Failed to update employee:', error);
        res.status(500).json({ success: false, error: 'Failed to update employee' });
    }
};

module.exports = {
    fetchEmployees,
    fetchNewEmployees,
    fetchEmployeeById,
    fetchLocations,
    fetchDepartments,
    fetchRoles,
    addEmployee,
    updateRole,
    deleteEmployeeInfo,
    updatedEmployee
};
