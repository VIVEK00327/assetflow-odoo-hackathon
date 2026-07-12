import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, 
  FiUser, 
  FiHome,
  FiSettings,
  FiDatabase,
  FiShuffle,
  FiCalendar,
  FiTool,
  FiCheckSquare,
  FiBarChart2,
  FiBell,
  FiMenu,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

// Import Modular Sub-Components
import DashboardHome from '../components/dashboard/DashboardHome';
import OrgSetup from '../components/dashboard/OrgSetup';
import AssetsInventory from '../components/dashboard/AssetsInventory';
import ResourceBookings from '../components/dashboard/ResourceBookings';
import AllocationsTransfers from '../components/dashboard/AllocationsTransfers';
import MaintenanceRequests from '../components/dashboard/MaintenanceRequests';
import AuditReconciliation from '../components/dashboard/AuditReconciliation';
import OperationalReports from '../components/dashboard/OperationalReports';
import SystemNotifications from '../components/dashboard/SystemNotifications';

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

  // Shared Data States loaded from Backend
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([]);

  // Quick Action Toggles (allows dashboard actions to open forms on other tabs)
  const [showRegisterAssetForm, setShowRegisterAssetForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  // Fetch all data from backend
  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // Fetch concurrently to load dashboard instantly
      const [
        assetsRes,
        bookingsRes,
        transfersRes,
        maintRes,
        catsRes,
        deptsRes,
        empsRes
      ] = await Promise.all([
        axios.get(`${API_BASE}/assets`, config),
        axios.get(`${API_BASE}/bookings`, config),
        axios.get(`${API_BASE}/transfers`, config),
        axios.get(`${API_BASE}/maintenance`, config),
        axios.get(`${API_BASE}/categories`, config),
        axios.get(`${API_BASE}/departments`, config),
        axios.get(`${API_BASE}/employees`, config)
      ]);

      setAssets(assetsRes.data);
      setBookings(bookingsRes.data);
      setTransfers(transfersRes.data);
      setMaintenanceTickets(maintRes.data);
      setCategories(catsRes.data);
      setDepartments(deptsRes.data);
      setEmployees(empsRes.data);

    } catch (error) {
      console.error('Error loading data from backend APIs:', error);
      toast.error('Failed to sync data with the backend server.');
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

  // Quick Action Redirect Handlers from Dashboard Home
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

  // Render Sub-Views
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
        return (
          <DashboardHome 
            assets={assets}
            bookings={bookings}
            transfers={transfers}
            handleActionRegisterAsset={handleActionRegisterAsset}
            handleActionBookResource={handleActionBookResource}
            handleActionRaiseRequests={handleActionRaiseRequests}
          />
        );
      case 'org-setup':
        return (
          <OrgSetup 
            isAdmin={isAdmin}
            user={user}
            setActiveTab={setActiveTab}
            departments={departments}
            setDepartments={setDepartments}
            categories={categories}
            setCategories={setCategories}
            employees={employees}
            setEmployees={setEmployees}
          />
        );
      case 'assets':
        return (
          <AssetsInventory 
            assets={assets}
            setAssets={setAssets}
            categories={categories}
            setCategories={setCategories}
            showRegisterAssetForm={showRegisterAssetForm}
            setShowRegisterAssetForm={setShowRegisterAssetForm}
          />
        );
      case 'allocation':
        return (
          <AllocationsTransfers 
            transfers={transfers}
            setTransfers={setTransfers}
            assets={assets}
            employees={employees}
            showTransferForm={showTransferForm}
            setShowTransferForm={setShowTransferForm}
          />
        );
      case 'booking':
        return (
          <ResourceBookings 
            bookings={bookings}
            setBookings={setBookings}
            showBookingForm={showBookingForm}
            setShowBookingForm={setShowBookingForm}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceRequests 
            maintenanceTickets={maintenanceTickets}
            setMaintenanceTickets={setMaintenanceTickets}
            assets={assets}
            showMaintenanceForm={showMaintenanceForm}
            setShowMaintenanceForm={setShowMaintenanceForm}
          />
        );
      case 'audit':
        return <AuditReconciliation />;
      case 'reports':
        return <OperationalReports />;
      case 'notifications':
        return <SystemNotifications />;
      default:
        return (
          <DashboardHome 
            assets={assets}
            bookings={bookings}
            transfers={transfers}
            handleActionRegisterAsset={handleActionRegisterAsset}
            handleActionBookResource={handleActionBookResource}
            handleActionRaiseRequests={handleActionRaiseRequests}
          />
        );
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
