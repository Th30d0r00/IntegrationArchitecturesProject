import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/User';

/**
 * This service implements the CanActivate interface
 * It enables Angular router to check whether a user is allowed to access a page or not
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService.isLoggedIn().pipe(
            switchMap((loggedIn: boolean): Observable<boolean> => {
                // Umleitung auf die Login-Seite, wenn der Benutzer nicht angemeldet ist
                if (!loggedIn) {
                    void this.router.navigate(['login']);
                    return of(false);
                }

                // Abfrage der Benutzerdaten nach dem Login
                return this.userService.getOwnUser().pipe(
                    map((user: User): boolean => {
                        const requiredRoles = route.data?.roles as string[];
                        if (requiredRoles && !requiredRoles.includes(user.role)) {
                            // Wenn die Rolle des Benutzers nicht übereinstimmt, weiterleiten
                            void this.router.navigate(['unauthorized']);
                            return false;
                        }

                        return true;
                    })
                );
            })
        );
    }
}
