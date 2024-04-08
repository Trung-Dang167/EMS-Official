import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../shared/server.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-modify-dashboard',
  templateUrl: './modify-dashboard.component.html',
  styleUrls: ['./modify-dashboard.component.scss']
})
export class ModifyDashboardComponent {
  dashForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private srv: ServerService,
    private _dialogRef: MatDialogRef<ModifyDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private noti: NotificationService
  ) {
    this.dashForm = this._fb.group({
      tag: '',
      name: '',
      // expectedValue: '',
      realtimeValue: '',
      unit: '',
      status: ''
    });
  }

  ngOnInit(): void {
    this.dashForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.dashForm.valid) {
      if (this.data) {
        this.srv
          .update(this.dashForm.value)
          .subscribe({
            next: (val: any) => {
              console.log(this.dashForm.value)
              this.noti.openSnackBar("Success!")
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      }
    }
  }

}
