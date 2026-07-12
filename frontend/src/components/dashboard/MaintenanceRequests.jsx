import React, { useState } from 'react';
import { FiTool, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getRequestConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export default function MaintenanceRequests({ 
  maintenanceTickets = [], 
  setMaintenanceTickets, 
  assets = [],
  showMaintenanceForm,
  setShowMaintenanceForm
}) {
  const [maintAsset, setMaintAsset] = useState(assets[0]?.tag || '');
  const [maintIssue, setMaintIssue] = useState('Overheating during extended use');
  const [maintPriority, setMaintPriority] = useState('Medium');

  // Submit Maintenance Request
  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    const assetSelectValue = maintAsset || assets[0]?.tag;
    if (!assetSelectValue) {
      toast.error('No asset selected');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/maintenance`, {
        assetTag: assetSelectValue,
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

  return (
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
                  {assets.length === 0 && (
                    <option value="">No assets registered</option>
                  )}
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
}
