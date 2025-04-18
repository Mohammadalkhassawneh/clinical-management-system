const { Doctor, User } = require('../models');

// Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      licenseNumber,
      phoneNumber,
      address,
      isActive
    } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if doctor with this license number already exists
    const existingDoctor = await Doctor.findOne({ where: { licenseNumber } });
    if (existingDoctor) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      licenseNumber,
      phoneNumber,
      address,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });
    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error getting all doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const {
      specialization,
      licenseNumber,
      phoneNumber,
      address,
      isActive
    } = req.body;

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if license number is being changed and already exists
    if (licenseNumber && licenseNumber !== doctor.licenseNumber) {
      const existingDoctor = await Doctor.findOne({ where: { licenseNumber } });
      if (existingDoctor) {
        return res.status(400).json({ message: 'License number already exists' });
      }
    }

    // Update doctor fields
    doctor.specialization = specialization || doctor.specialization;
    doctor.licenseNumber = licenseNumber || doctor.licenseNumber;
    doctor.phoneNumber = phoneNumber || doctor.phoneNumber;
    doctor.address = address || doctor.address;
    doctor.isActive = isActive !== undefined ? isActive : doctor.isActive;

    await doctor.save();

    // Get updated doctor with user information
    const updatedDoctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    res.status(200).json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.destroy();

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
