import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUser } from '../interfaces/current-user.interface';
import { environment } from '../../../environments/environment';
import { NullOrUndefined } from '../../shared/types/null-or-undefined.type';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUser | NullOrUndefined>(undefined);

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/user`);
  }

  setCurrentUser(currentUser: CurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }
}
