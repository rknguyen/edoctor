import {
  Controller,
  UseAuth,
  MergeParams,
  Get,
  Required,
  Patch,
  PathParams,
  Post,
  BodyParams,
  Delete,
} from '@tsed/common';
import { AuthCheck } from '../../middlewares/Guards';
import Error from './AttachmentsCtrl.Erro';
import { Attachments, AttachmentModel } from '../../models/attachment';

@Controller('/attachment')
@UseAuth(AuthCheck)
@MergeParams(true)
export class AttachmentsCtrl {
  @Post('/')
  async getAttachmentByPath(@Required() @BodyParams('path') path: string) {
    try {
      const attachment = await AttachmentModel.findOne({ path });
      if (attachment === null) {
        return { error: Error.ATTACHMENT_NOT_FOUND };
      } else {
        return { success: true, data: attachment };
      }
    } catch (error) {
      return { error };
    }
  }
}
