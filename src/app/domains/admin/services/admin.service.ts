import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'

@Injectable()
export class AdminService {
  fsCollectionName = 'Plates'

  // is depended from Firestore Collection Record with an ID "menu"
  fsCollectionNameMenu = 'DailyMenu'

  fsCollection: AngularFirestoreCollection<any>
  fsCollectionMenu: AngularFirestoreCollection<any>

  constructor(private afs: AngularFirestore) {
    this.fsCollection = this.afs.collection(this.fsCollectionName, (ref) => ref)
    this.fsCollectionMenu = this.afs.collection(this.fsCollectionNameMenu, (ref) => ref)
  }

  createDocument(data) {
    return this.fsCollection.add(data)
  }

  getAll() {
    let query = this.afs.collection(this.fsCollectionName, (ref) => ref.orderBy('createdAt', 'desc'))
    return query.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...res.payload.doc.data(),
          }
        })
      })
    )
  }

  getHistoryFirstPage(pageSize) {
    let col = this.afs.collection(this.fsCollectionName, (ref) => ref.orderBy('createdAt', 'desc').limit(pageSize))
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return { id: res.payload.doc.id, ...res.payload.doc.data() }
        })
      })
    )
  }

  getHistoryNextPage(pageSize, item) {
    let col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.orderBy('createdAt', 'desc').startAfter(item['createdAt']).limit(pageSize)
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return { id: res.payload.doc.id, ...res.payload.doc.data() }
        })
      })
    )
  }

  getHistoryPreviousPage(pageSize, item) {
    let col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.orderBy('createdAt', 'desc').endBefore(item['createdAt']).limitToLast(pageSize)
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return { id: res.payload.doc.id, ...res.payload.doc.data() }
        })
      })
    )
  }

  getDocument(id) {
    return this.afs.doc(this.fsCollectionName + '/' + id).valueChanges()
  }

  delete(id) {
    return this.afs.doc(this.fsCollectionName + '/' + id).delete()
  }

  updateDailyMenu(data) {
    return this.fsCollectionMenu.doc('menu').set(data)
  }

  clearDailyMenu() {
    return this.fsCollectionMenu.doc('menu').set({ open: false })
  }

  getDailyMenu() {
    return this.afs.doc(this.fsCollectionNameMenu + '/menu').valueChanges()
  }

}