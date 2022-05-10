import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

@Module({
  imports: [SchedulerRegistry],
  providers: [TasksService, SchedulerRegistry],
  exports: [TasksService, SchedulerRegistry],
})
export class TasksModule {}
