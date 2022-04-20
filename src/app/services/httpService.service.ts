import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { post } from "../posts/post.model";
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class HttpService {
    

    constructor(public http: HttpClient) { }

    createUser(email: string, password: string) {
        const user = { email: email, password: password };
        return this.http.post('http://localhost:3000/api/user/signup', user);
    }

    login(email: string, password: string) { 
        const user = { email: email, password: password };
        return this.http.post<{token:string,expiresIn:number,userId:string}>('http://localhost:3000/api/user/login', user);
    }

    getPosts(postPerPage: number, currentPage: number) {
        const querryParams = `?pagesize=${postPerPage}&currpage=${currentPage}`;
        return this.http.get<{ message: string, posts: any, totalPosts: number }>('http://localhost:3000/api/posts' + querryParams)
            .pipe(map((res) => {
                return {
                    posts: res.posts.map((post: any) => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator:post.creator
                        };
                    }),
                    total: res.totalPosts
                }
            }));
    }

    getSinglePost(id: string) {
        return this.http.get<post>('http://localhost:3000/api/post/' + id);
    }

    savePosts(post: FormData) {
        return this.http.post<{ message: string, post: post }>('http://localhost:3000/api/save', post);
    }

    updatePost(updatedPost: FormData, id: string) {
        return this.http.put('http://localhost:3000/api/update/' + id, updatedPost);
    }

    deletePost(id: string) {
        return this.http.delete('http://localhost:3000/api/post/' + id);
    }
}