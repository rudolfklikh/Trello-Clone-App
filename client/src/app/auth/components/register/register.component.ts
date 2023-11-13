import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterRequest } from '../../interfaces/register-request.interface';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMessage: string | null = null;

  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}
 
  onSubmit(): void {
    if (!this.form.valid) {
        return;
    }
   
    this.authService.register(this.form.value as RegisterRequest).subscribe({
      next: (user: CurrentUser) => {
        this.authService.setToken(user);
        this.authService.setCurrentUser(user);
        this.errorMessage = null;

        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as string[]).join(', ');
      }
   });

  }
}
