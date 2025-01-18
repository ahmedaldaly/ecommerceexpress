const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User, validateRegister, validateLogin } = require('../models/User');

module.exports.register = asyncHandler(async (req, res) => {
    // التحقق من صحة البيانات المدخلة
    const { error } = validateRegister(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // التحقق إذا كان المستخدم موجودًا بالفعل
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.passwoard, salt);

    // إنشاء مستخدم جديد
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        passwoard: hashedPassword,
    });

    // حفظ المستخدم في قاعدة البيانات
    const savedUser = await newUser.save();

    // إنشاء Token باستخدام بيانات المستخدم المحفوظ
    const token = jwt.sign(
        {
            id: savedUser._id,
            isAdmin: savedUser.isAdmin,
        },
        process.env.JWT_SECRET || 'secret12727', // استبدل بمفتاحك السري
        { expiresIn: '1d' } // مدة صلاحية التوكن
    );

    // تحديث التوكن في المستخدم
    savedUser.token = token;

    // إرسال استجابة إلى العميل
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin,
            token: savedUser.token,
        },
    });
});


module.exports.login = asyncHandler(async (req, res) => {
    // التحقق من صحة البيانات المدخلة
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // البحث عن المستخدم بالبريد الإلكتروني
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // التحقق من صحة كلمة المرور
    const validPassword = await bcrypt.compare(req.body.passwoard, user.passwoard);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    // إنشاء التوكن باستخدام بيانات المستخدم الذي تم العثور عليه
    const token = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || 'secret12727', // المفتاح السري
        { expiresIn: '1d' } // مدة صلاحية التوكن
    );

    // إرسال استجابة تحتوي على التوكن وبيانات المستخدم
    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
});
