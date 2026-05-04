import express from 'express';
import cors from 'cors';
import llmRouter from './router/LLM.router.js';

const app = express();
const urls = process.env.CORS_ORIGIN || ["http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || urls.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Origin not allowed"));
        }
    }
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("ok");
});

app.use('/api', llmRouter);

app.listen(3000, () => {
    console.log("Server running at port 3000");
})