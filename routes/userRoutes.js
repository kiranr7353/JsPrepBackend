const express = require('express');

const { register, login, getUserDetails, signInWithGoogle, updateUserDetails, deleteUser } = require('../controllers/user');
const { isAuthenticatedUser } = require('../middlewares/auth');



const router = express.Router();

router.post("/register", register);
router.post("/sign/googleSignIn", signInWithGoogle);
router.post("/login", login);
router.get("/delete/:userId", isAuthenticatedUser, deleteUser);
router.get("/:userId", isAuthenticatedUser, getUserDetails);
router.post("/:userId", isAuthenticatedUser, updateUserDetails);
// router.get("/acc", getAccessTokenForGoogle);

module.exports = router;