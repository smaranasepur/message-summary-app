const express = require('express');
const cors = require('cors');
require('dotenv').config();

const nodemailer = require('nodemailer');

const app = express();
app.use(
  cors({
    origin:'https://message-summary-app.vercel.app'
  })
);;
app.use(express.json());

// Route to generate AI summary
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_KEY });

app.post('/generate', async (req, res) => {
  const { transcript, prompt } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: transcript }
      ]
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating summary" });
  }
});


// Route to send the summary by email
app.post('/sendEmail', async (req, res) => {
  const { email, summary } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: 'Meeting Summary',
      text: summary,
    });

    res.json({ status: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
