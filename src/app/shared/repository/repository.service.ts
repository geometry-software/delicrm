import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { map } from 'rxjs/operators'
import { Observable, from } from 'rxjs'
import { getCountFromServer, collection, query, where } from 'firebase/firestore'
import { appendId, responseTransform } from './repository.utils'
import { OrderRequest, RepositoryEntityStatus, RepositoryResponseEntity } from './repository.model'

@Injectable({
  providedIn: 'root',
})
export class RepositoryService<T = any, S = RepositoryEntityStatus> {
  constructor(private angularFirestore: AngularFirestore) { }

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocuments = (collection: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection)
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocumentsByStatus = (collection: string, status: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy('name', 'desc').where('status', '==', status))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param id id of the document
   * @returns Observable with a single document by id
   */
  getDocumentById = (collection: string, id: string): Observable<T> =>
    this.angularFirestore.collection(collection).doc<T>(id).valueChanges().pipe(responseTransform())

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
  getCollectionSizeByStatus = <S>(collectionName: string, status: S): Observable<number> => from(
    getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName), where('status', '==', status))))
    .pipe(map((val) => val.data().count))

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status filter a query by entity status
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSize = (collectionName: string): Observable<number> =>
    from(getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName))))
      .pipe(map((val) => val.data().count))

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status filter a query by entity status
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSizeByRole = (collectionName: string, role: S): Observable<number> =>
    from(getCountFromServer(query(collection(this.angularFirestore.firestore, collectionName), where('role', '==', role)))).pipe(
      map((val) => val.data().count))

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @returns Observable with list of documents that matches a query
   */
  getFirstPage = <S>(collection: string, order: OrderRequest, size: number, field: string, status: S): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy(order.key, order.value).where(field, '==', status).limit(size))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @param value value of the property which query will be ordered by. Item that holds a property is the last element in the previously requested list
   * @returns Observable with list of documents that matches a query
   */
  getNextPage = <S, V>(
    collection: string,
    order: OrderRequest,
    size: number,
    field: string,
    status: S,
    value: V
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query.orderBy(order.key, order.value).where(field, '==', status).startAfter(value).limit(size))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param size limit a size of documents to return
   * @param status filter a query by entity status
   * @param value value of the property which object is the last element in the previously requested list.
   * @returns Observable with list of documents that matches a query
   */
  getPreviousPage = <S, V>(
    collection: string,
    order: OrderRequest,
    size: number,
    field: string,
    status: S,
    value: V
  ): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query.orderBy(order.key, order.value).where(field, '==', status).endBefore(value).limitToLast(size)
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param order sorted by the specified field, and in descending or ascending order
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByStrictQuery = (collection: string, order: OrderRequest, property: string, value: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) => query.orderBy(order.key, order.value).where(property, '==', value))
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Queries a Firestore collection
   * @param collection name of the collection
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByIncludesQuery = (collection: string, property: string, value: string): Observable<T[]> =>
    this.angularFirestore
      .collection<T>(collection, (query) =>
        query
          .orderBy(property)
          .startAt(value)
          .endAt(value + '~')
      )
      .snapshotChanges()
      .pipe(map(appendId<T[]>), responseTransform())

  /**
   * Creates a record in a Firestore collection
   * @param collection name of the collection
   * @param item object that will be added
   * @returns Observable with document id refers to a document location
   */
  createDocument = (collection: string, item: T): Observable<string> =>
    from(this.angularFirestore.collection(collection).add(item)).pipe(
      responseTransform(),
      map(doc => doc.id)
    )

  /**
   * Updates a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  updateDocument = (collection: string, item: T, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).update(item)).pipe(responseTransform())

  /**
   * Sets a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  setDocument = <T>(collection: string, item: T, id: string): Observable<RepositoryResponseEntity<T>> =>
    from(this.angularFirestore.collection(collection).doc(id).set(item, { merge: true })).pipe(
      responseTransform(),
      map(() => ({ id, item }))
    )

  /**
   * Deletes a document in a Firestore collection
   * @param collection name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  deleteDocument = (collection: string, id: string): Observable<void> =>
    from(this.angularFirestore.collection(collection).doc(id).delete()).pipe(responseTransform())
}
