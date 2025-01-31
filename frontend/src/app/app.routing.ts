import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {AuthGuardService} from './services/auth-guard.service';
import {ExamplePageComponent} from './pages/example-page/example-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {SalesManComponent} from './components/sales-man/sales-man.component';
import {EvaluationRecordComponent} from './components/evaluation-record/evaluation-record.component';
import {Bonus} from './models/Bonus';
import {BonusesComponent} from './components/bonuses/bonuses.component';
import {BonusDetailComponent} from './components/bonus-detail/bonus-detail.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
const ROLES = {CEO: 'CEO', HR: 'HR', SALESMAN: 'SALESMAN'};
/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], data: {roles: [ROLES.CEO, ROLES.HR, ROLES.SALESMAN]}},
    {path: 'Example', component: ExamplePageComponent, canActivate: [AuthGuardService]},
    {path: '', component: LandingPageComponent, canActivate: [AuthGuardService]},
    {path: 'SalesMan', component: SalesManComponent, canActivate: [AuthGuardService]},
    {path: 'EvaluationRecord', component: EvaluationRecordComponent, canActivate: [AuthGuardService]},
    {path: 'bonus', component: BonusesComponent, canActivate: [AuthGuardService]},
    {path: 'bonuses/detail/:id', component: BonusDetailComponent,  data: {roles: [ROLES.CEO, ROLES.HR]}},
    {path: '**', component: NotFoundPageComponent} // these entries are matched from top to bottom => not found should be the last entry
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouting { }
