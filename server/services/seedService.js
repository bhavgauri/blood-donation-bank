const BloodInventory = require('../models/BloodInventory');
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodCamp = require('../models/BloodCamp');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    const inventoryCount = await BloodInventory.countDocuments();
    if (inventoryCount === 0) {
      const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      await BloodInventory.insertMany(
        groups.map((group) => ({
          bloodGroup: group,
          availableUnits: Math.floor(Math.random() * 50) + 10,
          reservedUnits: Math.floor(Math.random() * 5),
          bloodBank: 'LifeLink Central Blood Bank',
          location: 'Main Facility, Downtown',
          contact: '+1-800-LIFELINK',
        }))
      );
      console.log('Blood inventory seeded');
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@lifelink.com',
        password: 'admin123',
        phone: '+1-800-LIFELINK',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created: admin@lifelink.com / admin123');
    }

    const campCount = await BloodCamp.countDocuments();
    if (campCount === 0) {
      const now = new Date();
      await BloodCamp.insertMany([
        {
          name: 'Annual Community Blood Drive',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
          time: '09:00 AM - 04:00 PM',
          location: 'Community Center, Downtown',
          organizer: 'LifeLink Foundation',
          totalSlots: 100,
          description: 'Join us for our annual community blood drive. All donors welcome!',
        },
        {
          name: 'University Blood Donation Camp',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
          time: '10:00 AM - 03:00 PM',
          location: 'University Campus, North Wing',
          organizer: 'Student Red Cross Society',
          totalSlots: 80,
          description: 'A campus-wide blood donation event organized by students.',
        },
        {
          name: 'Corporate Wellness & Blood Drive',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21),
          time: '11:00 AM - 05:00 PM',
          location: 'Tech Park, Building C',
          organizer: 'Corporate Health Initiative',
          totalSlots: 60,
          description: 'A combined wellness and blood donation event for corporate employees.',
        },
      ]);
      console.log('Blood camps seeded');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = { seedDatabase };
