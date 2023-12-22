import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less']
})
export class PlayerComponent implements OnChanges {

  constructor() {
    this.playing = true
    this.url = ""
    this.fileId = null
    this.mimetype = ""
    this.type = ""
    this.secured = false
    this.password = ""
  }

  @Input() playing: boolean
  @Input() url: string
  @Input() fileId: number
  @Input() mimetype: string
  @Input() type: string
  @Input() secured: boolean
  @Input() password: string

  ngOnChanges(change) {
    change && change.playing.currentValue != change.playing.previousValue ? this.playing = change.playing.currentValue : null
  }

  loadingAudio() {
    return true
  }
}