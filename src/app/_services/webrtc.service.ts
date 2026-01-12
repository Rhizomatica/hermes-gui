import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  private peerConnection!: RTCPeerConnection;

  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  private audioElement: HTMLAudioElement | null = null;

  public isConnected$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeWebRTC();
  }

  /* ============================================================
   *  WebRTC Initialization
   * ============================================================ */
  private initializeWebRTC(): void {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ],
      iceTransportPolicy: 'all',
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require'
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    /* 🔊 Recebendo áudio remoto */
    this.peerConnection.ontrack = (event: RTCTrackEvent) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }

      event.streams[0]?.getTracks().forEach(track => {
        this.remoteStream!.addTrack(track);
      });

      this.attachRemoteAudio();
    };

    /* ❄️ ICE local */
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // 🔴 Enviar para o rádio via signaling
        // signalingService.sendIceCandidate(event.candidate);
        console.log('[ICE] Local candidate:', event.candidate);
      }
    };

    /* 🔁 ICE state */
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection.iceConnectionState;
      console.log('[ICE] State:', state);

      if (state === 'failed' || state === 'disconnected') {
        this.stopDigitalAudioStream();
      }
    };

    /* 🔗 Connection state */
    this.peerConnection.onconnectionstatechange = () => {
      const connected = this.peerConnection.connectionState === 'connected';
      this.isConnected$.next(connected);
    };
  }

  /* ============================================================
   *  Start Bidirectional Audio
   * ============================================================ */
  public async startDigitalAudioStream(): Promise<RTCSessionDescriptionInit> {
    try {
      /* 🎙️ Captura microfone */
      await this.initLocalAudio();

      /* 📄 SDP Offer */
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });

      await this.peerConnection.setLocalDescription(offer);

      /* 🔴 Retorne a offer para enviar ao rádio */
      return offer;

    } catch (error) {
      console.error('[WebRTC] Start error:', error);
      throw error;
    }
  }

  /* ============================================================
   *  Stop / Cleanup
   * ============================================================ */
  public stopDigitalAudioStream(): void {
    this.isConnected$.next(false);

    /* 🎙️ Stop local tracks */
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;

    /* 🔊 Stop remote audio */
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    this.remoteStream = null;

    /* 🔗 Close PeerConnection */
    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach(sender => {
        this.peerConnection.removeTrack(sender);
      });
      this.peerConnection.close();
    }

    this.initializeWebRTC();
  }

  /* ============================================================
   *  Audio Playback
   * ============================================================ */
  private attachRemoteAudio(): void {
    if (!this.remoteStream) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.autoplay = true;
      // this.audioElement.playsInline = true;
    }

    this.audioElement.srcObject = this.remoteStream;

    this.audioElement.play().catch(err => {
      console.warn('[WebRTC] Autoplay blocked:', err);
    });
  }

  /* ============================================================
   *  Local Audio (Microphone)
   * ============================================================ */
  private async initLocalAudio(): Promise<void> {
    if (this.localStream) return;

    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });
  }

  /* ============================================================
   *  Signaling Hooks
   * ============================================================ */
  public async handleAnswer(
    answer: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.peerConnection.setRemoteDescription(answer);
  }

  public async addIceCandidate(
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    await this.peerConnection.addIceCandidate(candidate);
  }
}

 /*  Browser                          Rádio
────────────────────────────────────────────────
getUserMedia()
addTrack()
createOffer()
setLocalDescription()
        ───────── SDP Offer ─────────▶

        ◀──────── SDP Answer ─────────
setRemoteDescription()

ICE candidates ⇄ signaling

🎙️ RTP áudio ───────────────▶
🔊 RTP áudio ◀───────────────
*/
