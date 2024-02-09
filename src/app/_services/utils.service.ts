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
    return self.location.host === 'localhost:4200' || self.location.host === '127.0.1.1:4200' ? true : false
  }

  isSBitxRadio() {
    return GlobalConstants.bitx === 'S' ? true : false
  }


  getFileType(fileType) {

    if(!fileType){
      return null
    }

    if (fileType.match('image.*'))
      return 'image';

    if (fileType.match('video.*'))
      return 'video';

    if (fileType.match('audio.*'))
      return 'audio';

    return 'other';

  }

  formatFrequency(freq) {
    if (!freq)
      return 0

    freq = (Math.round((freq / 1000) * 100) / 100).toFixed(2); //Set Decimal

    freq = freq.replace(/\./g, ',') //Replace decimal dot per comma

    return freq.replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, "."); //Format number with dots
  }

  formatSWR(swr) {
    if (!swr)
      return '1.0'

    return (parseInt(swr) / 10).toFixed(1).toString()
  }

  formatPower(fwd) {
    if (!fwd)
      return '0'

    return (parseInt(fwd) / 10).toFixed(1).toString()
  }

  formatDate(date) {
    if (!date)
      return ''

    return new Date(date).toLocaleDateString('pt', { day: "numeric", month: "numeric", year: "numeric", hour: '2-digit', hour12: true, minute: "2-digit" })
  }
}
