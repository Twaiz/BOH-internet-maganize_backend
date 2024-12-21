import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

enum TypesRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordConfirm?: string | undefined;
  role: TypesRole;
  receiveAdvertising: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string | undefined;
  passwordResetExpires?: Date | undefined;
  id: string;
  createPasswordResetToken: () => string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: { type: String, required: true, minlength: 8, select: false },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(TypesRole),
    default: TypesRole.USER,
  },
  receiveAdvertising: { type: Boolean, required: true, default: false },
  passwordChangedAt: Date,
  passwordResetToken: String || undefined,
  passwordResetExpires: Date || undefined,
});

//? Functions ?\\
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  if (this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }

  next();
});

const correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods['passwordChangedAfter'] = function (JWTTimeGet: number) {
  if (this['passwordChangedAt']) {
    const passwordChanged = this['passwordChangedAt'].getTime();
    return JWTTimeGet < passwordChanged;
  }

  return false;
};

userSchema.methods['createPasswordResetToken'] = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this['passwordResetToken'] = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this['passwordResetExpires'] = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser, correctPassword };
