import { Injectable } from "@angular/core";

declare var document: any;

@Injectable({
  providedIn: 'root'
})

export class Utils {

  constructor() {
  }

  getFileType(file) {

    var obj = {
      'noImage': false,
      'isAudio': false,
      'isImage': false,
      'audioLoading': false
    }

    switch (file.mimetype) {
      case '':
        obj.noImage = true
        obj.isAudio = false
        break
      case 'image/bmp':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/tiff':
      case 'image/webp':
      case 'image/svg+xml':
      case 'image/pjpeg':
      case 'image/x-jps':
        obj.noImage = true
        obj.isImage = true
        obj.isAudio = false
        break
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
        obj.noImage = false
        obj.isImage = false
        obj.isAudio = true
        obj.audioLoading = true
        break
      default:
        obj.noImage = false
        obj.isAudio = false
        obj.isImage = false
    }
    return obj
  }

  getMaxSizeFileByType(type) {
    switch (type) {
      case 'image/bmp':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
      case 'image/svg+xml':
      case 'image/pjpeg':
      case 'image/x-jps':
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
        return 31457280;
      default:
        return 2097152;
    }
  }

} 