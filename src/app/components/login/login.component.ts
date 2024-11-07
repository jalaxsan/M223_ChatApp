import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // Add Firestore imports

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private angularAuth: AngularFireAuth,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Login with Google
  onSignInClick() {
    this.angularAuth.signInWithPopup(new GoogleAuthProvider()).then((result) => {
      if (result.user) {
        this.addUserToFirestore(result.user);
        this.router.navigate(['home']);
        this.toast.success('Logged in with Google successfully');
      } else {
        console.error('User object is undefined');
      }
    }).catch(error => {
      this.toast.error('Error logging in with Google');
      console.error(error);
    });
  }

  async addUserToFirestore(user: any) {
    const usersCollection = collection(this.firestore, 'users');

    // Ensure all required fields are defined
    if (!user.uid || !user.email || !user.displayName) {
      console.error("User data is incomplete:", user);
      return;
    }

    try {
      await addDoc(usersCollection, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      console.log('User added to Firestore');
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
    }
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: 'There was an error',
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
