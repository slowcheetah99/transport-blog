const router = require("express").Router();
const path = require("path");
const multer = require("multer");

const saccoController = require("./../controllers/saccoCtrls");
const blogController = require("./../controllers/blogCtrls");
const authJwt = require("../jwt_auth/jwtCtrl");
const subController = require("../controllers/commutersCtrls");
const commonControllers = require("../controllers/commonPagesCtrl");

const adminController = require("./../controllers/adminCtrls");

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("imageUpload");

//sacco routes
router.get("/", saccoController.getSaccoCtrl);

router.get("/password-reset", saccoController.passWordResetGet);

router.put("/password-reset", saccoController.passWordResetPost);

router.get("/logout", saccoController.getSaccoLogoutCtrl);

router.get("/about", commonControllers.aboutGet);

router.get("/contact", commonControllers.contactGet);

router.get("/blogs", commonControllers.allBlogsCtrl);

router.get("/404", commonControllers.pageNotFoundCtrl);

router.get("/email-check", saccoController.emailCheck);

router.get("/email-confirm", authJwt.emailAuth, saccoController.emailConfirm);

router.post("/subscribe", subController.subCtrl);

router.get("/requests/:id", adminController.reportPreview);

router.post("/requests/:id", adminController.sendReportsPost);

router.get("/:id", authJwt.jwtAuth, saccoController.getSpecificSaccoCtrl);

router.get(
  "/:id/blog",
  authJwt.jwtAuth,
  blogController.getSaccoSpecificBlogsCtrl
);

router.post("/:id/blog", blogController.postBlog);

router.get(
  "/:id/blog/edit/:id",
  authJwt.jwtAuth,
  blogController.getEditBlogCtrl
);

router.put("/:id/blog/edit/:id", blogController.updateBlogCtrl);

router.delete("/:id/blog/delete/:id", blogController.deleteBlogCtrl);

router.post("/register", upload, saccoController.postSaccoRegisterCtrl);

router.post("/login", saccoController.postSaccoLoginCtrl);

//blog routes
//router.get('/blogs', blogController.getAllBlogsCtrl);

//router.post("/blogs", jwtAuth, blogController.postBlog);

//blog routes with id

//router.patch("/blogs/:id", jwtAuth, blogController.updateBlogCtrl);

//sacco routes with id

router.patch("/:id", saccoController.updateSaccoCtrl);

router.delete("/:id", saccoController.deleteSaccoCtrl);

module.exports = router;
