exports.setToken = (statusCode, token, refreshToken, res, userData) => {
    res.status(statusCode).json({
        success: true,
        token,
        refreshToken: refreshToken,
        userInfo: userData
    });
}