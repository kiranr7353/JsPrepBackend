const admin = require("firebase-admin");

const serviceAccount = require('./key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "jsprep-ed0c8.appspot.com"
});

module.exports = admin;