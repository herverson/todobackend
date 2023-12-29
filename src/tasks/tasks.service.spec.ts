// src/tasks/tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

describe('TasksService', () => {
  let tasksService: TasksService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
        },
      ];
      mockRepository.find.mockReturnValueOnce(expectedTasks);

      const result = await tasksService.getAllTasks();

      expect(result).toEqual(expectedTasks);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTaskData = { title: 'New Task', description: 'New Description' };
      const createdTask = { id: 2, ...newTaskData, completed: false };

      mockRepository.create.mockReturnValueOnce(createdTask);
      mockRepository.save.mockReturnValueOnce(createdTask);

      const result = await tasksService.createTask(
        newTaskData.title,
        newTaskData.description,
      );

      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = 1;
      const updatedTaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      const updatedTask = { id: taskId, ...updatedTaskData, completed: false };

      mockRepository.update.mockReturnValueOnce({ affected: 1 });
      mockRepository.findOneOrFail.mockReturnValueOnce(updatedTask);

      const result = await tasksService.updateTask(
        taskId,
        updatedTaskData.title,
        updatedTaskData.description,
      );

      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const taskId = 999;
      mockRepository.update.mockReturnValueOnce({ affected: 0 });

      await expect(
        tasksService.updateTask(taskId, 'Invalid Title', 'Invalid Description'),
      ).rejects.toThrowError('Task with id 999 not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const taskId = 1;

      mockRepository.delete.mockReturnValueOnce({ affected: 1 });

      await tasksService.deleteTask(taskId);

      expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const taskId = 999;
      mockRepository.delete.mockReturnValueOnce({ affected: 0 });

      await expect(tasksService.deleteTask(taskId)).rejects.toThrowError(
        'Task with id 999 not found',
      );
    });
  });

  describe('markTaskAsCompleted', () => {
    it('should mark an existing task as completed', async () => {
      const taskId = 1;
      const completedTask = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
      };

      mockRepository.update.mockReturnValueOnce({ affected: 1 });
      mockRepository.findOneOrFail.mockReturnValueOnce(completedTask);

      const result = await tasksService.markTaskAsCompleted(taskId);

      expect(result).toEqual(completedTask);
    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const taskId = 999;
      mockRepository.update.mockReturnValueOnce({ affected: 0 });

      await expect(
        tasksService.markTaskAsCompleted(taskId),
      ).rejects.toThrowError('Task with id 999 not found');
    });
  });
});
