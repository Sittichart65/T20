const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// สมัครสมาชิก
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password }); // เก็บ password เป็น plain text
    await user.save();
    res.status(201).send('สมัครสมาชิกเรียบร้อย');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ล็อกอิน
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw new Error('ไม่พบผู้ใช้');

    // ตรวจสอบ password โดยตรง (ไม่ใช้ bcrypt.compare)
    if (password !== user.password) throw new Error('รหัสผ่านไม่ถูกต้อง');

    const token = await user.generateAuthToken();
    res.send({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ดูโปรไฟล์
router.get('/profile', auth, (req, res) => {
  res.send(req.user);
});

// ล็อกเอาท์
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();
    res.send('ล็อกเอาท์เรียบร้อย');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;