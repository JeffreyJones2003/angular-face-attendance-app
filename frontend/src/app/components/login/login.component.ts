import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ✅ Make sure path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  login() {
    const loginPayload = {
      username: this.username,
      password: this.password,
    };

    this.errorMessage = '';
    console.log('🔐 Attempting login...', loginPayload);

    this.http.post<{ access_token: string }>('http://localhost:8000/login/', loginPayload).subscribe({
      next: (res) => {
        console.log('✅ Login successful:', res.access_token);
        this.authService.login(res.access_token); // ✅ Use safe login method

        // Safe redirect
        this.router.navigate(['/recognizer']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
        console.error('❌ Login failed');
      }
    });
  }
}