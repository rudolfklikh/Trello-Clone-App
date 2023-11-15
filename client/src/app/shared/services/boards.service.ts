import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { Board } from '../interfaces/board.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class BoardsService {
    constructor(private http: HttpClient) {}

    getBoards(): Observable<Board[]> {
        return this.http.get<Board[]>(`${environment.apiUrl}/boards`);
    }

    getBoard(boardId: string): Observable<Board> {
        return this.http.get<Board>(`${environment.apiUrl}/boards/${boardId}`);
    }

    createBoard(title: string): Observable<Board> {
        return this.http.post<Board>(`${environment.apiUrl}/boards`, { title });
      }
}
