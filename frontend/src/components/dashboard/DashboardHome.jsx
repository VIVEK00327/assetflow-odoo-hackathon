import React from 'react';
import { 
  FiAlertTriangle, 
  FiPlus, 
  FiCalendar, 
  FiShuffle, 
  FiActivity 
} from 'react-icons/fi';

export default function DashboardHome({ 
  assets = [], 
  bookings = [], 
  transfers = [], 
  handleActionRegisterAsset, 
  handleActionBookResource, 
  handleActionRaiseRequests 
}) {
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
          { label: 'Available', value: 126 + availableAssets, color: 'border-emerald-500/30 text-emerald-400' },
          { label: 'Allocated', value: 74 + allocatedAssets, color: 'border-violet-500/30 text-violet-400' },
          { label: 'Reserved', value: 9 + reservedAssets, color: 'border-blue-500/30 text-blue-400' },
          { label: 'Active Bookings', value: 13 + bookings.length, color: 'border-sky-500/30 text-sky-400' },
          { label: 'Pending Transfers', value: 3 + pendingTransfers, color: 'border-amber-500/30 text-amber-400' },
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
}
