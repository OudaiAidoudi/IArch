import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRouting} from './app.routing';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LoginComponent} from './components/login/login.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MenuBarComponent} from './components/menu-bar/menu-bar.component';
import {ExamplePageComponent} from './pages/example-page/example-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {MatTableModule} from '@angular/material/table';
import {SalesManComponent} from './components/sales-man/sales-man.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {EvaluationRecordComponent} from './components/evaluation-record/evaluation-record.component';
import {MatListModule} from '@angular/material/list';
import {BonusPageComponent} from './pages/bonus-page/bonus-page.component';
import {BonusesComponent} from './components/bonuses/bonuses.component';
import {BonusDetailComponent} from './components/bonus-detail/bonus-detail.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatMenuModule} from '@angular/material/menu';
import { SalesmanComponent } from './components/salesman/salesman.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        ExamplePageComponent,
        NotFoundPageComponent,
        SalesManComponent,
        EvaluationRecordComponent,
        BonusPageComponent,
        BonusesComponent,
        BonusDetailComponent,
        SalesmanComponent,
        DashboardComponent
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
        MatListModule,
        NgxSpinnerModule,
        MatMenuModule,
        MatSelectModule,
        NgbModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}
