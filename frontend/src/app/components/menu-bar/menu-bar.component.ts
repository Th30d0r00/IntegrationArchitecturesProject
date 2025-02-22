import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit {
    user: User;

    /*
    This array holds the definition of the menu's buttons.
   */

    buttons = [
        { title: 'Welcome', routerLink: '', roles: ['admin'] },
        { title: 'Example', routerLink: 'example', roles: ['admin'] },
        {
            title: 'Salesmen',
            routerLink: 'salesmen',
            roles: ['Leader', 'HR', 'admin'],
        },
        {
            title: 'Approval List',
            routerLink: 'approval-list',
            roles: ['Leader', 'admin'],
        },
        {
            title: 'My Records',
            routerLink: 'my-performance-records',
            roles: ['Sales'],
        },
        {
            title: 'Statistics',
            routerLink: 'statistics',
            roles: ['admin', 'Leader'],
        },
    ];

    /**
     * The following parameters specify objects, which will be provided by dependency injection
     *
     * @param authService
     * @param router
     * @param userService
     */
    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.fetchUser();
    }

    /**
     * function which handles clicking the logout button
     */
    handleLogout(): void {
        this.authService.logout().subscribe();
        void this.router.navigate(['login']); // after logout go back to the login-page
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            console.log(user);
        });
    }
}
