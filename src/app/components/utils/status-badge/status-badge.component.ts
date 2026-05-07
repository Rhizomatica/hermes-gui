import { Component, Input } from '@angular/core';

@Component({
  selector: 'status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.less']
})
export class StatusBadgeComponent {
  @Input() active: boolean = false;
  @Input() activeLabel: string = 'ON';
  @Input() inactiveLabel: string = 'OFF';
}
