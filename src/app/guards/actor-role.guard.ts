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
import { Actor } from '../models/actor.model';

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
      const actor: Actor = this.authService.getCurrentActor();
      console.log(actor);
      let result = false;
      if (actor) {
        const activeRole = new RegExp(actor.role.toString(), 'i');
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
