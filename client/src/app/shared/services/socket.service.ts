import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { Board } from '../interfaces/board.interface';
import { environment } from 'src/environments/environment';
import { CurrentUser } from 'src/app/auth/interfaces/current-user.interface';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketService {
    socket: Socket | undefined;

    constructor(private http: HttpClient) {}

    setupSocketConnection(currentUser:  CurrentUser): void {
        this.socket = io(`${environment.socketUrl}`, {
            auth: {
                token: currentUser.token
            }
        });
    }
    
    disconnect(): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }

        this.socket.disconnect();
    }

    emit(eventName: string, message: any): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }

        this.socket.emit(eventName, message);
    }

    listen<T>(eventName: string): Observable<T> {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }

        return new Observable((subcriber) => {
            this.socket?.on(eventName, (data) => {
                subcriber.next(data);
            })
        });
    }

}
