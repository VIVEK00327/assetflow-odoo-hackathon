import React, { useState } from 'react';
import { 
  FiLock, 
  FiPlus, 
  FiX, 
  FiTrash2, 
  FiInfo 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getRequestConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export default function OrgSetup({ 
  isAdmin, 
  user,
  setActiveTab,
  departments = [], 
  setDepartments, 
  categories = [], 
  setCategories, 
  employees = [], 
  setEmployees 
}) {
  const [orgSubTab, setOrgSubTab] = useState('departments');
  const [showAddForm, setShowAddForm] = useState(false);

  // Department form state
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [newDeptParent, setNewDeptParent] = useState('');
  const [newDeptStatus, setNewDeptStatus] = useState('Active');

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatStatus, setNewCatStatus] = useState('Active');

  // Employee form state
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Employee');
  const [newEmpStatus, setNewEmpStatus] = useState('Active');

  if (!isAdmin) {
    return (
      <div className="glass rounded-xl p-8 border border-red-500/20 flex flex-col items-center text-center space-y-4">
        <FiLock className="w-12 h-12 text-red-400 animate-bounce" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-gray-400 max-w-md">
          Organization Setup is restricted to Admin accounts only. 
          Currently logged in user role is <strong className="text-white capitalize">{user.role}</strong>.
        </p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Deletion Actions
  const handleDeleteDept = async (id) => {
    try {
      await axios.delete(`${API_BASE}/departments/${id}`, getRequestConfig());
      setDepartments(departments.filter(d => d._id !== id));
      toast.success('Department deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE}/categories/${id}`, getRequestConfig());
      setCategories(categories.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_BASE}/employees/${id}`, getRequestConfig());
      setEmployees(employees.filter(e => e._id !== id));
      toast.success('Employee record removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove employee');
    }
  };

  // Form Submissions
  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDeptName || !newDeptHead) {
      toast.error('Department Name and Head are required');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/departments`, {
        name: newDeptName,
        head: newDeptHead,
        parentDept: newDeptParent || '--',
        status: newDeptStatus
      }, getRequestConfig());

      setDepartments([...departments, res.data]);
      setNewDeptName('');
      setNewDeptHead('');
      setNewDeptParent('');
      setNewDeptStatus('Active');
      setShowAddForm(false);
      toast.success(`Department "${res.data.name}" registered`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register department');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) {
      toast.error('Category Name and Code are required');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/categories`, {
        name: newCatName,
        code: newCatCode.toUpperCase(),
        status: newCatStatus
      }, getRequestConfig());

      setCategories([...categories, res.data]);
      setNewCatName('');
      setNewCatCode('');
      setNewCatStatus('Active');
      setShowAddForm(false);
      toast.success(`Category "${res.data.name}" added`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) {
      toast.error('Employee Name and Email are required');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/employees`, {
        name: newEmpName,
        email: newEmpEmail,
        role: newEmpRole,
        status: newEmpStatus
      }, getRequestConfig());

      setEmployees([...employees, res.data]);
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpRole('Employee');
      setNewEmpStatus('Active');
      setShowAddForm(false);
      toast.success(`Employee "${res.data.name}" added to directory`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register employee');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Organization setup</h2>
      </div>

      {/* Tab Controls and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex gap-2">
          {[
            { id: 'departments', label: 'Departments' },
            { id: 'categories', label: 'Categories' },
            { id: 'employees', label: 'Employees' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setOrgSubTab(tab.id); setShowAddForm(false); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                orgSubTab === tab.id 
                  ? 'bg-gray-800 text-white border border-gray-700' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-950/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-600/20 text-xs font-bold uppercase transition-all cursor-pointer"
        >
          <FiPlus />
          <span>Add {orgSubTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Add Entry Form Modal/Section */}
      {showAddForm && (
        <div className="glass rounded-xl p-5 border-2 border-violet-500/20 max-w-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">
              Add New {orgSubTab.slice(0, -1)}
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {orgSubTab === 'departments' && (
            <form onSubmit={handleAddDept} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Finance"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Department Head</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Connor"
                    value={newDeptHead}
                    onChange={(e) => setNewDeptHead(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Parent Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Operations"
                    value={newDeptParent}
                    onChange={(e) => setNewDeptParent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Status</label>
                  <select
                    value={newDeptStatus}
                    onChange={(e) => setNewDeptStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
                Save Department
              </button>
            </form>
          )}

          {orgSubTab === 'categories' && (
            <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tablets"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Category Code Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. TAB"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Status</label>
                <select
                  value={newCatStatus}
                  onChange={(e) => setNewCatStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
                Save Category
              </button>
            </form>
          )}

          {orgSubTab === 'employees' && (
            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Employee Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arthur Pendragon"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. arthur@company.com"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">System Role</label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Asset Manager">Asset Manager</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Status</label>
                  <select
                    value={newEmpStatus}
                    onChange={(e) => setNewEmpStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
                Register Employee
              </button>
            </form>
          )}
        </div>
      )}

      {/* Data Tables */}
      <div className="glass rounded-xl border border-gray-850 overflow-x-auto">
        {orgSubTab === 'departments' && (
          <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
            <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Head</th>
                <th className="px-5 py-3 font-semibold">Parent Dept</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {departments.map((dept) => (
                <tr key={dept._id || dept.id} className="hover:bg-white/5 transition-all">
                  <td className="px-5 py-3.5 font-bold text-white">{dept.name}</td>
                  <td className="px-5 py-3.5">{dept.head}</td>
                  <td className="px-5 py-3.5 text-gray-500">{dept.parentDept}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      dept.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => handleDeleteDept(dept._id || dept.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {orgSubTab === 'categories' && (
          <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
            <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Category Name</th>
                <th className="px-5 py-3 font-semibold">Code Prefix</th>
                <th className="px-5 py-3 font-semibold">Tracked Assets</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {categories.map((cat) => (
                <tr key={cat._id || cat.id} className="hover:bg-white/5 transition-all">
                  <td className="px-5 py-3.5 font-bold text-white">{cat.name}</td>
                  <td className="px-5 py-3.5 font-mono text-violet-400">{cat.code}</td>
                  <td className="px-5 py-3.5">{cat.totalCount} items</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => handleDeleteCategory(cat._id || cat.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {orgSubTab === 'employees' && (
          <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
            <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">System Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {employees.map((emp) => (
                <tr key={emp._id || emp.id} className="hover:bg-white/5 transition-all">
                  <td className="px-5 py-3.5 font-bold text-white">{emp.name}</td>
                  <td className="px-5 py-3.5">{emp.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => handleDeleteEmployee(emp._id || emp.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Note from Mockup */}
      <div className="flex items-center gap-2 text-xs text-gray-400 italic">
        <FiInfo className="text-violet-400 w-4 h-4" />
        <span>Editing a department here also drives the picklist in Screen 4 & 5.</span>
      </div>
    </div>
  );
}
