import React from 'react';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function SystemNotifications() {
  return (
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
}
