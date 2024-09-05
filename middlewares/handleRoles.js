const admin = require('../firebaseConfig');
const db = admin.firestore();

exports.handleRoles = async (req, res, next) => {
    let currentUser = req?.user;
    console.log(currentUser);
    
    if (currentUser) {
        let userData;
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('uid', '==', currentUser).get();
        snapshot.forEach((doc) => {
            userData = doc.data();
        });
        console.log(userData);
        console.log(userData?.role, 'role');
        
       if(userData?.role && (userData?.role === 'superAdmin' || userData?.role === 'admin')) {
          next();
       } else {
         res.status(400).json({ message: 'Unauthorized', detail: "You are not authorized to perform this operation!. Please contact admin." });
       }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}