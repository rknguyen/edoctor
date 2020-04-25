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
const Guards_1 = require("../../middlewares/Guards");
const AttachmentsCtrl_Erro_1 = __importDefault(require("./AttachmentsCtrl.Erro"));
const attachment_1 = require("../../models/attachment");
let AttachmentsCtrl = class AttachmentsCtrl {
    getAttachmentByPath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attachment = yield attachment_1.AttachmentModel.findOne({ path });
                if (attachment === null) {
                    return { error: AttachmentsCtrl_Erro_1.default.ATTACHMENT_NOT_FOUND };
                }
                else {
                    return { success: true, data: attachment };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
};
__decorate([
    common_1.Post('/'),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttachmentsCtrl.prototype, "getAttachmentByPath", null);
AttachmentsCtrl = __decorate([
    common_1.Controller('/attachment'),
    common_1.UseAuth(Guards_1.AuthCheck),
    common_1.MergeParams(true)
], AttachmentsCtrl);
exports.AttachmentsCtrl = AttachmentsCtrl;
//# sourceMappingURL=AttachmentsCtrl.js.map