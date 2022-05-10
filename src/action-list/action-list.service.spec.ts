import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ActionListService } from './action-list.service';
import { ActionList } from './entities/action-list.entity';
import { ActionService } from '../action/action.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks/tasks.module';
import { Action } from 'src/action/entities/action.entity';

describe('ActionListService', () => {
  let service: ActionListService;

  const mockAction: Action = {
    id: 1,
    name: 'test',
    maxValue: 20,
    currentValue: 15,
  };

  const mockActionNoCurrVal: Action = {
    id: 1,
    name: 'test',
    maxValue: 20,
    currentValue: 0,
  };

  const mockActionListDto = {
    actions: [],
  };

  const mockFilledActionList = {
    id: 1,
    actions: [1, 2, 3],
  };

  const mockEmptyActionList = {
    id: 1,
    actions: [],
  };

  const mockActionListRepository = {
    find: jest.fn(() => []),
    save: jest.fn((dto) => {
      return Promise.resolve({
        id: 1,
        ...dto,
      });
    }),
  };
  const mockActionService = {
    findOne: jest.fn(() => {
      return mockAction;
    }),
    remove: jest.fn(() => {
      return {};
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
      providers: [
        ActionListService,
        ActionService,
        {
          provide: getRepositoryToken(ActionList),
          useValue: mockActionListRepository,
        },
      ],
    })
      .overrideProvider(ActionService)
      .useValue(mockActionService)
      .compile();

    service = module.get<ActionListService>(ActionListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an action list', async () => {
    expect(await service.create(mockActionListDto)).toEqual({
      id: expect.any(Number),
      ...mockActionListDto,
    });
  });

  it(`shouldn't create an action list and throw and error`, () => {
    //Mocking the service to run have and existing entity in DB
    jest.spyOn(service, 'findAll').mockImplementation(() => {
      return Promise.resolve([{ id: 1, actions: [] }]);
    });

    expect(async () => {
      return await service.create(mockActionListDto);
    }).rejects.toThrow(UnauthorizedException);
  });

  /*
  it("should throw unauthorize exception because the action don't have enough value to execute", () => {
    jest
      .spyOn(mockActionService, 'findOne')
      .mockResolvedValueOnce(mockActionNoCurrVal);
    expect(async () => {
      return await service.executeFirstAction();
    }).rejects.toThrow(UnauthorizedException);
  });
  */

  it('should throw NotFoundException', () => {
    //Mocking the service to run an empty array of results
    jest.spyOn(service, 'findAll').mockImplementation(() => {
      return Promise.resolve([]);
    });

    expect(async () => {
      return await service.find();
    }).rejects.toThrow(NotFoundException);

    expect(async () => {
      await service.executeFirstAction();
    }).rejects.toThrow(NotFoundException);

    jest.spyOn(service, 'find').mockImplementation(() => {
      return Promise.resolve(null);
    });
    expect(async () => {
      return await service.addAction(1);
    }).rejects.toThrow(NotFoundException);

    jest.spyOn(service, 'find').mockResolvedValueOnce(mockEmptyActionList);
    expect(async () => {
      return await service.removeAction(2);
    }).rejects.toThrow(NotFoundException);

    jest.spyOn(service, 'find').mockResolvedValueOnce(null);
    expect(async () => {
      return await service.removeAction(2);
    }).rejects.toThrow(NotFoundException);
  });

  it('should delete the specified action in the action list', async () => {
    //Mocking the service to run an empty array of results
    jest.spyOn(service, 'find').mockImplementation(() => {
      return Promise.resolve(mockFilledActionList);
    });

    expect(await service.removeAction(2)).toEqual({
      id: 1,
      actions: [1, 3],
    });
  });
});
