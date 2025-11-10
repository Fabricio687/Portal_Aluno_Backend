const express = require("express");
const multer = require("multer");
const SpotsController = require("../controllers/Spots.controller");
const router = express.Router();

const uploadconfig = require("../config/upload");

const upload = multer(uploadconfig);

router.post("/", upload.single("thumbnail"), SpotsController.store);
router.get("/", SpotsController.index);

module.exports = router;
