import { AuthService } from './../auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class AuthGaurd implements CanActivate {
    constructor(public auth:AuthService,public router :Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let isAuth = this.auth.getIsAuth();
        if (!isAuth) { 
            this.router.navigate(['/login']);
        }
        return isAuth;  
    }

}