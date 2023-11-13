import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { CurrentUser } from './auth/interfaces/current-user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'eltrello';

  constructor(private authService: AuthService) {}


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser: CurrentUser) => {
        this.authService.setCurrentUser(currentUser);
      },
      error: (_) => {
        this.authService.setCurrentUser(null);
      },
    });

    this.authService.isLoggedIn$.subscribe(res => console.log('IsLoggedIn', res));
  }
}
