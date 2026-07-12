const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  assetTag: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected'],
    default: 'Pending Approval'
  },
  date: {
    type: String,
    default: 'Just Now'
  },
  reason: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', TransferSchema);
