import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';


@Component({
  selector: 'app-datetime-picker-dialog',
  templateUrl: './datetime-picker-dialog.component.html',
  styleUrls: ['./datetime-picker-dialog.component.scss'],
})
export class DatetimePickerDialogComponent implements OnInit {
  @ViewChild('picker') picker: any;

  public minDate: moment.Moment;
  public disabled = false;
  public maxDate: moment.Moment;
  public showSpinners = true;
  public showSeconds = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public touchUi = false;
  public color: ThemePalette = 'primary';

  public dateControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DatetimePickerDialogComponent>
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close(false);
  }
}
