import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksService } from '../tasks/tasks/tasks.service';
import { Repository } from 'typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    public actionRepository: Repository<Action>,
    private taskService: TasksService,
  ) {}

  create(createActionDto: CreateActionDto) {
    const currentValue =
      Math.floor(
        Math.random() *
          (createActionDto.maxValue -
            Math.ceil(createActionDto.maxValue * 0.8 + 1)),
      ) + Math.ceil(createActionDto.maxValue * 0.8);

    const newAction = {
      name: createActionDto.name,
      maxValue: createActionDto.maxValue,
      currentValue: currentValue,
    };

    return this.actionRepository.save(newAction);
  }

  findAll() {
    return this.actionRepository.find();
  }

  findOne(id: number) {
    return this.actionRepository.findOne({ id: id });
  }

  update(id: number, updateActionDto: UpdateActionDto) {
    return this.actionRepository.update({ id: id }, updateActionDto);
  }

  async useAction(id: number) {
    const action: Action = await this.findOne(id);

    if (action) {
      action.currentValue--;
      this.taskService.resetValueIn24h();
      return this.actionRepository.save(action);
    }
    throw new NotFoundException("L'action à utiliser n'existe pas");
  }

  async resetAllValues() {
    const actions = await this.findAll();
    actions.map((action) => this.resetValue(action.id));
  }

  async resetValue(id: number) {
    const action: Action = await this.actionRepository.findOne({ id: id });
    if (action) {
      action.currentValue =
        Math.floor(
          Math.random() *
            (action.maxValue - Math.ceil(action.maxValue * 0.8 + 1)),
        ) + Math.ceil(action.maxValue * 0.8);

      return this.actionRepository.save(action);
    }
    throw new NotFoundException('no such action');
  }

  remove(id: number) {
    return this.actionRepository.delete({ id: id });
  }
}
