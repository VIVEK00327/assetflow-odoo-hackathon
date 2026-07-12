import React from 'react';

export default function OperationalReports() {
  return (
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
}
