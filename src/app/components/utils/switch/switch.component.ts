import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less']
})
export class SwitchComponent implements OnChanges, OnInit {

  @Input() inputName: string = 'Switch';
  @Input() label: string = '';
  @Input() i18n: string = 'Translate';
  @Input() enabled: boolean = true;
  @Input() value: number = 0;
  @Input() keyA: string = '';
  @Input() keyB: string = '';
  @Input() labelA: string = '';
  @Input() labelB: string = '';


  @Input() customFunction?: (component: SwitchComponent) => void;
  @Output() switched = new EventEmitter<void>();

  constructor() {}

  onSwitch(): void {
    if (!this.enabled) return;

    this.switched.emit();
    if (this.customFunction) {
      try {
        this.customFunction(this);
      } catch (error) {
        console.error('Error executing customFunction:', error);
      }
    }
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enabled'] &&
        changes['enabled'].currentValue !== changes['enabled'].previousValue) {
      this.enabled = changes['enabled'].currentValue;
    }

    if (changes['value'] &&
        changes['value'].currentValue !== changes['value'].previousValue) {
      this.value = changes['value'].currentValue;
    }
  }
}
