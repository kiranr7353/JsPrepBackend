const admin = require('../firebaseConfig');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OAuth2Client } = require('google-auth-library');
const googleAuth = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
const { handleUserSignUpErrors, handleUserLoginErrors } = require('../utils/handleAuthErrors');
const { handleFailError } = require('../utils/handleError');
const { setToken } = require('../utils/authToken');
const { handleRegisterValidation } = require('../utils/handleValidation');
const db = admin.firestore();
const auth = admin.auth();
db.settings({ ignoreUndefinedProperties: true })

const oAuth2Client = new OAuth2Client(
    "468010744164-2pa9lhskkb50fnvibujg9os8pa8ootcr.apps.googleusercontent.com",
    "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",
    'postmessage',
);

exports.register = async (req, res) => {
    const { phoneNumber, firstName, lastName, dob, password, confirmPassword, idToken, refreshToken, email, code, platForm } = req.body;
    let phoneCode = code ? code : '+91'
    const userData = { phoneNumber, firstName, lastName, dob, phoneCode, platForm: platForm ? platForm : 'web', role: 'user' };
    if(!firstName) {
        handleRegisterValidation(res, firstName, 'Missing mandatory field', "Please enter First Name", 400);
        return;
    }
    if(!lastName) {
        handleRegisterValidation(res, lastName, 'Missing mandatory field', "Please enter Last Name", 400);
        return;
    }
    if(!dob) {
        handleRegisterValidation(res, dob, 'Missing mandatory field', "Please select Date of Birth", 400);
        return;
    }
    if(!phoneNumber) {
        handleRegisterValidation(res, phoneNumber, 'Missing mandatory field', "Please enter Phone Number", 400);
        return;
    }
    if(!phoneNumber) {
        handleRegisterValidation(res, phoneNumber, 'Missing mandatory field', "Please enter Phone Number", 400);
        return;
    }
    if(!confirmPassword) {
        handleRegisterValidation(res, confirmPassword, 'Missing mandatory field', "Confirm Password is empty", 400);
        return;
    }
    if(!email) {
        handleRegisterValidation(res, email, 'Missing mandatory field', "Please enter email", 400);
        return;
    }
    if(password !== confirmPassword) {
        handleRegisterValidation(res, confirmPassword, 'Invalid Data', "Password and Confirm Password does not match", 400);
        return;
    }
    auth.verifyIdToken(idToken).then(async (decodedToken) => {
        if (decodedToken?.uid) {
            const setUserData = { ...userData, uid: decodedToken?.uid, email: decodedToken?.email }
            const docRef = db.collection('users').doc(decodedToken?.uid);
            await docRef.set(setUserData);
            setToken(201, idToken, refreshToken, res, userData);
        }
    }).catch(error => {
        handleFailError(res, error)
    })
}

exports.googleRegister = async (req, res) => {
    const { firstName, lastName, idToken, refreshToken, email } = req.body;
    const userData = { firstName, lastName, email, role: 'user' };
    auth.verifyIdToken(idToken).then(async (decodedToken) => {
        if (decodedToken?.uid) {
            const setUserData = { ...userData, uid: decodedToken?.uid, email: decodedToken?.email }
            const docRef = db.collection('users').doc(decodedToken?.uid);
            await docRef.set(setUserData);
            setToken(201, idToken, refreshToken, res, userData);
        }
    }).catch(error => {
        handleFailError(res, error)
    })
}

exports.login = async (req, res) => {
    const { idToken, refreshToken } = req.body;
    auth.verifyIdToken(idToken).then(async (decodedToken) => {
        if (decodedToken?.uid) {
            let userData;
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('uid', '==', decodedToken?.uid).get();
            snapshot.forEach((doc) => {
              userData = doc.data();
            });
            setToken(201, idToken, refreshToken, res, userData);
        }
    }).catch(error => {
        handleFailError(res, error)
    })
}

exports.googleLogin = async (req, res) => {
    const { code } = req.body;
    const { tokens } = await oAuth2Client.getToken(code);
    if(tokens) {
        res.status(201).json(tokens);
    } else {
        res.status(500).json({
            message: 'Something went wrong. Please try again later',
            detail: `Something went wrong. Please try again later`
        })
    }
}

exports.signInWithGoogle = async (req, res) => {
    const { idToken, refreshToken, uid, displayName, email, phoneNumber, currentToken } = req.body;
    if(idToken){
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('uid', '==', uid).get();
        if (snapshot.empty) {
            const firstName = displayName?.split(' ')[0];
            const lastName = displayName?.split(' ')[1] ? displayName?.split(' ')[1] : ''
            const userData = { email, phoneNumber, uid, firstName, lastName, googleSignIn: true };
            const docRef = db.collection('users').doc(uid);
            await docRef.set(userData);
            setToken(201, idToken, refreshToken, res, userData);
        } else {
            snapshot.forEach((doc) => {
                userData = doc.data();
            });
            setToken(201, currentToken, refreshToken, res, userData);
        }
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        const userDetails = {}; 
        snapshot.forEach(doc => {
            Object.assign(userDetails, doc.data());
        });
        res.status(200).json({
            success: true,
            userInfo: userDetails
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.checkUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        const userDetails = {}; 
        snapshot.forEach(doc => {
            Object.assign(userDetails, doc.data());
        });
        res.status(200).json({
            success: true,
            userInfo: userDetails
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.getFavoriteTopics = async (req, res) => {
    try {
        const user = req?.user;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', user).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        let favoriteTopics = []; 
        snapshot.forEach(doc => {
            favoriteTopics = doc.data()?.favoriteTopics;
        });
        res.status(200).json({
            success: true,
            favoriteTopics
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.updateUserDetails = async(req, res) => {
    try {
        const batch = db.batch();
        const { userId, displayName, phoneNumber, dob } = req.body;
        const firstName = displayName?.split(' ')[0];
        const lastName = displayName?.split(' ')[1] ? displayName?.split(' ')[1] : '';
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        const userInfoRef = db.collection('users').doc(userId);
        batch.update(userInfoRef, { firstName, lastName, phoneNumber, dob });
        await batch.commit().then((result) => {
            res.status(201).json({
                message: 'Success',
                detail: "Details updated successfully"
            })
        }).catch((error) => {
            res.status(500).json({
                message: error,
                detail: "Failed to update. Please try again later"
            })
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.deleteUser = async(req, res) => {
    try {
        const batch = db.batch();
        const { userId } = req.params;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('uid', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).json({
                message: 'No user found',
                detail: "No user found for the given id"
            })
            return;
        }
        const res = await db.collection('users').doc(userId).delete();
        res.status(200).json({
            message: 'Success',
            detail: "User deleted successfully"
        })
    } catch (error) {
        handleFailError(res, error);
    }
}

exports.genAIChat = async(req, res) => {
    const genAI = new GoogleGenerativeAI('AIzaSyCRKrP2sHoXOEOcfP9bLsgw6m-UBLBUk7s');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { message } = req.body;
    const result = await model.generateContent(message);
    console.log(result.response.text());
    if(result.response.text()) {
        res.status(201).json({
            response: result.response.text()
        })
    } else {
        res.status(500).json({
            message: 'Something went wrong. Please try again later'
        })
    }
}