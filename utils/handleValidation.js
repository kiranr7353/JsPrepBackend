exports.handleRegisterValidation = (res, field, errorMessage, detailMessage, errorCode) => {
    res.status(errorCode).json({
        message: errorMessage,
        detail: detailMessage
    })
    return;
}