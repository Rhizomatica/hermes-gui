// OLD - Still works but deprecated
{ path: 'home', component: HomeComponent }

// BETTER - Use CanActivate guards for auth
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] }import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../interfaces/user';
// import { isBoolean } from 'util';// ❌ Avoid JSON.parse on localStorage
// this.currentTheme = JSON.parse(localStorage.getItem('dark-mode')).darkMode == true ? 'dark' : 'light';

// ✅ Better approach
const stored = localStorage.getItem('dark-mode');
this.currentTheme = stored ? JSON.parse(stored).darkMode ? 'dark' : 'light' : 'light';import { NO_ERRORS_SCHEMA } from '@angular/core';

@NgModule({
  // ...
  schemas: [NO_ERRORS_SCHEMA]  // Add this
})// ❌ Using deprecated patterns
// const params = new HttpParams();
// params.set('reportProgress', 'true');

// ✅ Use immutable pattern
const params = new HttpParams()
  .set('reportProgress', 'true')
  .set('observe', 'events');  // In [src/app/components/admin/gps/gps.component.ts](src/app/components/admin/gps/gps.component.ts)
  // ❌ OLD
  // const res: any = await this.gpsService.getStoredGPSFiles().toPromise();
  
  // ✅ NEW
  import { lastValueFrom } from 'rxjs';
  const res: any = await lastValueFrom(this.gpsService.getStoredGPSFiles());  // ✅ Already using UntypedFormGroup (correct for Angular 15)
  allowUp: UntypedFormGroup;
  
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

  users: User[];
  user: User;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  getUsers(): Observable<User[]> {
    return this.http.get(GlobalConstants.apiURL + '/user').pipe(
      map((res: any) => {
        this.users = res;
        return this.users;
      }),
      catchError(this.handleError));
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number, email: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/user/${id}/${email}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError));
  }

  /** POST: add a new user to the database */
  createUser(user: User): Observable<User> {
    const url = `${GlobalConstants.apiURL}/user`;

    return this.http.post<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** POST: update a user  */
  updateUser(id: number, user: User): Observable<User> {
    const url = `${GlobalConstants.apiURL}/user/${id}`;
    return this.http.post<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    this.users = [];
    return throwError(error);
  }

}
