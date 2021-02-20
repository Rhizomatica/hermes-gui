import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { GlobalConstants } from '../global-constants';



@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.less']
})
export class MessageDetailComponent implements OnInit {

  @Input() message: Message;
  private error: string;
  public messageImage: Blob;
  public isEncrypted = false;
  url =  GlobalConstants.apiURL;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location,

  ) { }

  changeEnc() {
    if (this.isEncrypted) {
      this.isEncrypted = false;
    } else {
      this.isEncrypted = true;
    }
    console.log('⚚ message-detail - changeEnc: isEncrypted? ', this.isEncrypted);
  }
  
  getMessageOld(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(id).subscribe(message => this.message);
  }

  getMessage(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.messageService.getMessage(id).subscribe(
      (res: any) => {
        this.message = res;
        console.log('debug componente service ' + res);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getMessageImage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(id).subscribe(
      (res: any) => {
        this.messageImage = res;
        console.log('debug componente service ' + res);
      },
      (err) => {
        this.error = err;
      }
    );

  }

  getImageFromService() {
    // this.isImageLoading = true;
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(id).subscribe(
      data => {
      this.messageImage = data;
      // this.isImageLoading = false;
    }, error => {
      // this.isImageLoading = false;
      console.log('⚚ message-detail - getImageFromService error ', error);
    });
}



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getMessage();
    this.getImageFromService();
  }

}
