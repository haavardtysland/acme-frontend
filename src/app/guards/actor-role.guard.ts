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
      let result = false;
      if (actor) {
        if (expectedRole.indexOf(actor.role) !== -1) {
          result = true;
        } else {
          this.router.navigate(['denied-access']);
        }
      } else {
        //Håvard se på det her, skjønner ikke koden.
        //Hvis man tar bort kommentaren som det er gjort slipper man å havne
        //på login hver gang man refresher. 
        //this.router.navigate(['login']);
      }
      resolve(result);
    });
  }
}
