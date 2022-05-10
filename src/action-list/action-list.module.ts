import { Module } from '@nestjs/common';
import { ActionListService } from './action-list.service';
import { ActionListController } from './action-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionList } from './entities/action-list.entity';
import { ActionModule } from '../action/action.module';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([ActionList]), ActionModule],
  controllers: [ActionListController],
  providers: [ActionListService],
  exports: [ActionListService],
})
export class ActionListModule {}
