import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less']
})
export class SwitchComponent {

  constructor() {
    console.log("Create Switch Custom Componente - " + this.title)
  }

  @Input('init') title: string
  // @Input() disabled: any
  // @Input() value: any
  // @Input() customFunction: any

  onSwitch() {
    // if (!this.disabled)
    //   this.disabled = 'disabled'
    // else
    //   this.disabled = null

    // try {
    //   this.customFunction()
    // } catch (error) {
    //   console.log(error)
    // }
  }

  ngOnInit(): void {
    console.log("MAOOOI - " + this.title)
  }

}
