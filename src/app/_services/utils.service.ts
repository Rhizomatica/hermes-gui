import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/global-constants';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  browser: string = null;

  public detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  isMobile() {
    return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
  }

  isItRuningLocal() {
    return window.location.href === 'http://localhost:4200/' || window.location.href === 'http://127.0.0.1:4200/' ? true : false
  }

  isSBitxRadio() {
    return GlobalConstants.bitx === 'S' ? true : false
  }


  getFileType(mimetype) {

    //TODO - review object

    var fileAttr = {
      noImage: null,
      isAudio: null,
      isImage: null,
      audioLoading: null
    }

    switch (mimetype) {
      case '':
        fileAttr.noImage = true;
        fileAttr.isAudio = false;

        break;
      case 'image/bmp':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/tiff':
      case 'image/webp':
      case 'image/svg+xml':
      case 'image/pjpeg':
      case 'image/x-jps':
        fileAttr.noImage = true;
        fileAttr.isImage = true;
        fileAttr.isAudio = false;
        break;
      case 'audio/aac':
      case 'audio/mpeg':
      case 'audio/ogg':
      case 'audio/ogx':
      case 'audio/opus':
      case 'audio/wav':
      case 'audio/x-wav':
      case 'audio/webm':
      case 'audio/3gpp':
      case 'audio/3gpp2':
        fileAttr.noImage = false;
        fileAttr.isImage = false;
        fileAttr.isAudio = true;
        fileAttr.audioLoading = true;
        break;
      default:
        fileAttr.noImage = false;
        fileAttr.isAudio = false;
        fileAttr.isImage = false;
    }

    return fileAttr
  }

  formatFrequency(freq) {
    if (!freq)
      return

    return (Math.round((freq / 1000) * 100) / 100).toFixed(2);
  }
}
