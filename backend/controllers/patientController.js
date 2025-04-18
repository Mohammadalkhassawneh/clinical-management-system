const { Patient, Doctor, Appointment, User } = require('../models');

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodType,
      allergies,
      medicalHistory
    } = req.body;

    const patient = await Patient.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodType,
      allergies,
      medicalHistory
    });

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error getting all patients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        {
          model: Appointment,
          include: [
            {
              model: Doctor,
              include: [
                {
                  model: User,
                  attributes: ['firstName', 'lastName']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodType,
      allergies,
      medicalHistory
    } = req.body;

    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update patient fields
    patient.firstName = firstName || patient.firstName;
    patient.lastName = lastName || patient.lastName;
    patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
    patient.gender = gender || patient.gender;
    patient.phoneNumber = phoneNumber || patient.phoneNumber;
    patient.email = email || patient.email;
    patient.address = address || patient.address;
    patient.emergencyContactName = emergencyContactName || patient.emergencyContactName;
    patient.emergencyContactPhone = emergencyContactPhone || patient.emergencyContactPhone;
    patient.bloodType = bloodType || patient.bloodType;
    patient.allergies = allergies || patient.allergies;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;

    await patient.save();

    res.status(200).json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.destroy();

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
