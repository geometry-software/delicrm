import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { AngularFireStorageReference } from '@angular/fire/compat/storage'
import {
  PLATE_PROTEIN_TRANSLATE,
  PLATE_TYPE_TRANSLATE,
} from '../../utils/recipe.constants'
import { Recipe, RecipeCourse } from '../../utils/recipe.model'
import { Store } from '@ngrx/store'
import { getItem, getItemLoadingState } from '../../store/recipe.selectors'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { Observable, of, tap } from 'rxjs'
import { FileStorageService } from '../../../../shared/services/file-storage.service'
import { SignalService } from '../../../../shared/services/signal.service'

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormComponent implements OnInit {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private fileStorageService: FileStorageService,
    private signalService: SignalService
  ) { }

  // loadingState: Observable<boolean | undefined> = this.store.select(getItemLoadingState)
  loadingState = of(null)
  getItem: Observable<Recipe | undefined> = this.store.select(getItem)
  form!: FormGroup
  recipeTosave: Recipe | undefined
  isEditForm: boolean | undefined
  itemId: string | undefined
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
    this.initForm();
    this.setSignals();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      protein: [null],
      history: [null],
      imgURL: [null],
      price: [null],
    });
    if (this.route.snapshot.routeConfig.path.includes('edit')) {
      this.itemId = this.route.snapshot.params['id'];
      this.isEditForm = true;
      this.store.dispatch(ItemActions.getItem({ id: this.itemId }));
      this.store
        .select(getItem)
        .pipe(
          tap((value) => {
            this.form.patchValue(value, { onlySelf: true });
            if (value?.price) this.hasPrice = true;
          })
        )
        .subscribe();
      // TODO: history of orders for exact recipe
      // this.dao.getDocument(this.itemId).subscribe((value) => {
      //   this.form.patchValue(value, { onlySelf: true })
      //   if (value?.price) this.hasPrice = true
      // })
    }
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title']);
    this.signalService.setLayoutType(this.route.snapshot.data['type']);
  }

  changeType(event: RecipeCourse) {
    console.log(event);
    if (event === 'main') {
      this.hasPrice = true;
      this.hasProtein = true;
      this.form.get('protein').setValue(null);
      this.form.get('protein').setValidators([Validators.required]);
      this.form.get('price').setValue(null);
      this.form.get('price').setValidators([Validators.required]);
    } else if (event === 'alacarte') {
      this.hasPrice = true;
      this.hasProtein = false;
      this.form.get('price').setValue(null);
      this.form.get('price').setValidators([Validators.required]);
    } else {
      this.hasPrice = false;
      this.hasProtein = false;
      this.form.get('protein').setValue(null);
      this.form.get('protein').setValidators([]);
      this.form.get('price').setValue(null);
      this.form.get('price').setValidators([]);
    }
    this.form.updateValueAndValidity();
  }

  submit(form) {
    if (form.valid) {
      !this.isEditForm
        ? this.store.dispatch(ItemActions.createItem({ item: form.value }))
        : this.store.dispatch(
          ItemActions.updateItem({ item: form.value, id: this.itemId })
        );
    }
    // else highlightInvalidFields(form);
  }

  getErrorMessage = {} as any;

  updateImg(event) {
    this.fileName = event.target.files[0].name;
    this.fileImg = event.target.files[0];
    this.showUploadButton = true;
  }

  uploadFile() {
    // TODO: check image upload and rewrite in declarative style
    this.isUploadingImg = true;
    const uploadLink = this.fileStorageService.getFileLink(this.fileName);
    const uploadCtrl = this.fileStorageService.saveFile(
      this.fileName,
      this.fileImg
    );
    uploadCtrl.percentageChanges().subscribe((percentage) => {
      this.uploadProgress = Math.round(percentage);
      if (this.uploadProgress == 100) {
        this.showUploadButton = false;
        this.isUploadingImg = false;
        this.isUploadedImg = true;
      }
    });
    uploadLink
      .getDownloadURL()
      .subscribe((URL) => this.form.get('imgURL').setValue(URL));
  }
}
