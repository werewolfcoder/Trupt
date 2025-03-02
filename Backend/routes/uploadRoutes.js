import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/:filename', (req, res) => {
    res.sendFile(req.params.filename, { 
        root: 'uploads' 
    });
});

export default router;
