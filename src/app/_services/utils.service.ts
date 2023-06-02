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

  isMobile(){
    return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
  }

  isItRuningLocal(){
    var url = window.location.href
    return url === 'http://localhost:4200/' || url === 'http://127.0.0.1:4200/' ? true : false
  }

  isSBitxRadio(){
     return GlobalConstants.bitx === 'S' ? true : false
  }

}
