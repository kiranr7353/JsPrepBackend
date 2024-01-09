const admin = require('../firebaseConfig');
const db = admin.firestore();

exports.getCategories = async (req, res) => {
    try {
        const categoryRef = db.collection('categories');
        let docref = await db.collection('categories').doc('llYGEt0aQ7UrLtEgUEJB').get();
        let topics = await db.collection('topics').where('categoryId', '==', docref.ref).get();
        topics.forEach(doc => {
            // Object.assign(userDetails, doc.data());
            console.log(doc.data(), 'topics');
        });

        const snapshot = await categoryRef.get();
        snapshot.forEach(doc => {
            // Object.assign(userDetails, doc.data());
            console.log(doc.data());
        });
        
    } catch (error) {
        console.log(error);
    }
}