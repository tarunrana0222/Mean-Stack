import { AuthGaurd } from './services/guard/auth.gaurd';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        component : PostListComponent
    },
    {
        path: 'login',
        component : LoginComponent
    },
    {
        path: 'signup',
        component : SignupComponent
    },
    {
        path: 'create',
        component: PostCreateComponent,
        canActivate :   [AuthGaurd]
    },
    {
        path: 'edit/:postId',
        component: PostCreateComponent,
        canActivate :   [AuthGaurd]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers : [AuthGaurd]
})
export class AppRoutingModoule { 

}