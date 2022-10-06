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
    this.secured = false
    this.password = ""
  }

  @Input() playing: boolean
  @Input() url: String
  @Input() fileId: Number
  @Input() mimetype: String
  @Input() secured: boolean
  @Input() password: String

  ngOnChanges(change) {
    change && change.playing.currentValue != change.playing.previousValue ? this.playing = change.playing.currentValue : null
  }

  loadingAudio(){
    return true
  }

  
}