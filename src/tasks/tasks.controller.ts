// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(
    @Body() body: { title: string; description: string },
  ): Promise<Task> {
    return this.tasksService.createTask(body.title, body.description);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() body: { title: string; description: string },
  ): Promise<Task> {
    return this.tasksService.updateTask(id, body.title, body.description);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Put(':id/complete')
  async markTaskAsCompleted(@Param('id') id: number): Promise<Task> {
    return this.tasksService.markTaskAsCompleted(id);
  }
}
