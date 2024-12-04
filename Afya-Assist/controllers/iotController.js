import { saveDataToDatabase, getIoTData } from '../middleware/db.js';

const saveIoTData = async (req, res) => {
    try {
        const { deviceId, data } = req.body;
        await saveDataToDatabase(deviceId, data);
        res.status(200).send('Data saved successfully');
    } catch (error) {
        res.status(500).send('Error saving data');
    }
};

const fetchIoTData = async (req, res) => {
    try {
        const data = await getIoTData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
};

export default {
    saveIoTData,
    fetchIoTData
};