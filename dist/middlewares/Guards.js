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
var AuthCheck_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const isAuthenticated_1 = require("../utils/isAuthenticated");
let AuthCheck = AuthCheck_1 = class AuthCheck {
    use(request, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const authMeta = endpoint.get(AuthCheck_1) || {};
            const signedIn = yield isAuthenticated_1.isAuthenticated(request);
            if (!authMeta.guest && !signedIn) {
                throw new ts_httpexceptions_1.Unauthorized('Unauthorized');
            }
            if (authMeta.guest && signedIn) {
                throw new ts_httpexceptions_1.Forbidden('Forbidden');
            }
        });
    }
};
__decorate([
    __param(0, common_1.Req()), __param(1, common_1.EndpointInfo()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthCheck.prototype, "use", null);
AuthCheck = AuthCheck_1 = __decorate([
    common_1.Middleware()
], AuthCheck);
exports.AuthCheck = AuthCheck;
//# sourceMappingURL=Guards.js.map