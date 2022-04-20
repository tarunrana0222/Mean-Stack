import { AuthService } from './../auth.service';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from '@angular/core';
@Injectable()
export class AuthInterceptor implements HttpInterceptor { 
    constructor ( public auth:AuthService ){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.auth.getToken();
        let authReq = req.clone({
            headers: req.headers.set("authorization", "Bearer "+token)
        });
        return next.handle(authReq);
     }
}