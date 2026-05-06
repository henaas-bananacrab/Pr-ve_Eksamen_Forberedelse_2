function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPositiveInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
}

function validateEmployeeCreation(req, res, next) {
    const { name, email, password, role_id, department_id, location_id } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 45) {
        errors.push('name is required and must be 1-45 characters');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('email is required and must be a valid email address');
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
        errors.push('password is required and must be at least 8 characters');
    }

    if (!isPositiveInteger(role_id)) {
        errors.push('role_id is required and must be a positive integer');
    }

    if (!isPositiveInteger(department_id)) {
        errors.push('department_id is required and must be a positive integer');
    }

    if (!isPositiveInteger(location_id)) {
        errors.push('location_id is required and must be a positive integer');
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    next();
}

function validateUpdateRole(req, res, next) {
    const { role_id } = req.body;

    if (!isPositiveInteger(role_id)) {
        return res.status(400).json({ success: false, errors: ['role_id is required and must be a positive integer'] });
    }

    next();
}

module.exports = {
    validateEmployeeCreation,
    validateUpdateRole
};