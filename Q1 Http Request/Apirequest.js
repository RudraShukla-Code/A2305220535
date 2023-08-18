
import express from "express";
import axios from "axios";
const app = express();
const port = 8008;


const TIMEOUT_MS = 5000;  

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid or missing URL parameter' });
    }

    const uniqueNumbers = new Set();

    const requests = urls.map(async (url) => {
        try {
            const response = await axios.get(url, { timeout: TIMEOUT_MS });
            if (response.status === 200 && Array.isArray(response.data.numbers)) {
                response.data.numbers.forEach(number => uniqueNumbers.add(number));
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
        }
    });

    await Promise.all(requests);

    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    res.json({ numbers: sortedNumbers });
});


app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})
