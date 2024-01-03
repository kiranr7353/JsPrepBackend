const admin = require('../firebaseConfig');
const fetch = require('node-fetch');
const googleAuth = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
const { handleUserSignUpErrors, handleUserLoginErrors } = require('../utils/handleAuthErrors');
const { handleFailError } = require('../utils/handleError');
const { setToken } = require('../utils/authToken');
const db = admin.firestore();
const auth = admin.auth();
db.settings({ ignoreUndefinedProperties: true })

exports.register = async (req, res) => {
    const { phoneNumber, firstName, lastName, dob, idToken, refreshToken } = req.body;
    const userData = { phoneNumber, firstName, lastName, dob }
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
        console.log(userId);
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