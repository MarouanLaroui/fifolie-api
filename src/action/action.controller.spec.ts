import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks/tasks.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { Action } from './entities/action.entity';

describe('ActionController', () => {
  let controller: ActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
      controllers: [ActionController],
      providers: [
        ActionService,
        {
          provide: getRepositoryToken(Action),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOneOrFail: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockReturnValue([]),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<ActionController>(ActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
