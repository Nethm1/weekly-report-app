const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    weekStart: {
      type: Date,
      required: [true, 'Week start date is required'],
    },
    weekEnd: {
      type: Date,
      required: [true, 'Week end date is required'],
    },
    tasksCompleted: {
      type: String,
      required: [true, 'Tasks completed is required'],
      trim: true,
    },
    tasksPlanned: {
      type: String,
      required: [true, 'Tasks planned is required'],
      trim: true,
    },
    blockers: {
      type: String,
      trim: true,
      default: 'None',
    },
    hoursWorked: {
      type: Number,
      min: 0,
      max: 168,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'submitted'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
reportSchema.index({ user: 1, weekStart: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ project: 1 });

module.exports = mongoose.model('Report', reportSchema);
