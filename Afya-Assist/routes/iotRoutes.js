import express from 'express';
import bodyParser from 'body-parser';
import { saveIoTData } from '../controllers/iotController.js';

const router = express.Router();

router.use(bodyParser.json());

router.post('/iot-data', saveIoTData);

export default router;