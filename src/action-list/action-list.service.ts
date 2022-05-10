import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from '../action/action.service';
import { TasksService } from '../tasks/tasks/tasks.service';
import { Repository } from 'typeorm';
import { CreateActionListDto } from './dto/create-action-list.dto';
import { ActionList } from './entities/action-list.entity';

@Injectable()
export class ActionListService implements OnModuleInit {
  constructor(
    @InjectRepository(ActionList)
    private actionListRepository: Repository<ActionList>,
    private actionService: ActionService,
    private tasksService: TasksService,
  ) {}

  onModuleInit() {
    this.tasksService.executeActionEach2mn(() => this.executeFirstAction());
  }

  async create(createActionListDto: CreateActionListDto) {
    const actionLists = await this.findAll();
    if (actionLists.length > 0) {
      throw new UnauthorizedException('Liste existe déjà');
    }
    return this.actionListRepository.save(createActionListDto);
  }

  findAll() {
    return this.actionListRepository.find();
  }

  async findOrCreate() {
    const actionLists = await this.findAll();
    if (actionLists.length > 0) {
      return this.findJoined();
    }
    return this.actionListRepository.save({
      actions: [],
    });
  }

  async findJoined() {
    const actionList = await this.find();
    if (actionList.actions.length > 0) {
      const actionsPromise = [];

      actionList.actions.map((actionId) => {
        actionsPromise.push(this.actionService.findOne(actionId));
      });

      const resolvedActions = await Promise.all(actionsPromise);

      return {
        id: actionList.id,
        actions: resolvedActions,
      };
    }
    return actionList;
  }

  async find() {
    const response = await this.findAll();
    if (response.length > 0) {
      return response[0];
    }
    throw new NotFoundException("Pas de liste d'action");
  }

  async addAction(actionId: number) {
    const actionlist = await this.find();
    if (actionlist) {
      actionlist.actions.push(actionId);
      return this.actionListRepository.save(actionlist);
    }
    throw new NotFoundException('No list to add such action');
  }

  async executeFirstAction() {
    //To optimize  with query builder if possible
    const list = await this.find();

    if (list.actions.length <= 0) {
      throw new NotFoundException('No action to execute');
    }

    const actionToExecute = await this.actionService.findOne(list.actions[0]);
    if (!actionToExecute || actionToExecute.currentValue <= 0) {
      throw new UnauthorizedException('Not enough currVal to execute');
    }

    list.actions.shift();
    await this.actionListRepository.save(list);
    await this.actionService.useAction(actionToExecute.id);
    /*Reset the timeout*/
    this.tasksService.setActionIn24h(() => this.actionService.resetAllValues());
  }

  async removeAction(id: number) {
    const actionList = await this.find();
    if (actionList) {
      let isActionFound = false;
      actionList.actions = actionList.actions.filter((actionId) => {
        if (actionId != id) {
          return actionId;
        } else {
          isActionFound = true;
        }
      });
      if (!isActionFound) {
        throw new NotFoundException("Cette action n'est pas dans la liste");
      }
      await this.actionService.remove(id);
      return this.actionListRepository.save(actionList);
    }
    throw new NotFoundException("Pas de liste d'action disponibles");
  }

  async resetFifo() {
    const actionlist = await this.find();
    actionlist.actions = [];
    return this.actionListRepository.save(actionlist);
  }

  remove(id: number) {
    return this.actionListRepository.delete({ id: id });
  }
}
