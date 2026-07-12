import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function AuditReconciliation() {
  return (
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
}
