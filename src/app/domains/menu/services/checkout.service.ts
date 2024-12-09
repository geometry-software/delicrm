import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Order } from '../utils/menu.model'
import { map } from 'rxjs'

@Injectable()
export class CheckoutService {
  fsCollectionNameOrders = 'Orders'
  fsCollectionNameDelivery = 'Delivery'

  constructor(private afs: AngularFirestore) { }

  createDelivery(data) {
    return this.afs.collection(this.fsCollectionNameDelivery).add(data)
  }

  createTableOrder(data) {
    return this.afs.collection(this.fsCollectionNameOrders).add(data)
  }

  getDeliveryById(id: string) {
    return this.afs.doc(this.fsCollectionNameDelivery + '/' + id).valueChanges()
  }
}
