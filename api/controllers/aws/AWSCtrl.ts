require('dotenv').config();
import { Controller, MergeParams, Required, Post, BodyParams } from '@tsed/common';

const aws = require('aws-sdk');

@Controller('/aws')
@MergeParams(true)
export class AWSCtrl {
  @Post('/generate-signed-url')
  async generateSignedURL(
    @Required() @BodyParams('fileName') fileName: string,
    @Required() @BodyParams('fileType') fileType: string
  ) {
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

      const promise = () =>
        new Promise((resolve, reject) => {
          s3Object.getSignedUrl('putObject', payload, (error: any, data: any) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                signedRequest: data,
                url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
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

  // @Post('/detect-skin-lesion')
  // async detectSkinLesion(
  //   @Required() @BodyParams('projectVersionArn') projectVersionArn: string,
  //   @Required() @BodyParams('bucketName') bucketName: string,
  //   @Required() @BodyParams('imageName') imageName: string
  // ) {
  // }
}
