import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'
import { Order, OrderStatusValue } from '../../menu/utils/waiter.model'
import { Observable } from 'rxjs'

@Injectable()
export class DeliveryService {
  collectionNameDelivery = 'Delivery'
  collectionNameOrders = 'Orders'

  constructor(private afs: AngularFirestore) {}

  createOrder(data) {
    return this.afs.collection(this.collectionNameOrders).add(data)
  }

  getNewDeliveries(status: OrderStatusValue): Observable<Order> {
    return this.afs
      .collection(this.collectionNameDelivery, (ref) => ref.where('status', '==', status))
      .snapshotChanges()
      .pipe(map((res: any) => res.map((res: any) => ({ id: res.payload.doc.id, ...res.payload.doc.data() }))))
  }

  confirmDelivery(id: string, orderId: string) {
    return this.afs.collection(this.collectionNameDelivery).doc(id).update({ status: 'delivery', orderId })
  }

  rejectDelivery(id: string, comment: string) {
    return this.afs.collection(this.collectionNameDelivery).doc(id).update({ status: 'canceled', comment: comment })
  }
}
