import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState({ text: "", correctAnswer: "", options: [] });
  const [language, setLanguage] = useState("Java");
  const [funFact, setFunFact] = useState("");
  const [progress, setProgress] = useState({ Java: 0, Python: 0 });

  const questions = {
    Java: [
      { text: "What is the keyword used to define a class in Java?", correctAnswer: "class", options: ["define", "class", "object", "struct"] },
      { text: "Which Java keyword is used for inheritance?", correctAnswer: "extends", options: ["super", "extends", "inherits", "parent"] }
    ],
    Python: [
      { text: "Which keyword is used to define a function in Python?", correctAnswer: "def", options: ["define", "def", "func", "lambda"] },
      { text: "What data type is the output of `type(5)` in Python?", correctAnswer: "int", options: ["str", "int", "float", "bool"] }
    ]
  };

  const funFacts = [
    "Python was named after Monty Python, not the snake!",
    "Java was originally called Oak before being renamed.",
    "Python is used by NASA for space exploration!",
    "Java runs on over 3 billion devices worldwide.",
    "Guido van Rossum created Python in the late 1980s."
  ];

  useEffect(() => {
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    loadProgress();
    loadQuestion();
  }, [language]);

  const loadProgress = () => {
    const storedXp = localStorage.getItem("xp");
    const storedStreak = localStorage.getItem("streak");
    const storedProgress = JSON.parse(localStorage.getItem("progress")) || { Java: 0, Python: 0 };
    setXp(storedXp ? parseInt(storedXp) : 0);
    setStreak(storedStreak ? parseInt(storedStreak) : 0);
    setProgress(storedProgress);
  };

  const saveProgress = (newXp, newProgress) => {
    localStorage.setItem("xp", newXp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("progress", JSON.stringify(newProgress));
  };

  const handleSubmit = (selectedAnswer) => {
    let newXp = xp;
    let newProgress = { ...progress };

    if (selectedAnswer === question.correctAnswer) {
      setFeedback("✅ Correct!");
      newXp += 10;
      newProgress[language] = Math.min(newProgress[language] + 10, 100);
    } else {
      setFeedback("❌ Incorrect! XP reduced by 5.");
      newXp = Math.max(0, newXp - 5);
    }

    setXp(newXp);
    setProgress(newProgress);
    saveProgress(newXp, newProgress);

    setTimeout(() => {
      loadQuestion();
      setFeedback("");
    }, 1000);
  };

  const loadQuestion = () => {
    const langQuestions = questions[language];
    setQuestion(langQuestions[Math.floor(Math.random() * langQuestions.length)]);
  };

  return (
    <>
      <Head>
        <title>Duocode</title>
        <meta name="description" content="A fun way to learn Java and Python!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Duocode</h1>
        
        <div className={styles.languageSelection}>
          {["Java", "Python"].map((lang) => (
            <button 
              key={lang} 
              className={language === lang ? styles.selected : ""}
              onClick={() => setLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <h3>{question.text}</h3>
        {question.options.map((option, index) => (
          <button key={index} onClick={() => handleSubmit(option)} className={styles.option}>
            {option}
          </button>
        ))}
        <p>{feedback}</p>

        <div className={styles.progressContainer}>
          {Object.keys(progress).map((lang) => (
            <div key={lang}>
              <h4>{lang} Progress: {progress[lang]}%</h4>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress[lang]}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.stats}>
          <p>🔥 Streak: {streak} days</p>
          <p>⭐ XP: {xp}</p>
        </div>

        <div className={styles.funFactBox}>
          <h3>FUN FACT</h3>
          <p>{funFact}</p>
        </div>
      </main>
    </>
  );
}
