/// <reference types="web-bluetooth" />
import { Injectable } from '@angular/core'
// "esc-pos-encoder": "^2.0.1",
// import EscPosEncoder from 'esc-pos-encoder'
import { default as EscPosEncoder } from '@manhnd/esc-pos-encoder'

@Injectable({ providedIn: 'root' })
export class PrintService {
  printCharacteristic: BluetoothRemoteGATTCharacteristic

  connect(): Promise<BluetoothRemoteGATTCharacteristic> {
    return navigator.bluetooth
      .requestDevice({
        filters: [
          {
            services: ['000018f0-0000-1000-8000-00805f9b34fb'],
          },
        ],
      })
      .then((device) => device.gatt.connect())
      .then((server) => server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb'))
      .then((service) => service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb'))
      .then((characteristic) => characteristic)
  }

  print(characteristic: BluetoothRemoteGATTCharacteristic, total: number) {
    const encoder = new EscPosEncoder()
    const result = encoder
      .initialize()
      .newline()
      .newline()
      .text('Deli CRM')
      .newline()
      .text('Total: ')
      .text(total.toString())
      .newline()
      .newline()
      // .qrcode('https://wwww.com')
      .newline()
      .newline()
      .encode()
    characteristic.writeValue(result)
  }
}
