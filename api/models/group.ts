import * as mongoose from 'mongoose';

/**
 * INTERFACES ARE DECLARE HERE
 */

export interface IGroupModel extends mongoose.Document {
  name: string;
  description: string;
  createdAt: number;
  modifiedAt: number;
}

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Number,
    required: false,
  },
  modifiedAt: {
    type: Number,
    required: false,
  },
});

GroupSchema.pre<IGroupModel>('save', function (next) {
  this.modifiedAt = Date.now();
  if (!this.createdAt) {
    this.createdAt = this.modifiedAt;
  }
  next();
});

/**
 * GROUPS BEGIN HERE
 */

export type IGroupQuery = mongoose.DocumentQuery<IGroupModel | null, IGroupModel, {}>;

export type IGroupsQuery = mongoose.DocumentQuery<IGroupModel[], IGroupModel, {}>;

export const GroupModel = mongoose.model<IGroupModel>('group', GroupSchema, 'groups');

/**
 * METHODS BEGIN HERE
 */
export const Groups = {
  getAllGroups: (): IGroupsQuery => GroupModel.find({}).sort({ createdAt: 'desc' }),
  findGroupById: (id: string): IGroupQuery => GroupModel.findById(id),
  create: (name: string, description: string): Promise<IGroupModel> =>
    GroupModel.create({ name, description }),
  updateNameById: (id: string, name: string): IGroupQuery => GroupModel.findByIdAndUpdate(id, { name }),
  deleteById: (id: string): IGroupQuery => GroupModel.findByIdAndDelete(id),
};
