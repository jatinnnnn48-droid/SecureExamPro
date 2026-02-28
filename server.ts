import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for demo purposes (in a real app, use SQLite which is already installed)
  // But for this session, we'll keep it simple.
  let currentExam: any = null;

  app.post("/api/exam/setup", (req, res) => {
    const { questions, solutionKey, title, description, examinerEmail, timeLimit } = req.body;
    currentExam = { questions, solutionKey, title, description, examinerEmail, timeLimit };
    res.json({ success: true });
  });

  app.get("/api/exam/active", (req, res) => {
    if (!currentExam) {
      return res.status(404).json({ error: "No active exam" });
    }
    // Don't send the solution key to the client!
    const { solutionKey, ...publicExam } = currentExam;
    res.json(publicExam);
  });

  app.post("/api/exam/submit", async (req, res) => {
    const { studentName, responses, startTime, endTime, terminationReason } = req.body;
    
    if (!currentExam) {
      return res.status(404).json({ error: "No active exam" });
    }

    // Evaluate
    let score = 0;
    const evaluation = currentExam.questions.map((q: any, index: number) => {
      const isCorrect = responses[index] === currentExam.solutionKey[index];
      if (isCorrect) score++;
      return {
        question: q.text,
        studentAnswer: responses[index],
        correctAnswer: currentExam.solutionKey[index],
        isCorrect
      };
    });

    const totalQuestions = currentExam.questions.length;
    const percentage = (score / totalQuestions) * 100;

    const resultData = {
      studentName,
      score,
      totalQuestions,
      percentage: percentage.toFixed(2),
      evaluation,
      terminationReason: terminationReason || "Normal Submission",
      duration: Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) + " seconds"
    };

    // Send Email
    const targetEmail = currentExam.examinerEmail || process.env.EXAMINER_EMAIL;
    
    if (resend && targetEmail) {
      try {
        await resend.emails.send({
          from: "SecureExam <onboarding@resend.dev>",
          to: targetEmail,
          subject: `Exam Result: ${studentName} - ${currentExam.title}`,
          html: `
            <h1>Exam Results for ${studentName}</h1>
            <p><strong>Exam:</strong> ${currentExam.title}</p>
            <p><strong>Score:</strong> ${score} / ${totalQuestions} (${percentage.toFixed(2)}%)</p>
            <p><strong>Status:</strong> ${resultData.terminationReason}</p>
            <p><strong>Duration:</strong> ${resultData.duration}</p>
            <hr/>
            <h2>Detailed Responses</h2>
            <ul>
              ${evaluation.map((e: any) => `
                <li>
                  <strong>Q:</strong> ${e.question}<br/>
                  <strong>Student:</strong> ${e.studentAnswer || "No Answer"}<br/>
                  <strong>Correct:</strong> ${e.correctAnswer}<br/>
                  <strong>Result:</strong> ${e.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                </li>
              `).join('')}
            </ul>
          `
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    } else {
      console.log("Email not sent: Resend API key or target email missing.");
      console.log("Result Data:", JSON.stringify(resultData, null, 2));
    }

    res.json({ success: true, score, totalQuestions, terminationReason });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
