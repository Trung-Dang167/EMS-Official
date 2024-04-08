import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlarmComponent } from './alarm/alarm.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { FormsModule } from '@angular/forms';
import { ServerService } from './shared/server.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModifyDashboardComponent } from './dashboard/modify-dashboard/modify-dashboard.component';
import { RangeModificationComponent } from './setting/range-modification/range-modification.component';
import { DateConvertPipe } from './shared/date-convert.pipe';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { NotificationService } from './shared/notification.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { AuthInterceptorService } from './shared/auth-interceptor.service';
import { StatisticsListComponent } from './statistics-list/statistics-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    AlarmComponent,
    BodyComponent,
    DashboardComponent,
    SidenavComponent,
    SublevelMenuComponent,
    ModifyDashboardComponent,
    DateConvertPipe,
    RangeModificationComponent,
    LoginComponent,
    SignupComponent,
    StatisticsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ServerService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
