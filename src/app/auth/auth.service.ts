import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../core/enviroments/enviroments';
import { User } from '../core/models/user-response';
import { APIResponse } from '../core/models/response-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.api_router;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.get<APIResponse<User>>(
      `${this.apiUrl}/auth/login/${username}/${password}`
    );
  }
}
