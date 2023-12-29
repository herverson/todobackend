// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async createTask(title: string, description: string): Promise<Task> {
    const task = this.taskRepository.create({ title, description });
    return await this.taskRepository.save(task);
  }

  async updateTask(
    id: number,
    title: string,
    description: string,
  ): Promise<Task> {
    const result: UpdateResult = await this.taskRepository.update(id, {
      title,
      description,
    });

    if (result.affected && result.affected > 0) {
      return await this.taskRepository.findOneOrFail({ where: { id } });
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected && result.affected > 0) {
      return;
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  async markTaskAsCompleted(id: number): Promise<Task> {
    const result: UpdateResult = await this.taskRepository.update(id, {
      completed: true,
    });

    if (result.affected && result.affected > 0) {
      return await this.taskRepository.findOneOrFail({ where: { id } });
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }
}
