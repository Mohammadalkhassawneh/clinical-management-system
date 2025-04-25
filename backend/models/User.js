const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ActivityLogger = require('../utils/ActivityLogger');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'receptionist', 'nurse'),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.afterUpdate(async (user, options) => {
  const changed = user.changed();
  const changes = {};

  if (Array.isArray(changed)) {
    changed.forEach(key => {
      changes[key] = {
        from: user._previousDataValues[key],
        to: user.dataValues[key]
      };
    });
  }

  if (Object.keys(changes).length > 0) {
    await ActivityLogger.log({
      userId: options.userId || null,
      action: 'update',
      entityType: 'User',
      entityId: user.id,
      details: changes,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent
    });
  }
});


User.afterCreate(async (user, options) => {
  await ActivityLogger.log({
    userId: options.userId || null,
    action: 'create',
    entityType: 'User',
    entityId: user.id,
    details: user.dataValues,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent
  });
});

User.afterDestroy(async (user, options) => {
  await ActivityLogger.log({
    userId: options.userId || null,
    action: 'delete',
    entityType: 'User',
    entityId: user.id,
    details: user.dataValues,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent
  });
});
module.exports = User;
