import {
  explainCodeAI,
  debugCodeAI,
  optimizeCodeAI,
  generateCodeAI,
  convertCodeAI,
} from '../services/aiService.js';

const judge0LanguageIds = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const executeCode = async (req, res, next) => {
  try {
    const { code, language, stdin = '' } = req.body;
    const languageId = judge0LanguageIds[language];

    if (!code || !language) {
      return res.status(400).json({ message: 'code and language are required' });
    }
    if (!languageId) {
      return res.status(400).json({ message: `Execution is not supported for ${language}` });
    }

    const judge0Url = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
    }

    const submissionResponse = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ language_id: languageId, source_code: code, stdin }),
    });

    if (!submissionResponse.ok) {
      const details = await submissionResponse.text();
      throw new Error(`Execution service rejected the request (${submissionResponse.status}): ${details}`);
    }

    const { token } = await submissionResponse.json();
    let result;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await sleep(500);
      const resultResponse = await fetch(`${judge0Url}/submissions/${token}?base64_encoded=false`, { headers });
      if (!resultResponse.ok) {
        throw new Error(`Execution service polling failed (${resultResponse.status})`);
      }
      result = await resultResponse.json();
      if (result.status?.id > 2) break;
    }

    if (!result || result.status?.id <= 2) {
      return res.status(504).json({ message: 'Execution timed out before Judge0 returned a result' });
    }

    const statusDescription = result.status?.description || 'Unknown';
    const errorOutput = result.stderr || result.compile_output || '';
    const status = errorOutput.includes('SyntaxError')
      ? 'Syntax Error'
      : statusDescription.startsWith('Runtime Error')
        ? 'Runtime Error'
        : statusDescription;
    res.json({
      status,
      statusId: result.status?.id,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      message: result.message || '',
    });
  } catch (error) {
    next(error);
  }
};

export const explainCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }
    const explanation = await explainCodeAI(code, language);
    res.json({ result: explanation });
  } catch (error) {
    next(error);
  }
};

export const debugCode = async (req, res, next) => {
  try {
    const { code, errorMessage } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }
    const debugResult = await debugCodeAI(code, errorMessage);
    res.json({ result: debugResult });
  } catch (error) {
    next(error);
  }
};

export const optimizeCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code parameter is required' });
    }
    const optimized = await optimizeCodeAI(code, language);
    res.json({ result: optimized });
  } catch (error) {
    next(error);
  }
};

export const generateCode = async (req, res, next) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt parameter is required' });
    }
    const generated = await generateCodeAI(prompt, language);
    res.json({ result: generated });
  } catch (error) {
    next(error);
  }
};

export const convertCode = async (req, res, next) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({ message: 'code, fromLanguage, and toLanguage are required' });
    }
    const converted = await convertCodeAI(code, fromLanguage, toLanguage);
    res.json({ result: converted });
  } catch (error) {
    next(error);
  }
};
