import * as mongoose from 'mongoose';

/**
 * INTERFACES ARE DECLARE HERE
 */

export interface IUserModel extends mongoose.Document {
  username: string;
  password: string;
  role: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  passportNumber: string;
  avatar: string;
  groupId: string;
  availableTimeBlock: number[][];
  createdAt: number;
  modifiedAt: number;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  passportNumber: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  groupId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Number,
    required: false,
  },
  availableTimeBlock: {
    type: [[Number]],
    required: false,
  },
  modifiedAt: {
    type: Number,
    required: false,
  },
});

UserSchema.pre<IUserModel>('save', function (next) {
  this.modifiedAt = Date.now();
  if (!this.createdAt) {
    this.createdAt = this.modifiedAt;
  }
  next();
});

/**
 * TYPES BEGIN HERE
 */

export type IUserQuery = mongoose.DocumentQuery<IUserModel | null, IUserModel, {}>;

export type IUsersQuery = mongoose.DocumentQuery<IUserModel[], IUserModel, {}>;

export const UserModel = mongoose.model<IUserModel>('user', UserSchema, 'users');

/**
 * METHODS BEGIN HERE
 */
export const Users = {
  getAllUsers: (): IUsersQuery => UserModel.find({}).sort({ createdAt: 'desc' }),
  findUserById: (id: string): IUserQuery => UserModel.findById(id),
  findUserByUsername: (username: string): IUserQuery => UserModel.findOne({ username }),
  updatePasswordById: (id: string, password: string): IUserQuery =>
    UserModel.findByIdAndUpdate(id, { password }),
  deleteById: (id: string): IUserQuery => UserModel.findByIdAndDelete(id),
};
