import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'
import { Observable, from } from 'rxjs'
import { getCountFromServer, collection, query, where } from 'firebase/firestore'
import { appendId, responseTransform } from './repository.utils'
import {
  defaultStatusPropertyName,
  RepositoryEntityStatus,
  RepositoryResponseEntity,
  SortRequest
} from './repository.models'
import { NotificationService } from '../services/notification.service'

@Injectable({
  providedIn: 'root',
})
export class RepositoryService<T = any, S = RepositoryEntityStatus, V = number> {

  constructor(
    private angularFirestore: AngularFirestore,
    private notificationService: NotificationService,
  ) { }

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocuments = (collection: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection)
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform(this.notificationService))

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocumentsByStatus = (collection: string, status: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query
        .orderBy('name', 'desc')
        .where(defaultStatusPropertyName, '==', status))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform(this.notificationService))

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param id id of the document
   * @returns Observable with a single document by id
   */
  getDocumentById = (collection: string, id: string): Observable<T> =>
    this.angularFirestore.collection(collection).doc<T>(id).valueChanges().pipe(
      responseTransform(this.notificationService))

  /**
   * Queries a Firestore collection with subscription
   * @param collection name of the collection
   * @param id id of the document
   * @returns Observable with a single document by id
   */
  getDocumentValueChanges = (collection: string, id: string): Observable<T> =>
    this.angularFirestore.collection(collection).doc<T>(id).valueChanges()

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status filter a query by entity status
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSizeByStatus = (collectionName: string, status: S): Observable<number> => from(
    getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName),
      where(defaultStatusPropertyName, '==', status)))).pipe(
        map(value => value.data().count))

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSize = (collectionName: string): Observable<number> =>
    from(getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName))))
      .pipe(map(value => value.data().count))

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param item name of the property
   * @param value value of the property
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSizeByItem = <V>(collectionName: string, item: string, value: V): Observable<number> =>
    from(getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName),
      where(item, '==', value)))).pipe(
        map(value => value.data().count))

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param field name of the field that is related for status property
   * @param status value of the status field
   * @returns Observable with list of documents that matches a query
   */
  getFirstPage = <S>(
    collection: string,
    sort: SortRequest,
    size: number,
    status: S,
    field: string = defaultStatusPropertyName
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query
        .orderBy(sort.active, sort.direction)
        .where(field, '==', status)
        .limit(size))
      .snapshotChanges()
      .pipe(
        map(appendId<T[]>),
        responseTransform(this.notificationService)
      )

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param field name of the field that is related for status property
   * @param status value of the status field
   * @param value value of the property which query will be ordered by, that equals to last element in the previously requested list
   * @returns Observable with list of documents that matches a query
   */
  getNextPage = (
    collection: string,
    sort: SortRequest,
    size: number,
    value: V,
    status: S,
    field: string = defaultStatusPropertyName,
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query
        .orderBy(sort.active, sort.direction)
        .where(field, '==', status)
        .startAfter(value)
        .limit(size))
      .snapshotChanges()
      .pipe(
        map(appendId<T[]>),
        responseTransform(this.notificationService)
      )

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param field name of the field that is related for status property
   * @param status value of the status field
   * @param value value of the property which item was the last element in the previously requested list.
   * @returns Observable with list of documents that matches a query
   */
  getPreviousPage = (
    collection: string,
    sort: SortRequest,
    size: number,
    value: V,
    status: S,
    field: string = defaultStatusPropertyName,
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query
        .orderBy(sort.active, sort.direction)
        .where(field, '==', status)
        .endBefore(value)
        .limitToLast(size)
      )
      .snapshotChanges()
      .pipe(
        map(appendId<T[]>),
        responseTransform(this.notificationService)
      )

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByStrictQuery = (
    collection: string,
    sort: SortRequest,
    property: string,
    value: string
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy(sort.active, sort.direction).where(property, '==', value))
      .snapshotChanges()
      .pipe(
        map(appendId<T[]>),
        responseTransform(this.notificationService)
      )

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByIncludesQuery = (collection: string, property: string, value: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query
        .orderBy(property)
        .startAt(value)
        .endAt(value + '~'))
      .snapshotChanges()
      .pipe(
        map(appendId<T[]>),
        responseTransform(this.notificationService)
      )

  /**
   * Creates a record in a Firestore collection
   * @param collection name of the collection
   * @param item object that will be added
   * @returns Observable with document id refers to a document location
   */
  createDocument = (collection: string, item: T): Observable<string> =>
    from(this.angularFirestore.collection(collection).add(item)).pipe(
      responseTransform(this.notificationService),
      map(doc => doc.id))

  /**
   * Updates a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  updateDocument = (collection: string, item: Partial<T>, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).update(item)).pipe(
      responseTransform(this.notificationService))

  /**
   * Sets a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  setDocument = <T>(collection: string, item: T, id: string): Observable<RepositoryResponseEntity<T>> =>
    from(this.angularFirestore.collection(collection).doc(id).set(item, { merge: true })).pipe(
      responseTransform(this.notificationService),
      map(() => ({ id, item })))

  /**
   * Deletes a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  deleteDocument = (collection: string, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).delete()).pipe(
      responseTransform(this.notificationService))
}
