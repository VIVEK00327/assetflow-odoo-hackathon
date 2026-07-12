import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLogOut,
  FiUser,
  FiShield,
  FiGrid,
  FiSettings,
  FiFolder,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();

  // Retrieve user details from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { email: 'guest@assetflow.com', role: 'Employee' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'asset manager':
      case 'manager':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'department head':
      case 'head':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/25">
            AF
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0">
              Asset<span className="text-violet-400">Flow</span>
            </h1>
            <p className="text-xs text-gray-400">Enterprise Resource Planning</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-white">{user.email}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-red-950/40 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all text-sm font-medium cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Welcome Banner */}
        <section className="glass-accent rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-violet-300 capitalize">{user.role}</span>!
            </h2>
            <p className="text-gray-300 max-w-xl text-sm md:text-base">
              You are logged in as <strong className="text-white">{user.email}</strong>.
              The system is initialized and ready for resource bookings, audit cycles, and asset transfers.
            </p>
          </div>
          <div className="flex gap-3">
            <div className={`px-4 py-3.5 rounded-xl text-center glass-light ${getRoleBadgeColor(user.role)}`}>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Session Role</p>
              <p className="text-base font-bold capitalize mt-1">{user.role}</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass rounded-xl p-5 hover:border-violet-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-violet-500/10 text-violet-400 rounded-lg group-hover:bg-violet-500/25 transition-all">
                <FiFolder className="w-5 h-5" />
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">+12%</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">Total Assets</p>
            <p className="text-2xl font-bold text-white mt-1">1,482</p>
          </div>

          <div className="glass rounded-xl p-5 hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/25 transition-all">
                <FiActivity className="w-5 h-5" />
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">Pending Requests</p>
            <p className="text-2xl font-bold text-white mt-1">28</p>
          </div>

          <div className="glass rounded-xl p-5 hover:border-emerald-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/25 transition-all">
                <FiGrid className="w-5 h-5" />
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">98.4%</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">Utilization Rate</p>
            <p className="text-2xl font-bold text-white mt-1">84%</p>
          </div>

          <div className="glass rounded-xl p-5 hover:border-pink-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg group-hover:bg-pink-500/25 transition-all">
                <FiSettings className="w-5 h-5" />
              </div>
              <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-medium">Critical</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">Under Maintenance</p>
            <p className="text-2xl font-bold text-white mt-1">4</p>
          </div>
        </section>

        {/* Demo Message */}
        <section className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiShield className="text-violet-400" />
            Role-Based Authorization Simulated
          </h3>
          <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
            <p>
              In a full production environment, the client requests would be validated against database records and secure session cookies.
              The current workspace allows you to mock the following functions according to your role:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong className="text-white">Admin:</strong> Configure departments, user roles, master organizational schemas.</li>
              <li><strong className="text-white">Asset Manager:</strong> Lifecycle states, audit cycles, transfer approval workflows.</li>
              <li><strong className="text-white">Department Head:</strong> Department budget approvals and resource booking.</li>
              <li><strong className="text-white">Employee:</strong> Raise asset requests, reserve equipment/desks, register issue tickets.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
