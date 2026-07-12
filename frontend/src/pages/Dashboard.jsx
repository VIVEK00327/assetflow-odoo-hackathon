import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, 
  FiUser, 
  FiShield, 
  FiGrid, 
  FiSettings, 
  FiFolder, 
  FiActivity,
  FiHome,
  FiDatabase,
  FiUsers,
  FiShuffle,
  FiCalendar,
  FiTool,
  FiCheckSquare,
  FiBarChart2,
  FiBell,
  FiLock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiAlertTriangle,
  FiInfo,
  FiTrash2,
  FiMenu,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Retrieve user details from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { email: 'guest@assetflow.com', role: 'Employee' };
  const isAdmin = user.role?.toLowerCase() === 'admin';

  // Dynamic States loaded from Backend
  const [orgSubTab, setOrgSubTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([]);

  // Form states for additions
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [newDeptParent, setNewDeptParent] = useState('');
  const [newDeptStatus, setNewDeptStatus] = useState('Active');

  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatStatus, setNewCatStatus] = useState('Active');

  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Employee');
  const [newEmpStatus, setNewEmpStatus] = useState('Active');

  // State for Assets Search/Filter/Form
  const [searchAssetQuery, setSearchAssetQuery] = useState('');
  const [filterAssetCategory, setFilterAssetCategory] = useState('');
  const [filterAssetStatus, setFilterAssetStatus] = useState('');
  const [showRegisterAssetForm, setShowRegisterAssetForm] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Laptops');
  const [newAssetStatus, setNewAssetStatus] = useState('Available');

  // State for Bookings Form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingResource, setBookingResource] = useState('Conference Room B2');
  const [bookingTime, setBookingTime] = useState('9:00 AM - 10:00 AM');
  const [bookingDate, setBookingDate] = useState('Today');

  // State for Allocations & Transfers Form
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferAsset, setTransferAsset] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferReason, setTransferReason] = useState('Project Assignment');

  // State for Maintenance requests Form
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintAsset, setMaintAsset] = useState('');
  const [maintIssue, setMaintIssue] = useState('Overheating during extended use');
  const [maintPriority, setMaintPriority] = useState('Medium');

  // Fetch all data from backend
  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // 1. Fetch Assets
      const assetsRes = await axios.get(`${API_BASE}/assets`, config);
      setAssets(assetsRes.data);
      if (assetsRes.data.length > 0) {
        // Prefill default dropdown value for transfers/maintenance
        setTransferAsset(assetsRes.data.find(a => a.status === 'Allocated')?.tag || assetsRes.data[0].tag);
        setMaintAsset(assetsRes.data[0].tag);
      }

      // 2. Fetch Bookings
      const bookingsRes = await axios.get(`${API_BASE}/bookings`, config);
      setBookings(bookingsRes.data);

      // 3. Fetch Transfers
      const transfersRes = await axios.get(`${API_BASE}/transfers`, config);
      setTransfers(transfersRes.data);

      // 4. Fetch Maintenance tickets
      const maintRes = await axios.get(`${API_BASE}/maintenance`, config);
      setMaintenanceTickets(maintRes.data);

      // 5. Fetch Categories
      const catsRes = await axios.get(`${API_BASE}/categories`, config);
      setCategories(catsRes.data);
      if (catsRes.data.length > 0) {
        setNewAssetCategory(catsRes.data[0].name);
      }

      // 6. Fetch Departments
      const deptsRes = await axios.get(`${API_BASE}/departments`, config);
      setDepartments(deptsRes.data);

      // 7. Fetch Employees
      const empsRes = await axios.get(`${API_BASE}/employees`, config);
      setEmployees(empsRes.data);
      if (empsRes.data.length > 0) {
        setTransferTo(empsRes.data[0].name);
      }

    } catch (error) {
      console.error('Error loading data from backend APIs:', error);
      toast.error('Failed to connect to backend service. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Helper auth request headers
  const getRequestConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  // Quick Action Redirects
  const handleActionRegisterAsset = () => {
    setActiveTab('assets');
    setShowRegisterAssetForm(true);
  };
  const handleActionBookResource = () => {
    setActiveTab('booking');
    setShowBookingForm(true);
  };
  const handleActionRaiseRequests = () => {
    setActiveTab('allocation');
    setShowTransferForm(true);
  };

  // Add Item Handlers
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

  // Add Asset Handler
  const handleRegisterAsset = async (e) => {
    e.preventDefault();
    if (!newAssetName || !newAssetTag) {
      toast.error('Asset Name and Tag/Serial are required');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/assets`, {
        name: newAssetName,
        tag: newAssetTag,
        category: newAssetCategory,
        status: newAssetStatus
      }, getRequestConfig());

      setAssets([res.data, ...assets]);
      setNewAssetName('');
      setNewAssetTag('');
      setShowRegisterAssetForm(false);
      toast.success(`Asset "${res.data.name}" registered successfully`);
      
      // Reload categories to update count
      const catsRes = await axios.get(`${API_BASE}/categories`, getRequestConfig());
      setCategories(catsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register asset');
    }
  };

  // Add Booking Handler
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/bookings`, {
        resource: bookingResource,
        time: bookingTime,
        date: bookingDate
      }, getRequestConfig());

      setBookings([res.data, ...bookings]);
      setShowBookingForm(false);
      toast.success(`Booking confirmed for ${res.data.resource}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book resource');
    }
  };

  // Add Transfer Handler
  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (!transferAsset) {
      toast.error('No asset selected');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/transfers`, {
        assetTag: transferAsset,
        to: transferTo,
        reason: transferReason
      }, getRequestConfig());

      setTransfers([res.data, ...transfers]);
      setShowTransferForm(false);
      toast.success('Asset transfer request initiated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit transfer request');
    }
  };

  // Add Maintenance Handler
  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    if (!maintAsset) {
      toast.error('No asset selected');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/maintenance`, {
        assetTag: maintAsset,
        issue: maintIssue,
        priority: maintPriority
      }, getRequestConfig());

      setMaintenanceTickets([res.data, ...maintenanceTickets]);
      setShowMaintenanceForm(false);
      toast.success('Maintenance ticket submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report maintenance');
    }
  };

  // Delete Action Handlers
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

  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`${API_BASE}/assets/${id}`, getRequestConfig());
      setAssets(assets.filter(a => a._id !== id));
      toast.success('Asset registration deleted');
      
      // Reload categories to update count
      const catsRes = await axios.get(`${API_BASE}/categories`, getRequestConfig());
      setCategories(catsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete asset');
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE}/bookings/${id}`, getRequestConfig());
      setBookings(bookings.filter(b => b._id !== id));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  // Render Sub-Views
  const renderDashboardHome = () => {
    const availableAssets = assets.filter(a => a.status === 'Available').length;
    const allocatedAssets = assets.filter(a => a.status === 'Allocated').length;
    const reservedAssets = assets.filter(a => a.status === 'Reserved').length;
    const pendingTransfers = transfers.filter(t => t.status === 'Pending Approval').length;

    return (
      <div className="space-y-6">
        {/* Overview Subtitle */}
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Today's Overview</h2>
        </div>

        {/* Grid of 6 Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Available', value: availableAssets, color: 'border-emerald-500/30 text-emerald-400' },
            { label: 'Allocated', value: allocatedAssets, color: 'border-violet-500/30 text-violet-400' },
            { label: 'Reserved', value: reservedAssets, color: 'border-blue-500/30 text-blue-400' },
            { label: 'Active Bookings', value: bookings.length, color: 'border-sky-500/30 text-sky-400' },
            { label: 'Pending Transfers', value: pendingTransfers, color: 'border-amber-500/30 text-amber-400' },
            { label: 'Upcoming returns', value: 12, color: 'border-pink-500/30 text-pink-400' }
          ].map((card, i) => (
            <div key={i} className={`glass rounded-xl p-4 flex flex-col justify-between border ${card.color} hover:scale-[1.02] transition-transform duration-200`}>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</span>
              <span className="text-3xl font-black mt-2">{card.value}</span>
            </div>
          ))}
        </div>

        {/* Red Alert Banner */}
        <div className="bg-red-500/10 border-2 border-red-500/25 rounded-xl px-4 py-3 flex items-center gap-3">
          <FiAlertTriangle className="text-red-400 shrink-0 w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold text-red-300">
            3 assets overdue for return - flagged for follow-up
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleActionRegisterAsset}
            className="py-3 px-4 rounded-xl border-2 border-gray-800 hover:border-violet-500/50 bg-gray-950/20 text-gray-200 hover:text-white hover:bg-violet-600/10 font-bold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiPlus />
            <span>Register Asset</span>
          </button>
          <button
            onClick={handleActionBookResource}
            className="py-3 px-4 rounded-xl border-2 border-gray-800 hover:border-blue-500/50 bg-gray-950/20 text-gray-200 hover:text-white hover:bg-blue-600/10 font-bold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiCalendar />
            <span>Book Resource</span>
          </button>
          <button
            onClick={handleActionRaiseRequests}
            className="py-3 px-4 rounded-xl border-2 border-gray-800 hover:border-emerald-500/50 bg-gray-950/20 text-gray-200 hover:text-white hover:bg-emerald-600/10 font-bold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiShuffle />
            <span>Raise Requests</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-5 border border-gray-800/80 space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <FiActivity className="text-violet-400" />
            Recent Activity
          </h3>
          <div className="space-y-3 font-mono text-sm text-gray-300 pl-1">
            <div className="border-l-2 border-violet-500/40 pl-3.5 py-0.5">
              Laptop AF-0114 - allocated to Priya Shah - IT Dept
            </div>
            <div className="border-l-2 border-blue-500/40 pl-3.5 py-0.5">
              Room B2 - booking confirmed - 2:00 to 3:00 PM
            </div>
            <div className="border-l-2 border-emerald-500/40 pl-3.5 py-0.5">
              Projector AF-0062 - maintenance resolved
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrgSetup = () => {
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
                        onClick={() => handleDeleteDept(dept._id)}
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
                        onClick={() => handleDeleteCategory(cat._id)}
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
                        onClick={() => handleDeleteEmployee(emp._id)}
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
  };

  const renderAssets = () => {
    // Filtered assets
    const filteredAssets = assets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchAssetQuery.toLowerCase()) || 
                            asset.tag.toLowerCase().includes(searchAssetQuery.toLowerCase());
      const matchesCategory = filterAssetCategory === '' || asset.category === filterAssetCategory;
      const matchesStatus = filterAssetStatus === '' || asset.status === filterAssetStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Assets Inventory</h2>
          <button
            onClick={() => setShowRegisterAssetForm(!showRegisterAssetForm)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-violet-500/30 text-violet-400 hover:text-white hover:bg-violet-600/20 text-xs font-bold uppercase transition-all cursor-pointer"
          >
            <FiPlus />
            <span>Register Asset</span>
          </button>
        </div>

        {/* Register Asset In-line Form */}
        {showRegisterAssetForm && (
          <div className="glass rounded-xl p-5 border-2 border-violet-500/20 max-w-lg animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">Register Physical Asset</h3>
              <button onClick={() => setShowRegisterAssetForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Asset Name</label>
                  <input
                    type="text"
                    placeholder="e.g. iPad Pro 12.9"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Serial/Asset Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. AF-0941"
                    value={newAssetTag}
                    onChange={(e) => setNewAssetTag(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none"
                  >
                    {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider">Initial Status</label>
                  <select
                    value={newAssetStatus}
                    onChange={(e) => setNewAssetStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
                Save Asset Registration
              </button>
            </form>
          </div>
        )}

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tag, serial, or name..."
              value={searchAssetQuery}
              onChange={(e) => setSearchAssetQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-950/40 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="relative">
            <FiFilter className="absolute left-3.5 top-3 text-gray-500 w-4 h-4" />
            <select
              value={filterAssetCategory}
              onChange={(e) => setFilterAssetCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-950/40 border border-gray-800 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-violet-500"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="relative">
            <FiActivity className="absolute left-3.5 top-3 text-gray-500 w-4 h-4" />
            <select
              value={filterAssetStatus}
              onChange={(e) => setFilterAssetStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-950/40 border border-gray-800 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-violet-500"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        {/* Assets List */}
        <div className="glass rounded-xl border border-gray-850 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
            <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Asset Name</th>
                <th className="px-5 py-3 font-semibold">Asset Tag</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Current Holder</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {filteredAssets.map((asset) => (
                <tr key={asset._id || asset.tag} className="hover:bg-white/5 transition-all">
                  <td className="px-5 py-3.5 font-bold text-white">{asset.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-violet-400">{asset.tag}</td>
                  <td className="px-5 py-3.5 text-gray-400">{asset.category}</td>
                  <td className="px-5 py-3.5 text-gray-400">{asset.holder}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      asset.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : asset.status === 'Allocated'
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => handleDeleteAsset(asset._id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 text-xs italic">
                    No registered assets match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Resource Bookings</h2>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600/20 text-xs font-bold uppercase transition-all cursor-pointer"
        >
          <FiPlus />
          <span>New Reservation</span>
        </button>
      </div>

      {showBookingForm && (
        <div className="glass rounded-xl p-5 border-2 border-blue-500/20 max-w-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">Book Shared Space / Asset</h3>
            <button onClick={() => setShowBookingForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateBooking} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-wider">Resource / Space</label>
              <select
                value={bookingResource}
                onChange={(e) => setBookingResource(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
              >
                <option value="Conference Room B2">Conference Room B2</option>
                <option value="Board Room C4">Board Room C4</option>
                <option value="Epson Projector 4K">Epson Projector 4K (AV-0062)</option>
                <option value="Hot Desk 12">Hot Desk 12</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Booking Date</label>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Next Monday">Next Monday</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 2:00 PM - 3:00 PM"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
              Confirm Resource Booking
            </button>
          </form>
        </div>
      )}

      {/* Bookings List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookings.map((b) => (
          <div key={b._id || b.id} className="glass rounded-xl p-5 border border-gray-850 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{b.date} • {b.time}</span>
              <h3 className="text-base font-bold text-white mt-1.5">{b.resource}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Reserved by: {b.user}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => handleDeleteBooking(b._id)}
                className="text-xs text-red-400 hover:text-red-300 font-bold uppercase transition-colors cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAllocations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Allocations & Transfers</h2>
        <button
          onClick={() => setShowTransferForm(!showTransferForm)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-600/20 text-xs font-bold uppercase transition-all cursor-pointer"
        >
          <FiShuffle />
          <span>Request Transfer</span>
        </button>
      </div>

      {showTransferForm && (
        <div className="glass rounded-xl p-5 border-2 border-emerald-500/20 max-w-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">Request Asset Transfer</h3>
            <button onClick={() => setShowTransferForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Select Asset</label>
                <select
                  value={transferAsset}
                  onChange={(e) => setTransferAsset(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                >
                  {assets.filter(a => a.status === 'Allocated').map(a => (
                    <option key={a.tag} value={a.tag}>{a.name} ({a.tag})</option>
                  ))}
                  {assets.filter(a => a.status === 'Allocated').length === 0 && (
                    <option value="">No allocated assets available</option>
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Transfer To (Employee)</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                >
                  {employees.map(e => <option key={e._id || e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-wider">Reason for Transfer</label>
              <textarea
                rows="2"
                placeholder="Reason for allocating this asset to another department/employee..."
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-605 hover:bg-emerald-500 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer transition-colors">
              Submit Transfer Request
            </button>
          </form>
        </div>
      )}

      {/* Transfer History Table */}
      <div className="glass rounded-xl border border-gray-850 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
          <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-5 py-3 font-semibold">Asset Tag</th>
              <th className="px-5 py-3 font-semibold">From</th>
              <th className="px-5 py-3 font-semibold">Transfer To</th>
              <th className="px-5 py-3 font-semibold">Request Date</th>
              <th className="px-5 py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-850">
            {transfers.map((t) => (
              <tr key={t._id || t.id} className="hover:bg-white/5 transition-all">
                <td className="px-5 py-3.5 font-mono text-violet-400 font-semibold">{t.assetTag}</td>
                <td className="px-5 py-3.5">{t.from}</td>
                <td className="px-5 py-3.5 font-bold text-white">{t.to}</td>
                <td className="px-5 py-3.5 text-gray-400">{t.date}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                    t.status === 'Approved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Maintenance Requests</h2>
        <button
          onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-amber-500/30 text-amber-400 hover:text-white hover:bg-amber-600/20 text-xs font-bold uppercase transition-all cursor-pointer"
        >
          <FiTool />
          <span>Report Issue</span>
        </button>
      </div>

      {showMaintenanceForm && (
        <div className="glass rounded-xl p-5 border-2 border-amber-500/20 max-w-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">Report Hardware Issue</h3>
            <button onClick={() => setShowMaintenanceForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Affected Asset</label>
                <select
                  value={maintAsset}
                  onChange={(e) => setMaintAsset(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                >
                  {assets.map(a => (
                    <option key={a._id || a.tag} value={a.tag}>{a.name} ({a.tag})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-wider">Priority Level</label>
                <select
                  value={maintPriority}
                  onChange={(e) => setMaintPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white"
                >
                  <option value="Low">Low (Fittings, non-disruptive)</option>
                  <option value="Medium">Medium (Regular repairs)</option>
                  <option value="High">High (Disruptive, blocks work)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-wider">Description of Problem</label>
              <textarea
                rows="3"
                placeholder="Describe what is broken or malfunctioning..."
                value={maintIssue}
                onChange={(e) => setMaintIssue(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950/40 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold cursor-pointer transition-colors">
              Submit Repair Ticket
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="glass rounded-xl border border-gray-850 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
          <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-5 py-3 font-semibold">Asset Tag</th>
              <th className="px-5 py-3 font-semibold">Reported Issue</th>
              <th className="px-5 py-3 font-semibold">Priority</th>
              <th className="px-5 py-3 font-semibold text-right">Ticket Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-850">
            {maintenanceTickets.map((t) => (
              <tr key={t._id || t.id} className="hover:bg-white/5 transition-all">
                <td className="px-5 py-3.5 font-mono text-violet-400 font-semibold">{t.assetTag}</td>
                <td className="px-5 py-3.5 text-white">{t.issue}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Structured Asset Audits</h2>
      <div className="glass rounded-xl p-6 border border-gray-850 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/25 px-2 py-0.5 rounded-full">Active Cycle</span>
          <span className="text-xs text-gray-500">Deadline: 14 Days Remaining</span>
        </div>
        <h3 className="text-lg font-bold text-white">Q3 Mid-Year Asset Reconciliation</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Verification is ongoing for physical items in the IT, Engineering, and Facilities departments. 
          Auditors are validating actual item presence against registers.
        </p>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-300">
            <span>Cycle Audit Progress</span>
            <span>68% (310 / 456 Items Checked)</span>
          </div>
          <div className="w-full h-2 bg-gray-950/60 rounded-full overflow-hidden border border-gray-800">
            <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 w-[68%]" />
          </div>
        </div>

        {/* Audit Discrepancy warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 text-xs text-amber-300">
          <FiAlertTriangle className="shrink-0 w-4 h-4" />
          <span><strong>2 Discrepancies reported:</strong> Two high-end laptops in Field Ops (East) were not found during visual audit. Discrepancy logs dispatched to manager.</span>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Operational Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5 border border-gray-850">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Asset Categories Ratio</h3>
          <div className="h-[200px] flex items-center justify-center border border-dashed border-gray-800 rounded-lg text-gray-500 text-xs font-semibold">
            [Chart Placeholder: Laptops 40% | Monitors 25% | Furniture 35%]
          </div>
        </div>
        <div className="glass rounded-xl p-5 border border-gray-850">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Maintenance Spend Index</h3>
          <div className="h-[200px] flex items-center justify-center border border-dashed border-gray-800 rounded-lg text-gray-500 text-xs font-semibold">
            [Chart Placeholder: Monthly Repair Cost Trendline]
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">System Alerts & Notifications</h2>
      <div className="space-y-3">
        {[
          { id: 1, title: 'Overdue Asset Notification', text: 'MacBook Air AF-0814 has not been returned by due date. Flagged.', type: 'alert' },
          { id: 2, title: 'Transfer Completed', text: 'Asset tag AF-0912 transferred from Self to Aditi Rao.', type: 'info' },
          { id: 3, title: 'Booking Approved', text: 'Your booking reservation for Conference Room B2 is confirmed.', type: 'success' }
        ].map((n) => (
          <div key={n.id} className="glass rounded-xl p-4 border border-gray-850 flex gap-3 text-sm">
            {n.type === 'alert' ? (
              <FiAlertTriangle className="text-red-400 shrink-0 w-5 h-5" />
            ) : (
              <FiInfo className="text-violet-400 shrink-0 w-5 h-5" />
            )}
            <div>
              <h4 className="font-bold text-white">{n.title}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{n.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getActiveViewContent = () => {
    if (loading) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Syncing operational data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboardHome();
      case 'org-setup':
        return renderOrgSetup();
      case 'assets':
        return renderAssets();
      case 'allocation':
        return renderAllocations();
      case 'booking':
        return renderBookings();
      case 'maintenance':
        return renderMaintenance();
      case 'audit':
        return renderAudit();
      case 'reports':
        return renderReports();
      case 'notifications':
        return renderNotifications();
      default:
        return renderDashboardHome();
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'asset manager':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'department head':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    ...(isAdmin ? [{ id: 'org-setup', label: 'Organization setup', icon: FiSettings }] : []),
    { id: 'assets', label: 'Assets', icon: FiDatabase },
    { id: 'allocation', label: 'Allocation & Transfer', icon: FiShuffle },
    { id: 'booking', label: 'Resource Booking', icon: FiCalendar },
    { id: 'maintenance', label: 'Maintenance', icon: FiTool },
    { id: 'audit', label: 'Audit', icon: FiCheckSquare },
    { id: 'reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col lg:flex-row select-none">
      
      {/* Mobile Header Bar */}
      <header className="lg:hidden w-full glass border-b border-white/5 py-4 px-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center font-bold text-white text-sm">
            AF
          </div>
          <span className="text-base font-extrabold tracking-tight text-white m-0">
            Asset<span className="text-violet-400">Flow</span>
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-[280px] shrink-0 glass lg:border-r border-white/5 flex flex-col justify-between fixed lg:static top-[65px] bottom-0 left-0 transition-transform duration-300 z-20 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          
          {/* Logo Header (Hidden on Mobile header) */}
          <div className="hidden lg:flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/25">
              AF
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white m-0">
                Asset<span className="text-violet-400">Flow</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Enterprise Manager</p>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group text-left border ${
                    isActive
                      ? 'bg-gray-800/80 border-gray-700 text-white shadow-md'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-950/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-violet-400' : 'text-gray-500'
                  }`} />
                  
                  <span className="truncate flex-1">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout bottom */}
        <div className="border-t border-white/5 p-4 space-y-4 bg-gray-950/20">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/25 flex items-center justify-center font-bold">
              <FiUser className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate m-0">{user.email}</p>
              <span className={`inline-block text-[9px] px-2 py-0.2 rounded-full uppercase font-bold tracking-wider mt-0.5 ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-850 hover:bg-red-950/20 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all text-xs font-bold uppercase cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 lg:max-h-screen lg:overflow-y-auto mt-[60px] lg:mt-0">
        <div className="max-w-6xl w-full mx-auto animate-fadeIn">
          {getActiveViewContent()}
        </div>
      </main>

    </div>
  );
}
