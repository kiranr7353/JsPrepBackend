const admin = require('../firebaseConfig');
const { handleFailError } = require('../utils/handleError');
const db = admin.firestore();


exports.getPlaceholders = async (req, res) => {

    db.collection('config').doc('placeholders').get().then(resp => {
        if (resp && resp?.data()) {
            res.status(200).json({
                success: true,
                placeholders: resp?.data()?.data ? resp?.data()?.data : []
            })
            return;
        } else {
            res.status(404).json({
                message: 'No placeholders found',
                detail: `No placeholders found`
            })
            return;
        }
    }).catch(error => {
        res.status(404).json({
            message: 'No placeholders found',
            detail: error
        })
        return;
    });

}