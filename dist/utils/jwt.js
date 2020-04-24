"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ silent: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signJWT = (userId) => {
    return {
        signed_token: jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET_KEY)
    };
};
exports.verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
};
//# sourceMappingURL=jwt.js.map