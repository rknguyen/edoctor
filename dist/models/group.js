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
GroupSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    if (!this.createdAt) {
        this.createdAt = this.modifiedAt;
    }
    next();
});
exports.GroupModel = mongoose.model('group', GroupSchema, 'groups');
/**
 * METHODS BEGIN HERE
 */
exports.Groups = {
    getAllGroups: () => exports.GroupModel.find({}).sort({ createdAt: 'desc' }),
    findGroupById: (id) => exports.GroupModel.findById(id),
    create: (name, description) => exports.GroupModel.create({ name, description }),
    updateNameById: (id, name) => exports.GroupModel.findByIdAndUpdate(id, { name }),
    deleteById: (id) => exports.GroupModel.findByIdAndDelete(id),
};
//# sourceMappingURL=group.js.map