import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { Board } from '../interfaces/board.interface';
import { environment } from 'src/environments/environment';
import { Column } from '../interfaces/column.interface';
import { ColumnInput } from '../interfaces/column-input.interface';
import { SocketService } from './socket.service';
import { SocketEvents } from '../enums/socket-events.enum';
import { Task } from '../interfaces/task.interface';
import { TaskInput } from '../interfaces/task-input.interface';

@Injectable()
export class TasksService {
    constructor(private http: HttpClient, private socketService: SocketService) {}

    getTasks(columnId: string): Observable<Task[]> {
        return this.http.get<Task[]>(`${environment.apiUrl}/boards/${columnId}/tasks`);
    }

    createTask(taskInput: TaskInput): void {
        this.socketService.emit(SocketEvents.TASK_CREATE, taskInput);
    } 
}
