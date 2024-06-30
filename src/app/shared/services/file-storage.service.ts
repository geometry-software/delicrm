import { Injectable } from '@angular/core'
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage'

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  constructor(private angularFireStorage: AngularFireStorage) {}

  public saveFile(name: string, file: any): AngularFireUploadTask {
    return this.angularFireStorage.upload(name, file)
  }

  public getFileLink(name: string): AngularFireStorageReference {
    return this.angularFireStorage.ref(name)
  }
}
