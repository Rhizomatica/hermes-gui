import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Message } from '../message';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.less']
})
export class MessageDetailComponent implements OnInit {

  @Input() message: Message;
  private error: String;


  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location,

  ) { }

  getMessageOld(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(id).subscribe(message => this.message);
  }

  getMessage(): void {
    const id = +this.route.snapshot.paramMap.get('id');

  this.messageService.getMessage(id).subscribe(
    (res: any) => {
      this.message = res;
      console.log("debug componente service " + res);
    },
    (err) => {
      this.error = err;
    }
  );
}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getMessage();
  }

}
