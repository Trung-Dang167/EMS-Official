import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../shared/server.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-range-modification',
  templateUrl: './range-modification.component.html',
  styleUrls: ['./range-modification.component.scss']
})
export class RangeModificationComponent implements OnInit{
  alarmCusForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private srv: ServerService,
    private _dialogRef: MatDialogRef<RangeModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private noti: NotificationService
  ) {
    this.alarmCusForm = this._fb.group({
      tag: '',
      name: '',
      maxValue: '',
      alarmValue: ''
    });
  }

  ngOnInit(): void {
    this.alarmCusForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.alarmCusForm.valid) {
      if (this.data) {
        this.srv
          .customize(this.alarmCusForm.value)
          .subscribe({
            next: (val: any) => {
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
