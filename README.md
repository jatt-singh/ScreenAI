# 🤖 ScreenAI — AI-Powered HR Candidate Screening

> Upload a resume. Chat with the candidate. Match the JD. All powered by AI.

![ScreenAI Banner](https://img.shields.io/badge/ScreenAI-v1.0-4f46e5?style=for-the-badge&logo=openai&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🚀 What is ScreenAI?

ScreenAI is an AI-powered HR screening tool that transforms how hiring teams evaluate candidates. Instead of reading through dozens of resumes manually, HR teams can:

- **Upload a resume PDF** and let AI extract all candidate details
- **Chat with the candidate** — AI responds as the candidate based strictly on resume facts
- **Paste a Job Description** and get an instant match score with skill breakdown
- **Make faster, smarter hiring decisions** without wasting time on unqualified interviews

---

## ✨ Features

- 📄 **PDF Resume Parser** — Upload any resume PDF and extract full content instantly
- 🤖 **AI as Candidate** — Chat with LLM that responds as the candidate using only resume facts
- 📊 **JD Match Score** — Get a percentage match with matched skills, missing skills, strengths and gaps
- 💬 **Suggested Questions** — Pre-built HR interview questions to get started quickly
- 🎨 **Clean 3-Panel Dashboard** — Resume viewer, chat interface, and JD match all in one screen

---

## 🖥️ Screenshots

> ![alt text](<Screenshot 2026-05-01 at 10.24.04 PM.png>)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| AI / LLM | OpenAI GPT-4o-mini |
| PDF Parsing | pdf-parse |
| File Upload | Multer |
| Frontend | Vanilla HTML + CSS + JavaScript |

---

## 📁 Project Structure

```
ScreenAI/
├── backend/
│   ├── controllers/
│   │   └── chatController.js   # OpenAI logic + resume context
│   ├── routes/
│   │   └── chat.js             # API route definitions
│   ├── utils/
│   │   └── pdfParser.js        # PDF text extraction
│   ├── server.js               # Express server entry point
│   ├── .env                    # Environment variables (API keys)
│   └── package.json
│
└── frontend/
    ├── css/
    │   └── style.css           # Clean minimal styling
    ├── js/
    │   └── app.js              # Frontend logic + API calls
    └── index.html              # Main dashboard UI
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- OpenAI API Key — get one at [platform.openai.com](https://platform.openai.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/jatt-singh/ScreenAI.git
cd ScreenAI
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Set up environment variables**

Create a `.env` file inside the `backend` folder:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

**4. Start the server**
```bash
node server.js
```

**5. Open in browser**
```
http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload-resume` | Upload PDF resume and extract text |
| POST | `/api/chat` | Chat with AI as the candidate |
| POST | `/api/analyze-match` | Analyze JD match score |

---

## 💡 How It Works

```
HR uploads Resume PDF
        ↓
Backend extracts full text using pdf-parse
        ↓
OpenAI receives system prompt:
"You are this candidate. Answer only from resume facts."
        ↓
HR chats freely — AI responds as the candidate
        ↓
HR pastes Job Description → AI returns match % + skill breakdown
        ↓
HR decides: Contact ✅ or Skip ❌
```

---

## 🗺️ Roadmap

- [x] PDF resume upload and parsing
- [x] AI chat as candidate
- [x] JD match score with skill breakdown

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

Built with ❤️ and AI assistance.

> _"AI doesn't replace developers. It makes them unstoppable."_

⭐ If you found this useful, give it a star on GitHub!

---

_ScreenAI — Making hiring smarter, one resume at a time._