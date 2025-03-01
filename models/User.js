const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // เก็บ password เป็น plain text
  tokens: [{ token: { type: String, required: true } }]
});

// สร้าง Token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  this.tokens.push({ token });
  await this.save();
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;