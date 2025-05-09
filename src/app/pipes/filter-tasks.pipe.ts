import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({
  name: 'filterTasks',
  standalone: true
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], completed: boolean): Task[] {
    return tasks.filter(task => task.completed === completed);
  }
} 