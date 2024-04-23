import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.less']
})

export class RecorderComponent implements OnChanges {

  constructor(private domSanitizer: DomSanitizer) {
    this.recording = false
    this.file = null
    this.maxSize = 31457280
    this.fileName = null
    this.record = null
    this.timeRecording = 0
    this.secondsLabel = "00"
    this.minutesLabel = "00"
    this.recordingInterval = null
  }

  @Input() recording: boolean
  @Input() file: File
  @Input() fileName: any

  public maxSize: number
  public record: any
  public timeRecording: any
  public secondsLabel: string
  public minutesLabel: string
  public recordingInterval: any

  @Output() emitteFileOP = new EventEmitter<any>();

  setFileOP(value: any) {
    this.emitteFileOP.emit(value);
  }

  ngOnChanges(change) {
    return null
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    this.countRecording()
  }

  errorCallback(error) {
    this.setFileOP(null)
  }

  countRecording() {
    this.recordingInterval = setInterval(() => {
      this.timeRecording++
      this.minutesLabel = this.formatTime(Math.floor(this.timeRecording / 60))
      this.secondsLabel = this.formatTime((this.timeRecording - Number(this.minutesLabel) * 60))
    }, 1000);
  }

  formatTime(value: any) {
    var valString = value + ""
    if (valString.length < 2) {
      return "0" + valString
    }
    return valString
  }

  successCallback(stream) {
    var options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      sampleRate: 50000,
    };

    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
    this.cancelInterval()
  }

  processRecording(blob) {
    if (blob.size < this.maxSize) {
      // let file: File = event.target.files[0];
      this.file = blob
      this.fileName = URL.createObjectURL(blob)
      this.setFileOP(this.file)
      return
    }
  }


  convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';

    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  cancelInterval() {
    clearInterval(this.recordingInterval);
  }

  removeFile() {
    this.recording = false
    this.file = null
    this.fileName = null

    this.record = null
    this.timeRecording = 0
    this.secondsLabel = "00"
    this.minutesLabel = "00"
    this.recordingInterval = null
  }
}