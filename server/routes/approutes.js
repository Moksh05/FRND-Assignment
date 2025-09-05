
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getOptimizedLoads } = require('../controllers/logisticscontroller');
const { uploadExcel, downloadReport } = require('../controllers/excelcontroller');


const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadExcel);
//router.get('/costs', getCompanyCost);
router.get('/optimizeload', getOptimizedLoads);
router.get('/report', downloadReport);

module.exports = router;