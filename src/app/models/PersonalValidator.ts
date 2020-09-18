import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';


export class PersonalValidator {

  static ptDate(control: FormControl): { [key: string]: any } {
    let ptDatePattern = /(?:(?:(?:0[1-9]|1\d|2[0-8])-(?:0[1-9]|1[0-2])|(?:29|30)-(?:0[13-9]|1[0-2])|31-(?:0[13578]|1[02]))-[1-9]\d{3}|29-02(?:-[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00))/

    if (!control.value.match(ptDatePattern))
      return {"ptDate": true};

    return null;
  }

  static usDate(control: FormControl): { [key: string]: any } {
    let usDatePattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;

    if (!control.value.match(usDatePattern))
      return {"usDate": true};

    return null;
  }

  static number(control: FormControl): { [key: string]: any } {
    let numberPattern = /^(\d*\.)?\d+$/igm
    if (!control.value.match(numberPattern))
      return {"number": true};

    return null;
  }

  static MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
