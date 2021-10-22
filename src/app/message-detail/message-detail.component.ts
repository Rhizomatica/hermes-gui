import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { GlobalConstants } from '../global-constants';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.less']
})
export class MessageDetailComponent implements OnInit {

  @Input() message: Message;
  error: Error;
  public messageImage: Blob;
  public isEncrypted = false;
  url =  GlobalConstants.apiURL;
  noMessage = false;
  noImage = false;
  wrongPass = false;
  uncrypted = false;

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

  sendPassword(id: number, f: NgForm): void {
    this.messageService.uncrypt(id, f.value).subscribe(
      (res: any) => {
		  if (res.text != ""){
        	this.message.text = res.text;
        	this.uncrypted = true;
		  } else {
        this.uncrypted = false;
        this.wrongPass = true;
      }
      },
      (err) => {
        this.error = err;
      }
    );

  }

  getMessage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(id).subscribe(
      (res: any) => {
        this.message = res;
        if (this.message.text == "") {
          this.noMessage = true;
        } else {
          this.noMessage = false;
        }

        console.log(this.noMessage);
        console.log(res);
      },
      (err) => {
        this.error = err;
        this.noMessage = true;
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
        this.noImage = true;
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
