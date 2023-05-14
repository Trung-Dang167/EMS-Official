import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsListComponent } from './settings-list/settings-list.component';

const routes: Routes = [
  {
    path: 'customize',
    component: SettingsListComponent
  },
  {
    path: 'logout',
    component: SettingsListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
