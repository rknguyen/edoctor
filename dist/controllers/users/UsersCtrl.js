"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const user_1 = require("../../models/user");
const UsersCtrl_Erro_1 = __importDefault(require("./UsersCtrl.Erro"));
const Guards_1 = require("../../middlewares/Guards");
const group_1 = require("../../models/group");
let UsersCtrl = class UsersCtrl {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.Users.getAllUsers();
                for (let i = 0; i < users.length; ++i) {
                    users[i] = users[i].toObject();
                    if (users[i].groupId) {
                        users[i].group = yield group_1.Groups.findGroupById(users[i].groupId);
                        delete users[i].password;
                    }
                }
                return { success: true, data: users };
            }
            catch (error) {
                return { error };
            }
        });
    }
};
__decorate([
    common_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "getUsers", null);
UsersCtrl = __decorate([
    common_1.Controller('/users'),
    common_1.MergeParams(true)
], UsersCtrl);
exports.UsersCtrl = UsersCtrl;
let UserCtrl = class UserCtrl {
    findUserByMe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.Users.findUserById(req.user._id);
                if (!!user) {
                    if (user.groupId) {
                        user.group = yield group_1.Groups.findGroupById(user.groupId);
                    }
                    delete user.password;
                    return { success: true, data: user };
                }
                else {
                    return { error: UsersCtrl_Erro_1.default.USER_NOT_FOUND };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    findUserById(req, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield user_1.Users.findUserById(userId);
                if (!!user) {
                    user = user.toObject();
                    if (user.groupId) {
                        user.group = yield group_1.Groups.findGroupById(user.groupId);
                    }
                    delete user.password;
                    return { success: true, data: user };
                }
                else {
                    return { error: UsersCtrl_Erro_1.default.USER_NOT_FOUND };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    findUserByGroupId(req, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield user_1.UserModel.findOne({ groupId });
                if (!!user) {
                    user = user.toObject();
                    if (user.groupId) {
                        user.group = yield group_1.Groups.findGroupById(user.groupId);
                    }
                    delete user.password;
                    return { success: true, data: user };
                }
                else {
                    return { error: UsersCtrl_Erro_1.default.USER_NOT_FOUND };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    createNewUser(username, password, fullName, phoneNumber, email, passportNumber, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield group_1.Groups.findGroupById(groupId);
                if (group === null) {
                    return {
                        error: UsersCtrl_Erro_1.default.INVALID_GROUP_ID,
                    };
                }
                else {
                    const user = yield user_1.UserModel.create({
                        username,
                        password,
                        fullName,
                        phoneNumber,
                        email,
                        passportNumber,
                        groupId,
                    });
                    return { success: true, data: user };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    updateUserAvatar(request, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findByIdAndUpdate(request.user.id, {
                    avatar: avatarUrl,
                });
                return { success: true, data: user };
            }
            catch (error) {
                return { error };
            }
        });
    }
    updateUserAvailableTime(request, availableTimeBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findByIdAndUpdate(request.user.id, {
                    availableTimeBlock,
                });
                return { success: true, data: user };
            }
            catch (error) {
                return { error };
            }
        });
    }
    updateUserInformation(request, fullName, phoneNumber, email, passportNumber, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findByIdAndUpdate(request.user.id, {
                    fullName,
                    phoneNumber,
                    email,
                    passportNumber,
                    groupId,
                });
                return { success: true, data: user };
            }
            catch (error) {
                return { error };
            }
        });
    }
    updateUserPassword(request, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.Users.updatePasswordById(request.user.id, password)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    updateUserPasswordById(request, userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.Users.updatePasswordById(userId, password)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    deleteUserById(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.Users.deleteById(userId)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "findUserByMe", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Req()), __param(1, common_1.Required()), __param(1, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "findUserById", null);
__decorate([
    common_1.Get('/group/:id'),
    __param(0, common_1.Req()), __param(1, common_1.Required()), __param(1, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "findUserByGroupId", null);
__decorate([
    common_1.Post('/new'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('username')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('password')),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams('fullName')),
    __param(3, common_1.Required()), __param(3, common_1.BodyParams('phoneNumber')),
    __param(4, common_1.Required()), __param(4, common_1.BodyParams('email')),
    __param(5, common_1.Required()), __param(5, common_1.BodyParams('passportNumber')),
    __param(6, common_1.Required()), __param(6, common_1.BodyParams('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "createNewUser", null);
__decorate([
    common_1.Patch('/me/avatar'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()), __param(1, common_1.Required()), __param(1, common_1.BodyParams('avatarUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "updateUserAvatar", null);
__decorate([
    common_1.Patch('/me/available-time'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('availableTimeBlock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "updateUserAvailableTime", null);
__decorate([
    common_1.Patch('/me/information'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('fullName')),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams('phoneNumber')),
    __param(3, common_1.Required()), __param(3, common_1.BodyParams('email')),
    __param(4, common_1.Required()), __param(4, common_1.BodyParams('passportNumber')),
    __param(5, common_1.Required()), __param(5, common_1.BodyParams('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "updateUserInformation", null);
__decorate([
    common_1.Patch('/me/password'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()), __param(1, common_1.Required()), __param(1, common_1.BodyParams('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "updateUserPassword", null);
__decorate([
    common_1.Patch('/:id/password'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()),
    __param(1, common_1.Required()), __param(1, common_1.PathParams('id')),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "updateUserPasswordById", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()), __param(1, common_1.Required()), __param(1, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCtrl.prototype, "deleteUserById", null);
UserCtrl = __decorate([
    common_1.Controller('/user'),
    common_1.MergeParams(true)
], UserCtrl);
exports.UserCtrl = UserCtrl;
//# sourceMappingURL=UsersCtrl.js.map