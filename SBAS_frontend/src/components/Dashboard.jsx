import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [newEmployees, setNewEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'new'
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    locationId: 1,
    departmentId: 1,
    roleId: 2,
    isNew: true,
  });

  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, locRes, depRes, roleRes] = await Promise.all([
        employeeAPI.getAll(),
        employeeAPI.getLocations(),
        employeeAPI.getDepartments(),
        employeeAPI.getRoles(),
      ]);

      setEmployees(empRes.data?.data || []);
      setLocations(locRes.data?.data || []);
      setDepartments(depRes.data?.data || []);
      setRoles(roleRes.data?.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewEmployees = async () => {
    try {
      const res = await employeeAPI.getNew();
      setNewEmployees(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch new employees', err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await employeeAPI.create(formData);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        locationId: 1,
        departmentId: 1,
        roleId: 2,
        isNew: true,
      });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to add employee: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SBAS Employee Management</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Employees ({employees.length})
          </button>
          <button 
            className={`tab ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('new');
              fetchNewEmployees();
            }}
          >
            New Employees
          </button>
        </div>

        <div className="dashboard-actions">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add New Employee'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-employee-form">
            <h2>Add New Employee</h2>
            <form onSubmit={handleAddEmployee}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    value={formData.locationId}
                    onChange={(e) => setFormData({...formData, locationId: parseInt(e.target.value)})}
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.city || `Location ${loc.id}`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: parseInt(e.target.value)})}
                  >
                    {departments.map(dep => (
                      <option key={dep.id} value={dep.id}>{dep.name || `Department ${dep.id}`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={formData.roleId}
                    onChange={(e) => setFormData({...formData, roleId: parseInt(e.target.value)})}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name || `Role ${role.id}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary">Add Employee</button>
            </form>
          </div>
        )}

        <div className="employees-table">
          {activeTab === 'all' && (
            <>
              <h2>All Employees</h2>
              {employees.length === 0 ? (
                <p className="no-data">No employees found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.firstName} {emp.lastName}</td>
                        <td>{emp.email}</td>
                        <td>{emp.location || 'N/A'}</td>
                        <td>{emp.department || 'N/A'}</td>
                        <td>{emp.role || 'N/A'}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === 'new' && (
            <>
              <h2>New Employees to Register</h2>
              <p className="info-text">Employees marked as new and awaiting IT registration</p>
              {newEmployees.length === 0 ? (
                <p className="no-data">No new employees to register</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.firstName} {emp.lastName}</td>
                        <td>{emp.email}</td>
                        <td>{emp.location || 'N/A'}</td>
                        <td>{emp.department || 'N/A'}</td>
                        <td>{emp.role || 'N/A'}</td>
                        <td>
                          <button className="btn-secondary">Register</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
