import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { RegisterRequest } from '../../interfaces/register-request.interface';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  errorMessage: string | null = null;

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private socketService: SocketService) {}

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.authService.login(this.form.value as LoginRequest).subscribe({
      next: (user: CurrentUser) => {
        this.authService.setToken(user);
        this.authService.setCurrentUser(user);
        this.socketService.setupSocketConnection(user);
        this.errorMessage = null;

        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as Record<string, string>)['emailOrPassword'];
      },
    });
  }
}
