const ActivityLog = require('../models/ActivityLog');

class ActivityLogger {
  static async log({ userId, action, entityType, entityId, details, ipAddress, userAgent }) {
    try {
      await ActivityLog.create({
        userId,
        action,
        entityType,
        entityId,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
        userAgent
      });
    } catch (error) {
      console.error('ActivityLogger Error:', error);
    }
  }
}

module.exports = ActivityLogger;
