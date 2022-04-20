import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { post } from "../posts/post.model";
import { HttpService } from "./httpService.service";


@Injectable({ providedIn: 'root' })
export class PostService {
    constructor(public httpServ: HttpService, public router: Router) { }
    
    isLoading: boolean = false;
    private posts: post[] = [];
    private postUpdated = new Subject<{posts:post[],totalPosts :number}>();

    getPosts(postPerPage :number,currentPage:number) {
        this.httpServ.getPosts(postPerPage,currentPage).subscribe((res: {posts:post[],total:number}) => {
            this.posts = res.posts;
            this.postUpdated.next({posts:[...this.posts],totalPosts:res.total});
        }, err => { 
            console.log(err);
        });

    }

    getPostUpdateListner() {
        return this.postUpdated.asObservable();
    }

    getPostById(id: string) {
        return this.httpServ.getSinglePost(id);  // returning observable beacuse we dont want result here
    }

    addPost(title: string, content: string, image: File) {
        const formData = new FormData();
        formData.append('title', title)
        formData.append('content', content);
        formData.append('image', image, title);

        this.httpServ.savePosts(formData).subscribe((res) => {
            this.router.navigate(['/']);  // to navigate back to homepage
        }, err => { 
            console.log(err);
        })

    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let formData: any;
        if (typeof (image) === 'object') {
            formData = new FormData();
            formData.append('id', id);
            formData.append('title', title)
            formData.append('content', content);
            formData.append('image', image, title);
        }
        else {
            formData = { id: id, title: title, content: content, imagePath: image };
        }
        this.httpServ.updatePost(formData, id).subscribe((res) => {
            this.router.navigate(['/']);   // to navigate back to homepage
        }, err => { 
            console.log(err);
        });
    }

    deletePost(id: string) {
       return this.httpServ.deletePost(id);
    }
}