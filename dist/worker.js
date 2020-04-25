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
require('./db');
require('dotenv').config();
const aws = require('aws-sdk');
const interval = require('interval-promise');
const S3_DOMAIN = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/`;
const attachment_1 = require("./models/attachment");
function detectSkinLesion(projectVersionArn, bucketName, imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Rekognition = new aws.Rekognition({
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
            });
            const payload = {
                Image: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: imageName,
                    },
                },
                ProjectVersionArn: projectVersionArn,
                MaxResults: 10,
                MinConfidence: 0.5,
            };
            const promise = () => new Promise((resolve, reject) => {
                Rekognition.detectCustomLabels(payload, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({
                            success: true,
                            data,
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
function randomEmoij() {
    const sb1 = Math.random() >= 0.5 ? '*' : 'o';
    const sb2 = Math.random() >= 0.5 ? '*' : 'o';
    return `(${sb1}_${sb2})`;
}
function findUnlabeledImageAndLabel() {
    return __awaiter(this, void 0, void 0, function* () {
        const unlabeledImage = yield attachment_1.AttachmentModel.find({ status: 'UNLABELED' });
        if (unlabeledImage.length === 0) {
            console.log(new Date(), '[+] All images was labeled!', randomEmoij());
        }
        for (let i = 0; i < unlabeledImage.length; ++i) {
            let imagePath = unlabeledImage[i].path;
            if (imagePath.startsWith(S3_DOMAIN)) {
                imagePath = imagePath.replace(S3_DOMAIN, '');
                const label = yield detectSkinLesion(process.env.PROJECT_VERSION_ARN, process.env.S3_BUCKET, imagePath);
                yield attachment_1.AttachmentModel.findByIdAndUpdate(unlabeledImage[i]._id, { label, status: 'LABELED' });
                console.log(new Date(), '[+] Labeled attachment ' + unlabeledImage[i]._id);
            }
        }
    });
}
interval(findUnlabeledImageAndLabel, 2000);
//# sourceMappingURL=worker.js.map