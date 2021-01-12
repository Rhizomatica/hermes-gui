import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user';
import { isBoolean } from 'util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

    users: User[];
    private baseURL = 'http://floresta.hermes.radio:1011/api.php?p=2';
  
    getUsers(): Observable<User[]> {
      return this.http.get(this.baseURL).pipe(
        map((res:any) => {
          this.users = res;
          console.log(this.users);
          return this.users;
      }),
      catchError(this.handleError));
    }

    getUser(): {}

    deleteUser(): Observable<User[]>{
      //delete
      return;

    }

    createUser(): Observable<User[]>{
    //post          
    return this.users;

    }

    updateUser(): Observable<User[]>{
      //put
      }


    private handleError(error: HttpErrorResponse) {
      console.log(error);
      // return an observable with a user friendly message
      return throwError('Error! something went wrong: ');
    }

    private log (message: string) {
      this.alertService.add(`Users: ${message}`);
    }



}
