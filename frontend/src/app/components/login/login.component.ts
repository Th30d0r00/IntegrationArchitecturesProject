import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Credentials} from '../../models/Credentials';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    // object for input-binding
    credentials: Credentials;

    loginError: string;

    constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

    ngOnInit(): void {
        this.resetCredentials();
    }

    /**
     * handles login operation, by calling the authService
     */
    performLogin(): void{
        this.authService.login(this.credentials).subscribe((response): void => {
            if (response.status === 200){ // if response status is 200, assume login was successful
                this.resetCredentials();
                this.enterApplication();
            }else{
                this.loginError = response.body as string;
            }
        },
        (error: HttpErrorResponse): void => {
            this.loginError = error.error as string;
        }
        );
    }

    /**
     * resets login form
     */
    resetCredentials(): void{
        this.credentials = new Credentials('', '');
    }

    /**
     * redirects to the landing page
     */
    enterApplication(): void {
        this.userService.getOwnUser().subscribe((userdata: User): void  => {
            if (userdata.role === 'Sales') {
                void this.router.navigate(['/my-performance-records']);
            } else {
                void this.router.navigate(['']);
            }
        });
    }


}
