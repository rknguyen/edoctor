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
const group_1 = require("../../models/group");
const GroupsCtrl_Erro_1 = __importDefault(require("./GroupsCtrl.Erro"));
let GroupsCtrl = class GroupsCtrl {
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.Groups.getAllGroups()
                .then((groups) => ({ success: true, data: groups }))
                .catch((error) => ({ error }));
        });
    }
};
__decorate([
    common_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getAllGroups", null);
GroupsCtrl = __decorate([
    common_1.Controller('/groups'),
    common_1.MergeParams(true)
], GroupsCtrl);
exports.GroupsCtrl = GroupsCtrl;
let GroupCtrl = class GroupCtrl {
    findGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.Groups.findGroupById(id)
                .then((group) => !!group ? { success: true, data: group } : { error: GroupsCtrl_Erro_1.default.GROUP_NOT_FOUND })
                .catch((error) => ({ error }));
        });
    }
    createNewGroup(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.Groups.create(name, description)
                .then((group) => ({ success: true, data: group }))
                .catch((error) => ({ error }));
        });
    }
    updateGroupName(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.Groups.updateNameById(id, name)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    updateGroupDescription(id, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.GroupModel.findByIdAndUpdate(id, { description })
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    deleteGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_1.Groups.deleteById(id)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
};
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupCtrl.prototype, "findGroupById", null);
__decorate([
    common_1.Post('/new'),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('name')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupCtrl.prototype, "createNewGroup", null);
__decorate([
    common_1.Patch('/:id'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupCtrl.prototype, "updateGroupName", null);
__decorate([
    common_1.Patch('/:id/description'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroupCtrl.prototype, "updateGroupDescription", null);
__decorate([
    common_1.Delete('/:id'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupCtrl.prototype, "deleteGroupById", null);
GroupCtrl = __decorate([
    common_1.Controller('/group'),
    common_1.UseAuth(Guards_1.AuthCheck),
    common_1.MergeParams(true)
], GroupCtrl);
exports.GroupCtrl = GroupCtrl;
//# sourceMappingURL=GroupsCtrl.js.map