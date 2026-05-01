const OpenAI = require('openai');
const { extractTextFromPDF } = require('../utils/pdfParser');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let resumeContext = '';

// Upload resume and extract text
const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await extractTextFromPDF(req.file.buffer);
    resumeContext = text;

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeText: text,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Chat with candidate (LLM acts as candidate)
const chatWithCandidate = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!resumeContext) {
      return res.status(400).json({ error: 'Please upload a resume first' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: `You are acting as a job candidate. Below is your resume. 
Answer all HR interview questions strictly based on the information in this resume only. 
Be natural, confident, and professional. Do not make up any information not present in the resume.
If asked about something not in the resume, say you can provide more details if needed.

RESUME:
${resumeContext}`,
      },
      ...chatHistory,
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analyze JD match
const analyzeMatch = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!resumeContext) {
      return res.status(400).json({ error: 'Please upload a resume first' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const prompt = `You are an expert HR analyst. Compare this resume with the job description and provide a detailed analysis.

RESUME:
${resumeContext}

JOB DESCRIPTION:
${jobDescription}

Respond in this exact JSON format:
{
  "matchPercentage": <number 0-100>,
  "candidateName": "<name from resume>",
  "candidateTitle": "<current title from resume>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "summary": "<2-3 sentence overall assessment>"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const clean = content.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadResume, chatWithCandidate, analyzeMatch };