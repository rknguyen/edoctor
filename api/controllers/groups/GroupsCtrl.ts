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
import { Groups, IGroupModel, GroupModel } from '../../models/group';
import Error from './GroupsCtrl.Erro';

@Controller('/groups')
@MergeParams(true)
export class GroupsCtrl {
  @Get('/')
  async getAllGroups() {
    return await Groups.getAllGroups()
      .then((groups) => ({ success: true, data: groups }))
      .catch((error) => ({ error }));
  }
}

@Controller('/group')
@UseAuth(AuthCheck)
@MergeParams(true)
export class GroupCtrl {
  @Get('/:id')
  async findGroupById(@Required() @PathParams('id') id: string) {
    return await Groups.findGroupById(id)
      .then((group: IGroupModel | null) =>
        !!group ? { success: true, data: group } : { error: Error.GROUP_NOT_FOUND }
      )
      .catch((error) => ({ error }));
  }

  @Post('/new')
  async createNewGroup(
    @Required() @BodyParams('name') name: string,
    @Required() @BodyParams('description') description: string
  ) {
    return await Groups.create(name, description)
      .then((group) => ({ success: true, data: group }))
      .catch((error) => ({ error }));
  }

  @Patch('/:id')
  async updateGroupName(
    @Required() @PathParams('id') id: string,
    @Required() @BodyParams('name') name: string
  ) {
    return await Groups.updateNameById(id, name)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Patch('/:id/description')
  async updateGroupDescription(
    @Required() @PathParams('id') id: string,
    @Required() @BodyParams('description') description: string
  ) {
    return await GroupModel.findByIdAndUpdate(id, { description })
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Delete('/:id')
  async deleteGroupById(@Required() @PathParams('id') id: string) {
    return await Groups.deleteById(id)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }
}
