import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { TasksModule } from '../tasks/tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Action]), TasksModule],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService, TasksModule],
})
export class ActionModule {}
