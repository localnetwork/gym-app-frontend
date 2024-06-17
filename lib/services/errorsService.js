const errorsService = {
    findError: (errors, field) => {
        if(errors.length > 0) {
            return errors?.find((error, index) => {
                return error[field]
            }); 
        } 
    }  
}  
export default errorsService; 