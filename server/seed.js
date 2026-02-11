const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Create Departments
        const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration'];

        for (const deptName of departments) {
            const existingDept = await Department.findOne({ name: deptName });
            if (!existingDept) {
                await new Department({ name: deptName }).save();
                console.log(`Created department: ${deptName}`);
            }
        }

        // Create Admin
        const adminEmail = 'admin'; // Using username as 'admin' based on User model
        const adminPassword = 'adminpassword';

        const existingAdmin = await User.findOne({ username: adminEmail });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const admin = new User({
                username: adminEmail,
                password: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN'
            });

            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
