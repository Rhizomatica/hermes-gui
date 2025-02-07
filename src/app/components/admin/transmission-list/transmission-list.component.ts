import { Component, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { UUCPQueue } from '../../../interfaces/uucpqueue';
import { User } from '../../../interfaces/user';
import { MessageService } from '../../../_services/message.service';
import { UUCPService } from '../../../_services/uucp.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { Station } from 'src/app/interfaces/station';
import { StationService } from 'src/app/_services/station.service';

@Component({
  selector: 'app-transmission-list',
  templateUrl: './transmission-list.component.html',
  styleUrls: ['./transmission-list.component.less']
})

export class TransmissionListComponent implements OnInit {

  currentUser: User
  error = Error
  messages: Message[]
  queue: UUCPQueue[]
  job: UUCPQueue
  sentMessages: Message[]
  message: Message
  isadmin = false
  searchMessages: string
  confirmTransmit = false
  errorAlert = false
  noMessages = false
  noUUcp = false
  noQueue = false
  transList = false
  loading = true
  jobToForce: UUCPQueue
  queueSize = 0
  deleteMessage: boolean = false
  jobToDelete: UUCPQueue
  stations: Station[]
  transmissionProgress: string = "25%"

  constructor(
    private messageService: MessageService,
    private uucpService: UUCPService,
    private authenticationService: AuthenticationService,
    private stationService: StationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
  }

  closeError() {
    this.errorAlert = false;
  }

  cancelTransmission(): void {
    this.deleteMessage = false
    this.loading = true
    this.uucpService.cancelTransmission(this.jobToDelete.uuidhost, this.jobToDelete.uuiduucp).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== this.jobToDelete.uuiduucp)
        this.loading = false
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  cancelMail(host, id): void {
    this.loading = true
    var language = localStorage.getItem('language')
    this.uucpService.cancelMail(host, id, language).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== id)
        this.loading = false
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  showTransmission() {
    if (this.transList == false) {
      this.transList = true
    } else {
      this.transList = false
    }
  }

  confirmCancelTransmission(jobToDelete: UUCPQueue) {
    if (this.deleteMessage) {
      this.deleteMessage = false;
    } else {
      this.deleteMessage = true;
      this.jobToDelete = jobToDelete
    }
  }

  removeMessage(message: Message): void {
    this.sentMessages = this.sentMessages.filter(obj => obj !== message)
    this.messageService.deleteMessage(message.id).subscribe(
      (res: any) => {
        this.message = res
      },
      (err) => {
        this.error = err
        this.errorAlert = true
      }
    );
  }

  confTransmit(job: UUCPQueue) {
    if (this.confirmTransmit === false) {
      this.confirmTransmit = true
      this.jobToForce = job
    } else {
      this.confirmTransmit = false
    }
  }

  transmitNow(): void {
    this.confirmTransmit = false
    this.uucpService.callSystem(this.jobToForce.uuidhost).subscribe(
      (res: any) => {
        this.getMessages()
        this.jobToForce = null
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.confirmTransmit = false
        this.loading = false
      }
    );
  }

  getMessages(): void {
    this.messageService.getMessagesByType('sent').subscribe(
      res => {
        this.sentMessages = res
        this.getQueue()
      },
      (err) => {
        this.error = err
        this.noMessages = true
        this.loading = false
      }
    );
  }

  closeOveralTransmission() {
    this.confirmTransmit = false
    this.jobToForce = null
  }

  getQueue(): void {
    this.uucpService.getQueue().subscribe(
      res => {
        this.queue = res
        if (Object.keys(this.queue).length == 0) {
          this.noQueue = true
          this.queue = null
        } else {
          this.noQueue = false
          this.getQueueSize()

          this.queue.forEach(item => {
            item.dest = this.stations.filter((a) => { return a.name === item.uuidhost })[0].alias
          });
        }

        this.loading = false
      },
      (err) => {
        this.error = err
        this.noUUcp = true
        this.loading = false
      }
    );
  }

  getQueueSize() {
    if (this.queue && this.queue.length > 0) {
      for (let i = 0; i < Object.keys(this.queue).length; i++) {
        this.queueSize += parseInt(this.queue[i].size)
      }
    }
  }

  getStations() {
    this.stationService.getStations().subscribe(stations => {
      this.stations = stations
      this.getMessages()
    })
  }

  ngOnInit(): void {
    this.loading = true
    this.getStations()
    if (this.currentUser)
      this.isadmin = this.currentUser.admin
  }
}
