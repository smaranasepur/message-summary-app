import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [email, setEmail] = useState('');

  const generateSummary = async () => {
    const res = await axios.post('http://localhost:5000/generate', {
      transcript,
      prompt,
    });
    setSummary(res.data.summary);
  };

  const sendEmail = async () => {
    await axios.post('http://localhost:5000/sendEmail', {
      email,
      summary,
    });
    alert('Email sent!');
  };

  // helper for auto-resize on input
  const handleResize = (e, setter) => {
    setter(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="wrapper">
      <h1>AI Meeting Notes Summarizer</h1>
      <div className="card">
        <label>Transcript</label>
        <textarea
          className="input"
          style={{ color: '#000' }}
          onChange={(e) => handleResize(e, setTranscript)}
        />

        <label>Prompt / Instruction</label>
        <textarea
          className="input"
          style={{ color: '#000' }}
          onChange={(e) => handleResize(e, setPrompt)}
        />

        <button className="btn" onClick={generateSummary}>Generate Summary</button>

        <label>Summary (Editable)</label>
        <textarea
          className="input"
          value={summary}
          style={{ color: '#000' }}
          onChange={(e) => handleResize(e, setSummary)}
        />

        <label>Recipient Email</label>
        <input
          className="input"
          type="email"
          style={{ color: '#000' }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn" onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  );
}

export default App;
