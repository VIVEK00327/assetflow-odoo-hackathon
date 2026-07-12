import React, { useState } from 'react';
import { FiShuffle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getRequestConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export default function AllocationsTransfers({ 
  transfers = [], 
  setTransfers, 
  assets = [], 
  employees = [],
  showTransferForm,
  setShowTransferForm
}) {
  const allocatedAssets = assets.filter(a => a.status === 'Allocated');
  
  const [transferAsset, setTransferAsset] = useState(allocatedAssets[0]?.tag || assets[0]?.tag || '');
  const [transferTo, setTransferTo] = useState(employees[0]?.name || '');
  const [transferReason, setTransferReason] = useState('Project Assignment');

  // Submit Transfer
  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    const assetSelectValue = transferAsset || (allocatedAssets[0]?.tag || assets[0]?.tag);
    if (!assetSelectValue) {
      toast.error('No asset selected');
      return;
    }
    const toSelectValue = transferTo || employees[0]?.name;
    if (!toSelectValue) {
      toast.error('No recipient selected');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/transfers`, {
        assetTag: assetSelectValue,
        to: toSelectValue,
        reason: transferReason
      }, getRequestConfig());

      setTransfers([res.data, ...transfers]);
      setShowTransferForm(false);
      toast.success('Asset transfer request initiated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit transfer request');
    }
  };

  return (
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
                  {allocatedAssets.length > 0 ? (
                    allocatedAssets.map(a => (
                      <option key={a.tag} value={a.tag}>{a.name} ({a.tag})</option>
                    ))
                  ) : (
                    assets.map(a => (
                      <option key={a.tag} value={a.tag}>{a.name} ({a.tag})</option>
                    ))
                  )}
                  {assets.length === 0 && (
                    <option value="">No assets registered</option>
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
                  {employees.length === 0 && (
                    <option value="">No employees registered</option>
                  )}
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
            <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer transition-colors">
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
}
