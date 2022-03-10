import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../user';
// import { isBoolean } from 'util';
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
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };

    getUsers(): Observable<User[]> {
      return this.http.get(GlobalConstants.apiURL + '/user').pipe(
        map((res: any) => {
          this.users = res;
          console.log('⚚ user service: ');
          return this.users;
      }),
      catchError(this.handleError));
    }

    /** DELETE: delete the user from the server */
    deleteUser(id: number, email: string): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/user/${id}/${email}`;
      console.log('⚚ message service - deleteUser');
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

recoverPassword(email, answ): Observable<{}> {
  const url = `${GlobalConstants.apiURL}/user/recover/`;
  const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('recoveranswer', answ);
  return this.http.post(url, formData).pipe(
    map((res: any) => {
      console.log('⚚ user service: password recovery');
        return res;
    }),
   catchError(this.handleError));
}

    private handleError(error: HttpErrorResponse) {
      this.users = [];
	  console.log('⚚ Hermes ⚚\n⚚ user service  error - :\n ', error);
	    return throwError(error);
    }

}
