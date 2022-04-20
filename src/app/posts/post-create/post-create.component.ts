import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { post } from '../post.model';
import { PostService } from '../../services/postService.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator'
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(public postServ: PostService, public route: ActivatedRoute) { }
  editMode: boolean = false;
  postId: string | null = null;
  post: any;
  isLoading: boolean = false;
  form!: FormGroup;
  imageUrl: string | null | ArrayBuffer = '';
  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'image': new FormControl(null, { validators: [Validators.required],asyncValidators:[mimeType] })

    });
    this.route.paramMap.subscribe((params) => {
      if (params.has('postId')) {
        this.editMode = true;
        this.postId = params.get('postId');
        this.isLoading = true;
        this.postId != null ?
          this.postServ.getPostById(this.postId).subscribe(res => {
            this.post = res;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
            this.imageUrl = this.post.imagePath
            this.isLoading = false;
          }, err => { 
            this.isLoading = false;
            console.log(err);
            
          }) : console.log("ID null");
      }
      else {
        this.editMode = false;
      }
    })
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    let value = this.form.value;
    if (this.editMode && this.postId) {
      this.postServ.updatePost(this.postId, value.title, value.content, value.image);
    }
    else {
      this.postServ.addPost(value.title, value.content, value.image);
    }
    this.form.reset();
  }
  onImagePicked(event: Event) {
    let file = (event.target as HTMLInputElement).files;
    if (file && file[0]) {
      this.form.patchValue({ image: file[0] });
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file[0]);
    }
    else {
      this.form.patchValue({ image: null });
      this.form.get('image')?.updateValueAndValidity();
    }

  }

}
