const express = require('express');

const { register, login, getUserDetails, updateUserDetails, deleteUser, getFavoriteTopics, googleLogin, checkUser, googleRegister } = require('../controllers/user');
const { isAuthenticatedUser } = require('../middlewares/auth');



const router = express.Router();

router.get("/checkuser/:userId", checkUser);
router.post("/google/register", googleRegister);
router.post("/register", register);
router.post("/login/googleLoginIn", googleLogin);
router.post("/login", login);
router.get("/getFavoriteTopics", isAuthenticatedUser, getFavoriteTopics);
router.get("/delete/:userId", isAuthenticatedUser, deleteUser);
router.get("/:userId", isAuthenticatedUser, getUserDetails);
router.post("/:userId", isAuthenticatedUser, updateUserDetails);

module.exports = router;