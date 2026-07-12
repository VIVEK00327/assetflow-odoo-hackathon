const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  assetTag: {
    type: String,
    required: true,
    trim: true
  },
  issue: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported'
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
