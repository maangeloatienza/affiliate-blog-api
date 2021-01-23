const express = require('express');
const importer = require('anytv-node-importer');
const multer = require('multer');
const router = express.Router();


const authorization = require('./../middleware/authorization');
const __ = importer.dirloadSync(__dirname + '/../controllers/v1');
const upload = multer({ dest: 'uploads/' });


router.get ('/users',                       __.userController.index);
router.get ('/users/:id',                   __.userController.show);
router.post('/users',                       __.userController.store);
router.put ('/users/:id',   authorization,  __.userController.update);
router.delete('/users/:id', authorization,  __.userController.remove);

router.get ('/images',                      __.imageController.index);
router.get ('/images/:id',                   __.imageController.show);
router.post('/images',upload.single('file'),__.imageController.store);
router.put ('/images/:id',upload.single('file'), __.imageController.update);
router.delete('/images/:id', authorization, __.imageController.remove);

router.get ('/blogs',                       __.blogController.index);
router.get ('/blogs/:id',                   __.blogController.show);
router.post('/blogs',                       __.blogController.store);
router.put ('/blogs/:id',   authorization,  __.blogController.update);
router.delete('/blogs/:id', authorization,  __.blogController.remove);

router.post('/login', __.authenticationController.login);


module.exports = router;