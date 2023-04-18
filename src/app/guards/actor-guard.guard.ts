import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
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
export class ActorGuardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      const id = this.route.snapshot.params['id'];
      const actor: Actor = this.authService.getCurrentActor();
      let result = false;
      if (actor) {
        if (id === this.authService.getCurrentActor()._id) {
          result = true;
        } else {
          this.router.navigate(['denied-access']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      resolve(result);
    });
  }
}
