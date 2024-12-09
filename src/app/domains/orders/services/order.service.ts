import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'
import { Order } from '../../menu/utils/menu.model'

@Injectable()
export class OrderService {
  fsCollectionName = 'Orders'
  fsDocument: AngularFirestoreDocument<Order>

  public order: Order = {}
  public barList = new Array()

  constructor(private afs: AngularFirestore) { }

  createDocument(data) {
    return this.afs.collection(this.fsCollectionName).add(data)
  }

  getCookingOrders() {
    const col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('status', '==', 'cooking').orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...(res.payload.doc.data() as Order),
          }
        })
      })
    )
  }

  getDeliveryOrders() {
    const col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('status', '==', 'delivery').orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...(res.payload.doc.data() as Order),
          }
        })
      })
    )
  }

  getPaidOrders() {
    const col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('status', '==', 'paid').orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...(res.payload.doc.data() as Order),
          }
        })
      })
    )
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

  getArchivedOrders() {
    let col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref
        .where('isDelivered', '==', true)
        .where('isPaid', '==', true)
        .where('isArchived', '==', false)
        .orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return { id: res.payload.doc.id, ...res.payload.doc.data() }
        })
      })
    )
  }

  getRejectedOrders() {
    let query = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('isRejected', '==', true).orderBy('timestamp', 'desc')
    )
    return query.snapshotChanges().pipe(
      map((res) => {
        return res.map((res: any) => {
          return {
            id: res.payload.doc.id,
            ...res.payload.doc.data(),
          }
        })
      })
    )
  }

  getOrdersByWaiter(id) {
    let col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('waiter.id', '==', id).where('isPaid', '==', true).orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...(res.payload.doc.data() as Order),
          }
        })
      })
    )
  }

  getOrdersByClient(id) {
    let col = this.afs.collection(this.fsCollectionName, (ref) =>
      ref.where('client.id', '==', id).where('type', '==', 'DOMICILIO').orderBy('timestamp', 'desc')
    )
    return col.snapshotChanges().pipe(
      map((res: any) => {
        return res.map((res) => {
          return {
            id: res.payload.doc.id,
            ...(res.payload.doc.data() as Order),
          }
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

  updateDocument(id, data) {
    // this.fsCollection.doc(id).update({ data: data })
  }

  updateStatus(id, status, history, progress) {
    return this.afs
      .collection(this.fsCollectionName)
      .doc(id)
      .update({ status: status, statusHistory: history, progress: progress })
  }

  updateDeliveryOrder(id, waiter) {
    // return this.fsCollection.doc(id).update({ isDelivered: true, waiter: waiter })
    return
  }

  updatePaidOrder(id, waiter) {
    // return this.fsCollection.doc(id).update({ isPaid: true, isDelivered: true, waiter: waiter })
    return
  }

  updateToArchiveOrder(id) {
    // return this.fsCollection.doc(id).update({ isArchived: true })
    return
  }
}
