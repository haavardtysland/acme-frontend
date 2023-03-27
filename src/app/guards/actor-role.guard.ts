import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActorRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      const expectedRole = route.data['expectedRole'];
      const actorRole: string | null = this.authService.getCurrentActorRole();
      const token = localStorage.getItem('token');
      let result = false;
      if (token && actorRole) {
        const activeRole = new RegExp(actorRole.toString(), 'i');
        if (expectedRole.search(activeRole) !== -1) {
          result = true;
        }
      } else {
        this.router.navigate(['login']);
      }
      resolve(result);
    });
  }
}
