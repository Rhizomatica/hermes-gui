import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less']
})
export class SwitchComponent implements OnChanges {

  constructor() {
    this.inputName = 'Switch';
    this.label = 'switch'
    this.i18n = 'Translate';
    this.enabled = ''
    this.value = 0
    this.customFunction = function () { console.log("Custom function called with param: " + this.disabled); }
  }

  @Input() inputName: string
  @Input() label: string
  @Input() i18n: string
  @Input() enabled: string
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

  ngOnChanges(change) {    
    change.enabled && change.enabled.currentValue != change.enabled.previousValue ? this.enabled = change.name.currentValue: null
    change.value && change.value.currentValue != change.value.previousValue ? this.value = change.value.currentValue: null
  }
}
