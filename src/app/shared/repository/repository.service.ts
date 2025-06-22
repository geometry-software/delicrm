import { Injectable } from '@angular/core'
import {
  DocumentData,
  Firestore,
  addDoc,
  collectionData,
  docData,
  collection,
  doc,
  endAt,
  endBefore,
  getCountFromServer,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
  updateDoc,
  setDoc,
  deleteDoc
} from '@angular/fire/firestore'; 
import { Observable, from, map } from 'rxjs'
import { responseConverter, responseTransform } from './repository.utils'
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
export class RepositoryService<T extends DocumentData = any, S = RepositoryEntityStatus, V = number> {

  constructor(
    private firestore: Firestore,
    private notificationService: NotificationService,
  ) { }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @returns Observable with all documents from collection
   */
  getAllDocuments(collectionName: string): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    return collectionData<T>(collectionReference, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param id id of the document
   * @returns Observable with all documents from collection
   */
  getAllDocumentsById(collectionName: string, id: string): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      where('authId', '==', id),
      orderBy('createdAt', 'desc')
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status entity status
   * @returns Observable with all documents from collection
   */
  getAllDocumentsByStatus(collectionName: string, status: S): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy('name', 'desc'),
      where(defaultStatusPropertyName, '==', status)
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param id id of the document
   * @returns Observable with a single document by id
   */
  getDocumentById(collectionName: string, id: string): Observable<T> {
    const documentReference = doc(this.firestore, collectionName, id).withConverter(responseConverter<T>())
    return docData<T>(documentReference, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param status filter a query by entity status
   * @returns Observable with an amount of documents matches a status in a collection
   */
  getCollectionSizeByStatus(collectionName: string, status: S): Observable<number> {
    const collectionReference = collection(this.firestore, collectionName)
    const collectionQuery = query(
      collectionReference,
      where(defaultStatusPropertyName, '==', status)
    )
    return from(getCountFromServer(collectionQuery)).pipe(
      map(value => value.data().count)
    )
  } 

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @returns Observable with an amount of documents in collection
   */
  getCollectionSize(collectionName: string): Observable<number> {
    const collectionReference = collection(this.firestore, collectionName)
    return from(getCountFromServer(collectionReference)).pipe(
      map(value => value.data().count)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param item name of the property
   * @param value value of the property
   * @returns Observable with an amount of documents matches a query
   */
  getCollectionSizeByItem<V>(collectionName: string, item: string, value: V): Observable<number> {
    const collectionReference = collection(this.firestore, collectionName)
    const collectionQuery = query(
      collectionReference,
      where(item, '==', value)
    )
    return from(getCountFromServer(collectionQuery)).pipe(
      map(value => value.data().count)
    )
  } 

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param status value of the status field
   * @param field name of the field that is related for status property
   * @returns Observable with list of documents that matches a query
   */
  getFirstPage<S>(
    collectionName: string,
    sort: SortRequest,
    size: number,
    status: S,
    field: string = defaultStatusPropertyName
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy(sort.active, sort.direction),
      where(field, '==', status),
      limit(size)
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param value value of the property which query will be ordered by, that equals to last element in the previously requested list
   * @param status value of the status field
   * @param field name of the field that is related for status property
   * @returns Observable with list of documents that matches a query
   */
  getNextPage(
    collectionName: string,
    sort: SortRequest,
    size: number,
    value: V,
    status: S,
    field: string = defaultStatusPropertyName,
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy(sort.active, sort.direction),
      where(field, '==', status),
      startAfter(value),
      limit(size)
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param size limit an amount of documents to return
   * @param value value of the property which item was the last element in the previously requested list
   * @param status value of the status field
   * @param field name of the field that is related for status property
   * @returns Observable with list of documents that matches a query
   */
  getPreviousPage(
    collectionName: string,
    sort: SortRequest,
    size: number,
    value: V,
    status: S,
    field: string = defaultStatusPropertyName,
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy(sort.active, sort.direction),
      where(field, '==', status),
      endBefore(value),
      limitToLast(size)
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param sort sorted by the specified field, and in descending or ascending order
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByStrictQuery(
    collectionName: string,
    sort: SortRequest,
    property: string,
    value: string
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy(sort.active, sort.direction),
      where(property, '==', value)
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Queries a Firestore collection
   * @param collectionName name of the collection
   * @param property name of the property is used to compare
   * @param value value of the property to compare
   * @returns Observable with list of documents that matches a query
   */
  getAllDocumentsByIncludesQuery(collectionName: string, property: string, value: string): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName).withConverter(responseConverter<T>())
    const collectionQuery = query(
      collectionReference,
      orderBy(property),
      startAt(value.toLowerCase()),
      endAt(value.toLowerCase() + '~')
    )
    return collectionData<T>(collectionQuery, { idField: 'id' }).pipe(
      responseTransform(this.notificationService)
    )
  }

  /**
   * Creates a record in a Firestore collection
   * @param collectionName name of the collection
   * @param item object that will be added
   * @returns Observable with document id refers to a document location
   */
  createDocument(collectionName: string, item: T): Observable<string> {
    const collectionReference = collection(this.firestore, collectionName)
    return from(addDoc(collectionReference, item)).pipe(
      map(doc => doc.id)
    )
  }

  /**
   * Updates a document in a Firestore collection
   * @param collectionName name of the collection
   * @param item whole object or selected properies which will update an existing document
   * @param id id of the requested document
   * @returns void Observable
   */
  updateDocument(collectionName: string, item: Partial<T>, id: string): Observable<void> {
    const documentReference = doc(this.firestore, collectionName, id)
    return from(updateDoc(documentReference, item as T))
  }

  /**
   * Sets a document in a Firestore collection
   * @param collectionName name of the collection
   * @param item set an object or selected properies to an existing document or create a new one
   * @param id id of the requested document
   * @returns Observable of object that was set
   */
  setDocument<T>(collectionName: string, item: T, id: string): Observable<RepositoryResponseEntity<T>> {
    const documentReference = doc(this.firestore, collectionName, id)
    return from(setDoc(documentReference, item as T)).pipe(
      responseTransform(this.notificationService),
      map(() => ({ id, item }))
    )
  }

  /**
   * Deletes a document in a Firestore collection
   * @param collectionName name of the collection
   * @param id id of the requested document
   * @returns void Observable
   */
  deleteDocument(collectionName: string, id: string): Observable<void> {
    const documentReference = doc(this.firestore, collectionName, id)
    return from(deleteDoc(documentReference))
  }

}