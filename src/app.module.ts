import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActionModule } from './action/action.module';
import { ActionListModule } from './action-list/action-list.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionList } from './action-list/entities/action-list.entity';
import { ConfigModule } from '@nestjs/config';
import { Action } from './action/entities/action.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Action, ActionList],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    ActionModule,
    ActionListModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
