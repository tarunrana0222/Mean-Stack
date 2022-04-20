import { AuthService } from './../../services/auth.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { post } from '../post.model';
import { PostService } from '../../services/postService.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  
  posts: post[] = [];
  postSub!: Subscription;
  isLoading: boolean = false;
  totalPosts: number = 0;
  postPerPage: number = 2;
  postSizeOption: number[] = [1, 2, 5, 10];
  currPage: number = 1;
  userAuthSub!: Subscription;
  userAuthenticated: boolean = false;
  userId: string = '';
  constructor(public postSev: PostService,public auth : AuthService) { 
    
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postSev.getPosts(this.postPerPage, this.currPage);
    this.userId = this.auth.getUserId();
    this.postSub = this.postSev.getPostUpdateListner().subscribe((newPosts: { posts: post[], totalPosts: number }) => {
      this.posts = newPosts.posts;
      this.totalPosts = newPosts.totalPosts;
      this.isLoading = false;
    }, err => { 
      console.log(err);
      this.isLoading = false;
    });
    this.userAuthenticated = this.auth.getIsAuth();
    this.userAuthSub = this.auth.getAuthStatusListner().subscribe(isAuth => { 
      this.userAuthenticated = isAuth;
      this.userId = this.auth.getUserId();
    })
  }

  onDelete(id: string) { 
    this.isLoading = true;
    if (this.posts.length == 1 && this.currPage != 1 && (this.totalPosts / this.postPerPage) == this.currPage)
      this.currPage -= 1;
    this.postSev.deletePost(id).subscribe(res => { 
      this.postSev.getPosts(this.postPerPage, this.currPage);
    }, err => { 
      console.log(err);
      this.isLoading = false;
    })
  }

  
  
  onPageChange(event: PageEvent) { 
    this.isLoading = true;
    this.postPerPage = event.pageSize;
    this.currPage = event.pageIndex+1;
    this.postSev.getPosts(this.postPerPage, this.currPage);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.userAuthSub.unsubscribe();
  }

}
