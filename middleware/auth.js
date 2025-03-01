const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // รับ Token จาก Header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // ตรวจสอบ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ค้นหาผู้ใช้และตรวจสอบ Token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) throw new Error();

    // เก็บข้อมูลผู้ใช้และ Token ใน request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};

module.exports = auth;