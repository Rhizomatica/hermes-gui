import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less']
})
export class SwitchComponent {

  constructor() {
    this.name = 'Switch';
    this.i18n = 'Translate';
    this.disabled = ''
    this.value = 0
    this.customFunction = function(){ console.log("Custom function called with param: " + this.disabled); }
  }

  @Input() name: string
  @Input() i18n: string
  @Input() disabled: string
  @Input() value: number
  @Input() customFunction: any

  onSwitch() {
    try {
      eval(this.customFunction)
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit(): void {
  }

}
