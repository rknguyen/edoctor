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
const AuthCtrl_Erro_1 = __importDefault(require("./AuthCtrl.Erro"));
const jwt_1 = require("../../utils/jwt");
const Guards_1 = require("../../middlewares/Guards");
let AuthCtrl = class AuthCtrl {
    signIn(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findOne({ username, password });
                if (user === null) {
                    return { error: AuthCtrl_Erro_1.default.INVALID_CREDENTIALS };
                }
                else {
                    return jwt_1.signJWT(user._id.toString());
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
};
__decorate([
    common_1.Post('/sign-in'),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('username')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthCtrl.prototype, "signIn", null);
AuthCtrl = __decorate([
    common_1.Controller('/auth'),
    common_1.UseAuth(Guards_1.AuthCheck, { guest: true }),
    common_1.MergeParams(true)
], AuthCtrl);
exports.AuthCtrl = AuthCtrl;
//# sourceMappingURL=AuthCtrl.js.map