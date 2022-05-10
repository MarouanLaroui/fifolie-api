import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ActionListService } from './action-list.service';
import { CreateActionListDto } from './dto/create-action-list.dto';

@Controller('action-list')
export class ActionListController {
  constructor(private actionListService: ActionListService) {}

  @Post()
  create(@Body() createActionListDto: CreateActionListDto) {
    return this.actionListService.create(createActionListDto);
  }

  @Post('/addAction/:actionId')
  addActionToList(@Param('actionId') actionId: string) {
    return this.actionListService.addAction(+actionId);
  }

  @Delete('/:actionId/:actionIndex')
  deleteActionAtIndex(
    @Param('actionId') actionId: string,
    @Param('actionIndex') actionIndex: string,
  ) {
    return this.actionListService.removeActionAtIndex(+actionId, +actionIndex);
  }

  @Get('all')
  findAll() {
    return this.actionListService.findAll();
  }

  @Get('')
  findOne() {
    return this.actionListService.findOrCreate();
  }

  @Post('reset')
  reset() {
    return this.actionListService.resetFifo();
  }

  @Delete('action/:id')
  removeAction(@Param('id') id: string) {
    return this.actionListService.removeAction(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionListService.remove(+id);
  }
}
