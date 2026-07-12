import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getRequestConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export default function ResourceBookings({ 
  bookings = [], 
  setBookings,
  showBookingForm,
  setShowBookingForm
}) {
  const [bookingResource, setBookingResource] = useState('Conference Room B2');
  const [bookingTime, setBookingTime] = useState('9:00 AM - 10:00 AM');
  const [bookingDate, setBookingDate] = useState('Today');

  // Submit Booking
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

  // Delete Booking
  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE}/bookings/${id}`, getRequestConfig());
      setBookings(bookings.filter(b => b._id !== id));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
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
}
