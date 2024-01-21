import express from 'express';

import Manga from '../controller/manga.js';

const router = express.Router();

router.get('/list', Manga.getList);
router.get('/bio', Manga.bio);
router.get('/chapter', Manga.chapter);
router.get('/img', Manga.image);

export default router;