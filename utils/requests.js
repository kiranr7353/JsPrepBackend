const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();


exports.requestData = async (req, res, payload, requestId) => {
    const user = req?.user
    const docRef = db.collection('adminRequests').doc(requestId);
    payload.requestId = requestId;
    payload.user = user;
    docRef.set(payload).then(response => {
        if (response) {
            res.status(201).json({
                success: true,
                message: 'Request raised successfully'
            })
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong. Please try again later',
            detail: err
        })
    });
}