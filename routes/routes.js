const express = require('express');
const router = express.Router();

router.get('/public', (req, res) => { res.send('Public page') });
router.get('/private', (req, res) => { res.send('Private page') });

module.exports = router;