import { Router } from '@angular/router';
import { HttpService } from './httpService.service';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuth: boolean = false;
    private token: string = '';
    private tokenTimer: any;
    private userId: string = '';
    private authStatusListner = new Subject<boolean>();
    isLoading: boolean = false;
    constructor(public http: HttpService, public router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuth;
    }
    getUserId() {
        return this.userId;
    }
    getAuthStatusListner() {
        return this.authStatusListner.asObservable();
    }
    createUser(email: string, password: string) {
        this.isLoading = true;
        this.http.createUser(email, password).subscribe(res => {
            this.router.navigate(['/']);
        }, err => { 
            console.log(err);
            this.isLoading = false;
        });
    }

    login(email: string, password: string) {
        this.isLoading = true;
        this.http.login(email, password).subscribe(res => {
            this.token = res.token;
            if (this.token) {
                let expiresIn = res.expiresIn;
                this.isAuth = true;
                this.userId = res.userId;
                this.authStatusListner.next(true);
                this.setExpireDuration(expiresIn);
                const now = new Date();
                const expDate = new Date(now.getTime() + res.expiresIn * 1000);
                this.saveAuthData(this.token, expDate, this.userId);
                this.router.navigate(['/']);
            }
        }, err => { 
            console.log(err);
            this.isLoading = false;
        })
    }

    logout() {
        this.token = '';
        this.isAuth = false;
        this.authStatusListner.next(false);
        this.userId = '';
        this.clearAuthData();
        clearInterval(this.tokenTimer);
        this.router.navigate(['/login']);
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        const now = new Date();
        const expireIn = authInfo.expiration.getTime() - now.getTime();
        if (expireIn > 0) {
            this.token = authInfo.token;
            this.isAuth = true;
            this.userId = authInfo.userId ? authInfo.userId : '';
            this.setExpireDuration(expireIn / 1000);
            this.authStatusListner.next(true);
        }
    }

    private setExpireDuration(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expDate)
            return {
                token: '',
                expiration: new Date('December 17, 1995 03:24:00'), // returning old date
                userId: ''
            }
        return {
            token: token,
            expiration: new Date(expDate),
            userId: userId
        }

    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');

    }
}