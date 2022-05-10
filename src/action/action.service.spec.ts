import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks/tasks.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { Action } from './entities/action.entity';

describe('ActionService', () => {
  let service: ActionService;

  class CurrValueGeneratedActionDTO {
    name: string;
    maxValue: number;
    currentValue: number;
  }

  const mockActionDTO: CreateActionDto = {
    name: 'a',
    maxValue: 20,
  };

  const mockAction: Action = {
    id: 1,
    name: 'a',
    maxValue: 20,
    currentValue: 18,
  };

  const mockAction2: Action = {
    id: 2,
    name: 'b',
    maxValue: 25,
    currentValue: 2,
  };

  const repositoryValue = {
    find: jest.fn().mockResolvedValue([mockAction, mockAction2]),
    findOne: jest.fn().mockResolvedValue(mockAction),
    save: jest.fn((action: CurrValueGeneratedActionDTO) => {
      return Promise.resolve({
        id: 1,
        ...action,
      });
    }),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
      controllers: [ActionController],
      providers: [
        ActionService,
        {
          provide: getRepositoryToken(Action),
          useValue: {
            ...repositoryValue,
          },
        },
      ],
      exports: [ActionService],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an action having currentValue between 80% and 100% of the maxValue attribute', async () => {
    expect(
      (await service.create(mockActionDTO)).currentValue,
    ).toBeGreaterThanOrEqual(Math.ceil(0.8 * mockActionDTO.maxValue));

    expect(
      (await service.create(mockActionDTO)).currentValue,
    ).toBeLessThanOrEqual(mockActionDTO.maxValue);
  });

  it('should decrement the currValue of an action', async () => {
    const currentValue = mockAction.currentValue;
    expect(await service.useAction(mockAction.id)).toEqual({
      id: mockAction.id,
      name: mockAction.name,
      maxValue: mockAction.maxValue,
      currentValue: currentValue - 1,
    });
  });

  it("shouldn't decrement the currentValue and throw an action", () => {
    jest.spyOn(service, 'findOne').mockImplementation(() => {
      return Promise.resolve(null);
    });
    expect(async () => {
      return await service.useAction(1);
    }).rejects.toThrow(NotFoundException);
  });

  it('should reset the current value beetween 80% and 100% of the maximum value', async () => {
    const resetedAction = await service.resetValue(mockAction.id);
    expect(resetedAction.currentValue).toBeGreaterThanOrEqual(
      Math.ceil(0.8 * mockAction.maxValue),
    );
    expect(resetedAction.currentValue).toBeLessThanOrEqual(mockAction.maxValue);
  });

  it('should throw a not found exception', () => {
    jest.spyOn(repositoryValue, 'findOne').mockImplementation(() => {
      return Promise.resolve(null);
    });
    expect(async () => {
      return await service.resetValue(mockAction.id);
    }).rejects.toThrow(NotFoundException);
  });
  /*
  it('should all the current value beetween 80% and 100% of the maximum value', async () => {
    const resetedActions = await service.resetAllValues();
    expect(resetedActions.currentValue).toBeGreaterThanOrEqual(
      0.8 * mockAction.maxValue,
    );
    expect(resetedAction.currentValue).toBeLessThanOrEqual(mockAction.maxValue);
  });
  */
});
