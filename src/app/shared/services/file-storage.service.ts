import { Injectable } from '@angular/core'
import { getStorage, ref, uploadBytes} from '@angular/fire/storage';
import type { StorageReference, UploadResult } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  saveFile(name: string, file: any): Promise<UploadResult> {
    const storage = getStorage()
    const storageRef = ref(storage, name)
    return uploadBytes(storageRef, file)
  }

  getFileLink(name: string): StorageReference {
    const storage = getStorage()
    return ref(storage, name)
  }

}