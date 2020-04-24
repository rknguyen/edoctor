"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./jwt");
const user_1 = require("../models/user");
/**
 * Check if request is authenticated or not
 * If authenticated, link user info into request.user
 * @param request : request from user
 */
exports.isAuthenticated = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const signed_token = request.header('Authorization');
    if (!signed_token)
        return false;
    try {
        const credentials = jwt_1.verifyJWT(signed_token);
        if (!!credentials.id) {
            const user = yield user_1.Users.findUserById(credentials.id);
            if (!!user) {
                request.user = user;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
});
//# sourceMappingURL=isAuthenticated.js.map