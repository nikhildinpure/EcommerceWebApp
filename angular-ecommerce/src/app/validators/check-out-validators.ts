import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckOutValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors{
        if(control.valid != null && control.value != null ){
            if(control.value.trim().length === 0){
                return {'notOnlyWhitespace': true};
            }
        }
        return {};
    }

}
