const express = require('express');
const importer = require('anytv-node-importer');
const multer = require('multer');
const router = express.Router();


const authorization = require('./../middleware/authorization');
const __ = importer.dirloadSync(__dirname + '/../controllers/v1');
const upload = multer({ dest: 'uploads/' });


router.get('/users', __.userController.index);
router.get('/users/:id', __.userController.show);
router.post('/users', __.userController.store);
router.put('/users/:id', authorization, __.userController.update);
router.delete('/users/:id', authorization, __.userController.remove);

router.get('/images', __.imageController.index);
router.get('/images/:id', __.imageController.show);
router.post('/images', upload.array('file'), __.imageController.store);
router.put('/images/:id', upload.array('file'), __.imageController.update);
router.delete('/images/:id', authorization, __.imageController.remove);

router.get('/news', __.blogController.index);
router.get('/news/:id', __.blogController.show);
router.post('/news', authorization, __.blogController.store);
router.put('/news/:id', authorization, __.blogController.update);
router.delete('/news/:id', authorization, __.blogController.remove);

router.get('/carousel', __.carouselController.index);
router.get('/carousel/:id', __.carouselController.show);
router.post('/carousel', __.carouselController.store);
router.put('/carousel/:id', authorization, __.carouselController.update);
router.delete('/carousel/:id', authorization, __.carouselController.remove);


router.get('/tags', __.tagController.index);
router.get('/tags/:id', __.tagController.show);
router.post('/tags', __.tagController.store);
router.put('/tags/:id', authorization, __.tagController.update);
router.delete('/tags/:id', authorization, __.tagController.remove);

router.get('/roles', __.roleController.index);
router.get('/roles/:id', __.roleController.show);
router.post('/roles', __.roleController.store);
router.put('/roles/:id', authorization, __.roleController.update);
router.delete('/roles/:id', authorization, __.roleController.remove);

router.post('/login', __.authenticationController.login);


module.exports = router;