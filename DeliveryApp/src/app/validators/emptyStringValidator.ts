import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmptyStringValidator {

  static emptyString(control: AbstractControl): ValidationErrors | null {
    if (!(control.value as string).replace(/\s/g, '').length) {
      return { emptyString: true }
    }
    return null;
  }
}
