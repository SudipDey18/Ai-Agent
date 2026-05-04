import express from 'express';
import llm from '../controller/LLM.controller.js';

const router = express.Router();

router.post("/ai",llm);

export default router