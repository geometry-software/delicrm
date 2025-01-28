import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { SignalService } from "../services/signal.service";

@Injectable({ providedIn: 'root' })
export class ToolbarGuard implements CanActivate {

    constructor(
        private signalService: SignalService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.signalService.setToolbarTitle(route.data['title'])
        return true
    }
}