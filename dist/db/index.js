"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default
    .connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .catch(error => console.log(error));
exports.default = mongoose_1.default;
//# sourceMappingURL=index.js.map