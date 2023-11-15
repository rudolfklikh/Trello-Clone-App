import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { CurrentUser } from '../interfaces/current-user.interface';
import { environment } from '../../../environments/environment';
import { NullOrUndefined } from '../../shared/types/null-or-undefined.type';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { SocketService } from 'src/app/shared/services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUser | NullOrUndefined>(undefined);
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => !!currentUser)
  );

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/user`);
  }

  register(registerRequest: RegisterRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(
      `${environment.apiUrl}/users`,
      registerRequest
    );
  }

  login(loginRequest: LoginRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(
      `${environment.apiUrl}/users/login`,
      loginRequest
    );
  }

  setToken(currentUser: CurrentUser): void {
    localStorage.setItem('token', currentUser.token);
  }

  setCurrentUser(currentUser: CurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.socketService.disconnect();
  }
}
