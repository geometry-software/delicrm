import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, } from '@angular/core'
import { Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { AngularFireStorageReference } from '@angular/fire/compat/storage'
import { PLATE_PROTEIN_TRANSLATE, PLATE_TYPE_TRANSLATE, } from '../../models/recipe.constants'
import { Recipe, RecipeCourse } from '../../models/recipe.model'
import { Store } from '@ngrx/store'
import { getItem, getLoadingStatus } from '../../store/recipe.selectors'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { filter, tap } from 'rxjs'
import { FileStorageService } from '../../../../shared/services/file-storage.service'
import { SignalService } from '../../../../shared/services/signal.service'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { recipeFormGroup, RecipeFormProps } from '../../models/recipe.form'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { fadeInOnEnterAnimation } from 'angular-animations'
import { RecipeService } from '../../services/recipe.service'

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormComponent implements OnInit {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private fileStorageService: FileStorageService,
    private signalService: SignalService,
    private recipeService: RecipeService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly loadingState = this.store.select(getLoadingStatus)
  readonly form = this.recipeService.form
  readonly formProps = RecipeFormProps
  readonly showFieldErrors = showFieldErrors

  itemId: string | undefined
  isFormDataLoaded: boolean | undefined
  hasPrice: boolean | undefined
  hasProtein: boolean | undefined
  imgURL: string | undefined
  fileName: string | undefined
  fileImg: AngularFireStorageReference | undefined
  uploadProgress: number | undefined
  showUploadButton: boolean | undefined
  isUploadingImg: boolean | undefined
  isUploadedImg: boolean | undefined
  plateTypeTranslate = PLATE_TYPE_TRANSLATE
  plateProteinTranslate = PLATE_PROTEIN_TRANSLATE

  ngOnInit() {
    this.initForm()
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  changeType(event: RecipeCourse) {
    if (event === 'main') {
      this.hasPrice = true
      this.hasProtein = true
      this.form.controls[RecipeFormProps.protein].setValue(null)
      this.form.get('protein').setValidators([Validators.required])
      this.form.controls[RecipeFormProps.price].setValue(null)
      this.form.get('price').setValidators([Validators.required])
    } else if (event === 'alacarte') {
      this.hasPrice = true
      this.hasProtein = false
      this.form.controls[RecipeFormProps.price].setValue(null)
      this.form.get('price').setValidators([Validators.required])
    } else {
      this.hasPrice = false
      this.hasProtein = false
      this.form.controls[RecipeFormProps.protein].setValue(null)
      this.form.get('protein').setValidators([])
      this.form.controls[RecipeFormProps.price].setValue(null)
      this.form.get('price').setValidators([])
    }
    this.form.updateValueAndValidity()
  }

  submit(form) {
    if (form.valid) {
      if (this.itemId) {
        this.store.dispatch(ItemActions.updateItem({ item: form.value, id: this.itemId }))
      } else {
        this.store.dispatch(ItemActions.createItem({ item: form.value }))
      }
    } else {
      highlightInvalidFields(form)
    }
  }

  updateImg(event) {
    this.fileName = event.target.files[0].name
    this.fileImg = event.target.files[0]
    this.showUploadButton = true
  }

  uploadFile() {
    this.isUploadingImg = true
    const uploadLink = this.fileStorageService.getFileLink(this.fileName)
    this.fileStorageService.saveFile(
      this.fileName,
      this.fileImg
    ).percentageChanges().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((percentage) => {
      this.uploadProgress = Math.round(percentage)
      if (this.uploadProgress == 100) {
        this.showUploadButton = false
        this.isUploadingImg = false
        this.isUploadedImg = true
      }
    })
    uploadLink.getDownloadURL().subscribe((URL) => this.form.controls[RecipeFormProps.imgURL].setValue(URL))
  }

  private initForm() {
    this.resetForm()
    if (!this.route.snapshot.routeConfig.path.includes('create')) {
      this.store.dispatch(ItemActions.getItem({ id: this.route.snapshot.params['id'] }))
      this.store.select(getItem).pipe(
        filter(Boolean),
        tap(value => {
          this.form.patchValue(value, { onlySelf: true })
          console.log(value);
          this.itemId = value.id
          if (value.price) {
            this.hasPrice = true
          }
          this.isFormDataLoaded = true
          this.cdr.markForCheck()
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
      // TODO: history of orders for exact recipe
      // this.dao.getDocument(this.itemId).subscribe(value => {
      //   this.form.patchValue(value, { onlySelf: true })
      //   if (value?.price) this.hasPrice = true
      // })
    } else {
      this.isFormDataLoaded = true
      this.cdr.markForCheck()
    }
  }

  private resetForm() {
    this.store.dispatch(ItemActions.createItemFormInit())
    this.form.reset()
    this.hasPrice = false
    this.hasProtein = false
    this.isFormDataLoaded = false
  }
}
