const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name must be no longer than 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Email is a mandatory field'],
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is a mandatory field'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    if (!salt) throw new Error('Error while creating salt');

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      if (!hash) throw new Error('Error while generating hash');

      this.password = hash;
      next();
    });
  });
});

userSchema.methods.generateAccessJWT = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30d' });
};

const User = mongoose.models.users || mongoose.model('User', userSchema);
module.exports = User;
