import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Order } from '../utils/menu.model'
import { map } from 'rxjs'

@Injectable()
export class MenuService {
  fsCollectionNameMenu = 'DailyMenu'
  fsCollectionNameAlaCarte = 'Recipes'

  public order: Order = {}

  constructor(private afs: AngularFirestore) { }

  getDailyMenu() {
    return this.afs.doc(this.fsCollectionNameMenu + '/menu').valueChanges()
  }

  getAlaCarteList() {
    return this.afs
      .collection(this.fsCollectionNameAlaCarte, (ref) => ref.where('type', '==', 'alacarte').orderBy('name', 'desc'))
      .snapshotChanges()
      .pipe(map((res: any) => res.map((res) => ({ id: res.payload.doc.id, ...res.payload.doc.data() }))))
  }

  // getPaidOrdersFirstPage(pageSize) {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref.where('isDelivered', '==', true).where('isPaid', '==', true).orderBy('timestamp', 'desc').limit(pageSize)
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return { id: res.payload.doc.id, ...res.payload.doc.data() }
  //       })
  //     })
  //   )
  // }

  // getPaidOrdersNextPage(pageSize, item) {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref
  //       .where('isDelivered', '==', true)
  //       .where('isPaid', '==', true)
  //       .orderBy('timestamp', 'desc')
  //       .startAfter(item['timestamp'])
  //       .limit(pageSize)
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return { id: res.payload.doc.id, ...res.payload.doc.data() }
  //       })
  //     })
  //   )
  // }

  // getPaidOrdersPreviousPage(pageSize, item) {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref
  //       .where('isDelivered', '==', true)
  //       .where('isPaid', '==', true)
  //       .orderBy('timestamp', 'desc')
  //       .endBefore(item['timestamp'])
  //       .limitToLast(pageSize)
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return { id: res.payload.doc.id, ...res.payload.doc.data() }
  //       })
  //     })
  //   )
  // }

  // getArchivedOrders() {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref
  //       .where('isDelivered', '==', true)
  //       .where('isPaid', '==', true)
  //       .where('isArchived', '==', false)
  //       .orderBy('timestamp', 'desc')
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return { id: res.payload.doc.id, ...res.payload.doc.data() }
  //       })
  //     })
  //   )
  // }

  // getRejectedOrders() {
  //   let query = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref.where('isRejected', '==', true).orderBy('timestamp', 'desc')
  //   )
  //   return query.snapshotChanges().pipe(
  //     map((res) => {
  //       return res.map((res: any) => {
  //         return {
  //           id: res.payload.doc.id,
  //           ...res.payload.doc.data(),
  //         }
  //       })
  //     })
  //   )
  // }

  // getOrdersByWaiter(id) {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref.where('waiter.id', '==', id).where('isPaid', '==', true).orderBy('timestamp', 'desc')
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return {
  //           id: res.payload.doc.id,
  //           ...(res.payload.doc.data() as Order),
  //         }
  //       })
  //     })
  //   )
  // }

  // getOrdersByClient(id) {
  //   let col = this.afs.collection(this.fsCollectionName, (ref) =>
  //     ref.where('client.id', '==', id).where('type', '==', 'DOMICILIO').orderBy('timestamp', 'desc')
  //   )
  //   return col.snapshotChanges().pipe(
  //     map((res: any) => {
  //       return res.map((res) => {
  //         return {
  //           id: res.payload.doc.id,
  //           ...(res.payload.doc.data() as Order),
  //         }
  //       })
  //     })
  //   )
  // }

  // getDocument(id) {
  //   return this.afs.doc(this.fsCollectionName + '/' + id).valueChanges()
  // }

  // delete(id) {
  //   return this.afs.doc(this.fsCollectionName + '/' + id).delete()
  // }

  // updateDocument(id, data) {
  //   // this.fsCollection.doc(id).update({ data: data })
  // }

  // updateStatus(id, status, history, progress) {
  //   return this.fsCollection.doc(id).update({ status: status, statusHistory: history, progress: progress })
  // }

  // updateDeliveryOrder(id, waiter) {
  //   // return this.fsCollection.doc(id).update({ isDelivered: true, waiter: waiter })
  //   return
  // }

  // updatePaidOrder(id, waiter) {
  //   // return this.fsCollection.doc(id).update({ isPaid: true, isDelivered: true, waiter: waiter })
  //   return
  // }

  // updateToArchiveOrder(id) {
  //   // return this.fsCollection.doc(id).update({ isArchived: true })
  //   return
  // }
}
