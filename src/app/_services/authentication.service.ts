import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { GlobalConstants } from '../global-constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(private http: HttpClient) {
        const currentUserData = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(currentUserData ? JSON.parse(currentUserData) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(femail: string, fpassword: string) {
        const data = { email: femail, password: fpassword };
        return this.http.post<any>(`${GlobalConstants.apiURL}/login`, data)
            .pipe(map(
                user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.currentUser = this.currentUserSubject.asObservable();

                    return user;
                }
            ));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.currentUser = new Observable<User>;
    }
}
