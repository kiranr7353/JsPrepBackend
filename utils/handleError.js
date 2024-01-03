exports.handleFailError = (res, error) => {
    res.status(500).json({
        error: error ? error : 'Something went wrong. Please try again'
    })
}