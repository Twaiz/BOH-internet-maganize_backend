import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

enum TypesRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string | undefined;
  role: TypesRole;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//? Functions ?\\
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }

  next();
});

userSchema.methods['correctPassword'] = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods['passwordChangedAfter'] = function (JWTTimeGet: number) {
  if (this['passwordChangedAt']) {
    const passwordChanged = this['passwordChangedAt'].getTime();
    return JWTTimeGet < passwordChanged;
  }

  return false;
};

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
