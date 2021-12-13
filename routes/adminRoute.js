const router = require("express").Router();
const adminController = require("./../controllers/adminCtrls");
const auth = require("../jwt_auth/jwtCtrl");

//admin routes
router.get("/register", adminController.getAdminRegisterCtrl);

router.post("/register", adminController.postAdminRegisterCtrl);

router.get("/", adminController.getAdminLoginCtrl);

router.post("/", adminController.postAdminLoginCtrl);

router.get("/home", auth.authJwt, adminController.getAdminCtrl);

router.get("/home/requests", auth.authJwt, adminController.sendReports);

router.get("/home/:id", auth.authJwt, adminController.updateAdminCtrlGet);

router.put("/home/:id", adminController.updateAdminCtrl);

router.get("/logout", adminController.adminLogout);

module.exports = router;
