import { Test, TestingModule } from '@nestjs/testing';
import { TasksModule } from '../tasks/tasks/tasks.module';
import { ActionListController } from './action-list.controller';
import { ActionListService } from './action-list.service';

describe('ActionListController', () => {
  let controller: ActionListController;

  const mockActionListService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
  };

  const validCreateDto = {
    actions: [],
  };

  const invalidCreateDto = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
      controllers: [ActionListController],
      providers: [ActionListService],
    })
      .overrideProvider(ActionListService)
      .useValue(mockActionListService)
      .compile();

    controller = module.get<ActionListController>(ActionListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an action list', () => {
    expect(controller.create(validCreateDto)).toEqual({
      id: expect.any(Number),
      actions: [],
    });
  });
  /*
  it('should throw errors because data d', () => {
    expect(
      controller.create(invalidCreateDto).toEqual({
        id: expect.any(Number),
        actions: [],
      }),
    );
  });
  */
});
