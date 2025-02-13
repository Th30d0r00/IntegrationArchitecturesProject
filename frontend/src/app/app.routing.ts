import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {AuthGuardService} from './services/auth-guard.service';
import {ExamplePageComponent} from './pages/example-page/example-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {SalesmenPageComponent} from './pages/salesmen-page/salesmen-page.component';
import {SpecificSalesmanPageComponent} from './pages/specific-salesman-page/specific-salesman-page.component';
import {PerformanceRecordPageComponent} from './pages/performance-record-page/performance-record-page.component';
import {AddPerformanceRecordPageComponent} from './pages/add-performance-record-page/add-performance-record-page.component';
// eslint-disable-next-line max-len
import {PerformanceRecordApprovalListPageComponent} from './pages/performance-record-approval-list-page/performance-record-approval-list-page.component';
import {ApprovePerformanceRecordPageComponent} from './pages/approve-performance-record-page/approve-performance-record-page.component';
import {UnauthorizedPageComponent} from './pages/unauthorized-page/unauthorized-page.component';
import {SalesmanViewPageComponent} from './pages/salesman-view-page/salesman-view-page.component';
import {
    PerformanceRecordSalesmanViewComponent
} from './pages/performance-record-salesman-view/performance-record-salesman-view.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import {
    UpdateRejectedPerformanceRecordPageComponent
} from './pages/update-rejected-performance-record-page/update-rejected-performance-record-page.component';

/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    {path: 'login', component: LoginPageComponent},
    {path: 'example', component: ExamplePageComponent, canActivate: [AuthGuardService]},
    {path: '', component: LandingPageComponent, canActivate: [AuthGuardService]},
    {path: 'salesmen', component: SalesmenPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'HR', 'Leader'] }},
    {path: 'salesmen/:sid', component: SpecificSalesmanPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'HR', 'Leader'] }},
    {path: 'performance-record/:sid/:year', component: PerformanceRecordPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'HR', 'Leader'] }},
    {path: 'add-performance-record/:sid', component: AddPerformanceRecordPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'HR'] }},
    { path: 'approval-list', component: PerformanceRecordApprovalListPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'Leader'] }
    },
    { path: 'statistics', component: StatisticsPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'Leader'] }
    },
    {path: 'approve-performance-record/:sid/:year', component: ApprovePerformanceRecordPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['admin', 'Leader'] }},
    {path: 'my-performance-records', component: SalesmanViewPageComponent, canActivate: [AuthGuardService],
        data: { roles: ['Sales'] }},
    {path: 'my-performance-records/:sid/:year', component: PerformanceRecordSalesmanViewComponent, canActivate: [AuthGuardService],
        data: { roles: ['Sales'] }},
    {path: 'update-rejected-performance-record/:sid/:year', component: UpdateRejectedPerformanceRecordPageComponent,
        canActivate: [AuthGuardService],
        data: { roles: ['admin', 'HR'] }},
    {path: 'unauthorized', component: UnauthorizedPageComponent},
    {path: '', redirectTo: '/salesmen', pathMatch: 'full'},
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
