const admin = require('../firebaseConfig');
const fetch = require('node-fetch');
const { handleRefreshTokenError } = require('../utils/handleAuthErrors');
const auth = admin.auth();

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        let token = req?.get('Authorization');
        console.log(token);
        let refreshToken = req?.get('Refreshtoken');
        if (!token) {
            return res.status(401).json({
                message: "Unathorized"
            })
        }
        if (token?.startsWith("Bearer ")) {
            token = token.slice(7, token?.length).trimLeft();
            if(token.slice(7, token?.length).trimLeft()) {
                auth.verifyIdToken(token).then(async(decodedToken) => {
                    console.log(decodedToken, 'decodedToken');
                    if (decodedToken?.uid) {
                        req.user = decodedToken?.uid
                        next();
                    }
                }).catch(async (error) => {
                    console.log(error, 'error1');
                    if (error?.errorInfo?.code === 'auth/id-token-expired') {
                        const response = await handleRefreshToken(refreshToken);
                        console.log(response, 'response');
                        if (response?.id_token) {
                            auth.verifyIdToken(response?.id_token).then((decodedToken) => {
                                if (decodedToken?.uid) {
                                    req.user = decodedToken?.user_id
                                    next();
                                }
                            }).catch((error) => {
                                if (error) {
                                    res.status(401).json({ message: 'Unauthorized' })
                                }
                            })
                        } else {
                            res.status(401).json({ message: 'Unauthorized' })
                        }
                    } else {
                        res.status(401).json({ message: 'Unauthorized' })
                    }
                })
            } else {
                return res.status(401).json({
                    message: "Unathorized"
                })
            }
        }
       
    } catch (error) {
        console.log(error, 'error2');

        res.status(500).json({ error })
    }
}

const handleRefreshToken = async (refreshToken) => {
    try {
        const payload = {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }
        const resData = await fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyAcZjxtVxKuaNoeClWKeh8Luk8g2NMjhZ8', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const response = await resData.json();
        if (response) return response
    } catch (error) {
        handleRefreshTokenError(error)
    }
}