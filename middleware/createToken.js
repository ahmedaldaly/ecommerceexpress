const jwt =require ('jsonwebtoken')
const generateToken = (id, isAdmin, isStoreOwner) => {
    return jwt.sign(
        { id, isAdmin, isStoreOwner },
        process.env.JWT_SECRET || 'secret12727', // المفتاح السري
        { expiresIn: '1d' } // مدة الصلاحية
    );
};

module.exports = generateToken;