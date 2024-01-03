exports.handleUserSignUpErrors = (response, res) => {
    let responseError = '';
    switch (response.error.message) {
        case 'EMAIL_EXISTS':
            responseError = 'Email Already exists. Please login or try again with different email'
            break;
        default:
            responseError = 'Something went wrong. Please try again later'
            break;
    }
    res.status(response.error.code).json({
        error: response.error,
        message: responseError
    })
}
exports.handleUserLoginErrors = (response, res) => {
    let responseError = '';
    switch (response.error.message) {
        case 'INVALID_LOGIN_CREDENTIALS':
            responseError = 'Invalid email/password. Please try again'
            break;
        case 'USER_DISABLED':
            responseError = 'User is disabled. Please try again later'
            break;
        default:
            responseError = 'Something went wrong. Please try again later'
            break;
    }
    res.status(response.error.code).json({
        error: response.error,
        message: responseError
    })
}
exports.handleRefreshTokenError = (error) => {
    let responseError = '';
    switch (error?.error?.message) {
        case 'TOKEN_EXPIRED':
            responseError = 'Something went wrong. Please login'
            break;
        case 'USER_DISABLED':
            responseError = 'User is disabled. Please try again later'
            break;
        default:
            responseError = 'Something went wrong. Please login'
            break;
    }
    res.status(401).json({
        error: response.error,
        message: responseError
    })
}