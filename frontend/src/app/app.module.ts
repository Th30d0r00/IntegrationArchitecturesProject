import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {MatTableModule} from '@angular/material/table';
import { SalesmenPageComponent } from './pages/salesmen-page/salesmen-page.component';
import { SpecificSalesmanPageComponent } from './pages/specific-salesman-page/specific-salesman-page.component';
import { PerformanceRecordPageComponent } from './pages/performance-record-page/performance-record-page.component';
import { AddPerformanceRecordPageComponent } from './pages/add-performance-record-page/add-performance-record-page.component';
import { PerformanceRecordApprovalListPageComponent } from './pages/performance-record-approval-list-page/performance-record-approval-list-page.component';
import { ApprovePerformanceRecordPageComponent } from './pages/approve-performance-record-page/approve-performance-record-page.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        ExamplePageComponent,
        NotFoundPageComponent,
        SalesmenPageComponent,
        SpecificSalesmanPageComponent,
        PerformanceRecordPageComponent,
        AddPerformanceRecordPageComponent,
        PerformanceRecordApprovalListPageComponent,
        ApprovePerformanceRecordPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRouting,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
