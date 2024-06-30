import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorageReference } from '@angular/fire/compat/storage';
import {
  PLATE_PROTEIN_TRANSLATE,
  PLATE_TYPE_TRANSLATE,
} from '../../utils/recipe.constants';
import { FileStorageService } from 'src/app/shared/services/file-storage.service';
import { Recipe, RecipeCourse } from '../../utils/recipe.model';
import { Store } from '@ngrx/store';
import { getItem, getItemLoadingState } from '../../store/recipe.selectors';
import { RecipeActions as ItemActions } from '../../store/recipe.actions';
import { Observable, tap } from 'rxjs';
import { getErrorMessage } from 'src/app/shared/utils/get-error-message';
import { markInvalidFields } from 'src/app/shared/utils/mark-invalid-fields';
import { SharedConstants } from 'src/app/shared/utils/shared.constants';
import { SignalService } from 'src/app/shared/services/signal.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormComponent implements OnInit {
  // Selectors
  readonly loadingState$: Observable<boolean> =
    this.store$.select(getItemLoadingState);
  readonly getItem$: Observable<Recipe> = this.store$.select(getItem);

  form: FormGroup;
  recipeTosave: Recipe;
  isEditForm: boolean;
  itemId: string;
  hasPrice: boolean;
  hasProtein: boolean;
  imgURL: string;
  fileName: string;
  fileImg: AngularFireStorageReference;
  uploadProgress: number;
  showUploadButton: boolean;
  isUploadingImg: boolean;
  isUploadedImg: boolean;

  plateTypeTranslate = PLATE_TYPE_TRANSLATE;
  plateProteinTranslate = PLATE_PROTEIN_TRANSLATE;

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private fileStorageService: FileStorageService,
    private signalService: SignalService
  ) {}

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
      this.store$.dispatch(ItemActions.getItem({ id: this.itemId }));
      this.store$
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
        ? this.store$.dispatch(ItemActions.createItem({ item: form.value }))
        : this.store$.dispatch(
            ItemActions.updateItem({ item: form.value, id: this.itemId })
          );
    } else markInvalidFields(form);
  }

  getErrorMessage = getErrorMessage;

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
