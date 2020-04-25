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
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const common_1 = require("@tsed/common");
const aws = require('aws-sdk');
let AWSCtrl = class AWSCtrl {
    generateSignedURL(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Object = new aws.S3({
                    accessKeyId: process.env.ACCESS_KEY,
                    secretAccessKey: process.env.SECRET_ACCESS_KEY,
                    region: process.env.S3_REGION,
                });
                const payload = {
                    Bucket: process.env.S3_BUCKET,
                    Key: fileName,
                    Expires: 60,
                    ContentType: fileType,
                    ACL: 'public-read',
                };
                const promise = () => new Promise((resolve, reject) => {
                    s3Object.getSignedUrl('putObject', payload, (error, data) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve({
                                signedRequest: data,
                                url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
                            });
                        }
                    });
                });
                const response = yield promise();
                return response;
            }
            catch (error) {
                return { error };
            }
        });
    }
};
__decorate([
    common_1.Post('/generate-signed-url'),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('fileName')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('fileType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AWSCtrl.prototype, "generateSignedURL", null);
AWSCtrl = __decorate([
    common_1.Controller('/aws'),
    common_1.MergeParams(true)
], AWSCtrl);
exports.AWSCtrl = AWSCtrl;
//# sourceMappingURL=AWSCtrl.js.map