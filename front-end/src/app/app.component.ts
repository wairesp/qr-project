import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import * as data from './data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = "DieLess";
  public dogData: any = (data as any).default;
  public selectedDog: any;

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
        height: window.innerHeight
      },
    },
   
    canvasStyles: [
      { /* layer */
        lineWidth: 1,
        /*85 represents transparency*/
        fillStyle: '#00949485',
        strokeStyle: '#00949485',
      },
      { /* text */
        font: '17px serif',
        fillStyle: '#ffffff',
        strokeStyle: '#ffffff',
      }
    ],
    isBeep: false,
    fps:30,
    src:'../assets/cat1.jpg'
  };
  
  //holds results
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  //reference to the component
  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  //injects the service
  constructor(private qrcode: NgxScannerQrcodeService) { }

  //coment the handle to start automatically
  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
       this.handle(this.action, 'start');
    });
  }

  //when a event is emited to the scanner logs it into the console
  //the line above console pauses once it gets a qr
  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if (e && action) {
      action.pause();
      console.log(e); // This logs the scanned QR code data to the console
  
      // Convert the Int8Array to a string
      let decoder = new TextDecoder();
      let id = decoder.decode(new Uint8Array(e[0].data));
      console.log(id); // This logs the ID to the console

      // Find the dog data associated with the scanned ID
      this.selectedDog = this.dogData.find((dog: any) => dog.id === id);

      // Log the selected dog data to the console
      console.log(this.selectedDog);
    }
  }

  //USED TO START STOP PLAY OR PAUSE THE SCANNER
  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  //merged method
  public handleStartOrUnpause(action: any): void {
    if (!action.isStart) {
      // If the scanner is not started, start it
      this.handle(action, 'start');
    } else if (action.isPause) {
      // If the scanner is started but paused, unpause it
      this.handle(action, 'play');
    }
  }

  //to upload files meh
  public onSelects(files: any) {
    this.qrcode.loadFiles(files, 0.5).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  public onSelects2(files: any) {
    this.qrcode.loadFilesToScan(files, this.config, 0.5).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      console.log(res);
      this.qrCodeResult2 = res;
    });
  }
}

