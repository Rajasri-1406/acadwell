// src/components/ui/dashboards/student/StudentQuestions.jsx
import React, { useState } from "react";
import { Send, MessageCircle, UserCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentQuestions = () => {
  const navigate = useNavigate();

  // Dummy static data (replace with API later)
  const questions = [
    {
      id: 1,
      student: "Rahul Sharma",
      question: "Can someone explain binary search tree rotations?",
      answers: [
        { sender: "Me", text: "Yes! I can help you with that 😄" },
        { sender: "Priya", text: "I have a PDF about this, sharing soon." },
      ],
    },
    {
      id: 2,
      student: "Priya Nair",
      question: "What’s the difference between supervised and unsupervised learning?",
      answers: [
        { sender: "Me", text: "Supervised = labeled data, unsupervised = unlabeled 😊" },
      ],
    },
    {
      id: 3,
      student: "Alex Student",
      question: "Best resources for React + Tailwind practice?",
      answers: [],
    },
  ];

  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    const updatedAnswers = [
      ...selectedQuestion.answers,
      { sender: "Me", text: message },
    ];
    const updatedQuestion = { ...selectedQuestion, answers: updatedAnswers };

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id ? updatedQuestion : q
    );
    setSelectedQuestion(updatedQuestion);
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl overflow-hidden shadow-xl">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-white/10 bg-black/30 backdrop-blur-lg p-4 flex flex-col">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/student")}
          className="mb-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg shadow-md text-sm font-medium w-fit"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageCircle size={20} /> Questions
        </h2>

        {/* Questions List */}
        <ul className="space-y-3 overflow-y-auto">
          {questions.map((q) => (
            <li
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className={`p-3 rounded-xl cursor-pointer transition ${
                selectedQuestion.id === q.id
                  ? "bg-purple-700/40"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-purple-300" />
                <div>
                  <h4 className="font-semibold">{q.student}</h4>
                  <p className="text-sm text-gray-300 truncate w-44">
                    {q.question}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="w-2/3 flex flex-col">
        {/* HEADER */}
        <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-white/10 flex items-center gap-3">
          <UserCircle size={36} className="text-purple-300" />
          <div>
            <h3 className="text-lg font-semibold">{selectedQuestion.student}</h3>
            <p className="text-gray-300 text-sm">
              Asking: {selectedQuestion.question}
            </p>
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
          {selectedQuestion.answers.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              💬 No answers yet. Be the first to reply!
            </p>
          ) : (
            selectedQuestion.answers.map((ans, index) => (
              <div
                key={index}
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  ans.sender === "Me"
                    ? "bg-purple-600 text-white ml-auto"
                    : "bg-white/10 text-gray-200 mr-auto"
                }`}
              >
                <span className="block font-semibold">{ans.sender}</span>
                {ans.text}
              </div>
            ))
          )}
        </div>

        {/* INPUT BOX */}
        <div className="p-4 bg-black/30 backdrop-blur-lg border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your answer..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl px-4 py-2 flex items-center gap-2 transition text-sm font-medium"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuestions;
