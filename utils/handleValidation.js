exports.handleRegisterValidation = (res, field, errorMessage, detailMessage, errorCode) => {
    res.status(errorCode).json({
        message: errorMessage,
        detail: detailMessage
    })
    return;
}

exports.handleValidations = (res, fields) => {
    let validateArray = [];
    let errorObj = {};
    fields.forEach(field => {
        const obj = { fieldName: Object.keys(field).toString(), fieldValue: Object.values(field).toString() }
        validateArray.push(obj);
    })
    validateArray?.forEach(validateField => {
        if(!validateField.fieldValue || validateField.fieldValue === '' || validateField.fieldValue === undefined || validateField.fieldValue === null) {
            errorObj = {
                message: 'Missing mandatory field',
                detail: `${validateField.fieldName} is required`
            }
        }
    });
    return errorObj;
}