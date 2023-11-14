import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { BoardInterface } from '../interfaces/board.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class BoardsService {
    constructor(private http: HttpClient) {}

    getBoards(): Observable<BoardInterface[]> {
        return this.http.get<BoardInterface[]>(`${environment.apiUrl}/boards`);
    }

    createBoard(title: string): Observable<BoardInterface> {
        return this.http.post<BoardInterface>(`${environment.apiUrl}/boards`, { title });
      }
}
