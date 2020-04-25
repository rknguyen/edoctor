"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
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
AttachmentSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    if (!this.createdAt) {
        this.createdAt = this.modifiedAt;
    }
    next();
});
exports.AttachmentModel = mongoose.model('attachment', AttachmentSchema, 'attachments');
/**
 * METHODS BEGIN HERE
 */
exports.Attachments = {
    getAllAttachments: () => exports.AttachmentModel.find({}).sort({ createdAt: 'desc' }),
    findAttachmentById: (id) => exports.AttachmentModel.findById(id),
    create: (path) => exports.AttachmentModel.create({ path }),
    updatePathById: (id, path) => exports.AttachmentModel.findByIdAndUpdate(id, { path }),
    deleteById: (id) => exports.AttachmentModel.findByIdAndDelete(id),
};
//# sourceMappingURL=attachment.js.map