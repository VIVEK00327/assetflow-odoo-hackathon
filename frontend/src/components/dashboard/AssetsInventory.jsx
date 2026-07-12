import React, { useState } from 'react';
import { 
  FiPlus, 
  FiX, 
  FiSearch, 
  FiFilter, 
  FiActivity, 
  FiTrash2 
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

export default function AssetsInventory({ 
  assets = [], 
  setAssets, 
  categories = [], 
  setCategories,
  showRegisterAssetForm,
  setShowRegisterAssetForm
}) {
  // Filters & local form states
  const [searchAssetQuery, setSearchAssetQuery] = useState('');
  const [filterAssetCategory, setFilterAssetCategory] = useState('');
  const [filterAssetStatus, setFilterAssetStatus] = useState('');
  
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState(categories[0]?.name || 'Laptops');
  const [newAssetStatus, setNewAssetStatus] = useState('Available');

  // Submit asset registration
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
      
      // Reload categories to sync counts
      const catsRes = await axios.get(`${API_BASE}/categories`, getRequestConfig());
      setCategories(catsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register asset');
    }
  };

  // Delete asset
  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`${API_BASE}/assets/${id}`, getRequestConfig());
      setAssets(assets.filter(a => a._id !== id));
      toast.success('Asset registration deleted');
      
      // Reload categories to sync counts
      const catsRes = await axios.get(`${API_BASE}/categories`, getRequestConfig());
      setCategories(catsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete asset');
    }
  };

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
}
