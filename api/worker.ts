require('./db');
require('dotenv').config();

const aws = require('aws-sdk');
const interval = require('interval-promise');

const S3_DOMAIN = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/`;

import { AttachmentModel, IAttachmentModel } from './models/attachment';

async function detectSkinLesion(
  projectVersionArn: string,
  bucketName: string,
  imageName: string
): Promise<any> {
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

    const promise = () =>
      new Promise((resolve, reject) => {
        Rekognition.detectCustomLabels(payload, (error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              success: true,
              data,
            });
          }
        });
      });

    const response = await promise();
    return response;
  } catch (error) {
    return { error };
  }
}

function randomEmoij() {
  const sb1 = Math.random() >= 0.5 ? '*' : 'o';
  const sb2 = Math.random() >= 0.5 ? '*' : 'o';
  return `(${sb1}_${sb2})`;
}

async function findUnlabeledImageAndLabel() {
  const unlabeledImage: IAttachmentModel[] = await AttachmentModel.find({ status: 'UNLABELED' });
  if (unlabeledImage.length === 0) {
    console.log(new Date(), '[+] All images was labeled!', randomEmoij());
  }
  for (let i = 0; i < unlabeledImage.length; ++i) {
    let imagePath = unlabeledImage[i].path;
    if (imagePath.startsWith(S3_DOMAIN)) {
      imagePath = imagePath.replace(S3_DOMAIN, '');
      const label = await detectSkinLesion(
        process.env.PROJECT_VERSION_ARN as string,
        process.env.S3_BUCKET as string,
        imagePath
      );
      await AttachmentModel.findByIdAndUpdate(unlabeledImage[i]._id, { label, status: 'LABELED' });
      console.log(new Date(), '[+] Labeled attachment ' + unlabeledImage[i]._id);
    }
  }
}

interval(findUnlabeledImageAndLabel, 2000);
