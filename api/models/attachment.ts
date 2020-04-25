import * as mongoose from 'mongoose';

/**
 * INTERFACES ARE DECLARE HERE
 */

export interface IAttachmentModel extends mongoose.Document {
  status: string;
  path: string;
  label: any;
  createdAt: number;
  modifiedAt: number;
}

const AttachmentSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    default: 'UNLABELED',
  },
  path: {
    type: String,
    required: true,
  },
  label: {
    type: Object,
    required: false,
    default: null,
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

AttachmentSchema.pre<IAttachmentModel>('save', function (next) {
  this.modifiedAt = Date.now();
  if (!this.createdAt) {
    this.createdAt = this.modifiedAt;
  }
  next();
});

/**
 * GROUPS BEGIN HERE
 */

export type IAttachmentQuery = mongoose.DocumentQuery<IAttachmentModel | null, IAttachmentModel, {}>;

export type IAttachmentsQuery = mongoose.DocumentQuery<IAttachmentModel[], IAttachmentModel, {}>;

export const AttachmentModel = mongoose.model<IAttachmentModel>(
  'attachment',
  AttachmentSchema,
  'attachments'
);

/**
 * METHODS BEGIN HERE
 */
export const Attachments = {
  getAllAttachments: (): IAttachmentsQuery => AttachmentModel.find({}).sort({ createdAt: 'desc' }),
  findAttachmentById: (id: string): IAttachmentQuery => AttachmentModel.findById(id),
  create: (path: string): Promise<IAttachmentModel> => AttachmentModel.create({ path }),
  updatePathById: (id: string, path: string): IAttachmentQuery =>
    AttachmentModel.findByIdAndUpdate(id, { path }),
  deleteById: (id: string): IAttachmentQuery => AttachmentModel.findByIdAndDelete(id),
};
