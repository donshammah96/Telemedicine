import app from './index.js';
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});