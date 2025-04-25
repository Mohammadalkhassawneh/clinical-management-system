const { ActivityLog, User } = require('../models');
const { Op } = require('sequelize');

// Get all activity logs with filtering options
exports.getActivityLogs = async (req, res) => {
    console.log('Request received for activity logs');
  try {
    console.log('Request query:', req.query);
    const { action, entityType, startDate, endDate, limit = 100 } = req.query;

    const whereClause = {};

    if (action) {
      whereClause.action = action;
    }

    if (entityType) {
      whereClause.entityType = entityType;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }
    console.log('Where clause:', whereClause);
    console.log('req.query:', req.query);
    const logs = await ActivityLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Error getting activity logs:', error);
    console.log('Error details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};