import { useState, useMemo } from "react";
import { quizData } from "./quizData";

import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [readyPressed, setReadyPressed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const letters = ["A", "B", "C", "D"];

  const current = quizData[currentQuestion];

  // Shuffle answers once per question
  const answers = useMemo(() => {
    return [...current.wrongAnswers, current.correctAnswer].sort(
      () => Math.random() - 0.5
    );
  }, [current]);

  const handleAnswer = (answer) => {
    if (selected) return; // prevent multiple clicks

    setSelected(answer);

    if (answer === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Move to next question after 1.5s
    setTimeout(() => {
      setSelected(null);
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleYesClick = async () => {
    setYesPressed(true);

    const formData = new FormData();
    formData.append("form-name", "valentine-yes");
    formData.append("response", "She said YES ❤️");

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });
  };

  const handleNoClick = () => setNoCount(noCount + 1);

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "For real?",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "Plsss? :( You're breaking my heart",
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  // Result screen
  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h2 className="text-2xl mb-4">
          You scored {score} / {quizData.length}
        </h2>

        {score >= 7 ? (
          <div>
            <h1 className="text-4xl mb-2">❤️ Happy Valentine My Love ❤️</h1>
            <p>
              You are my favorite person, my safe place, and my forever choice.
              Thank you for choosing me every day.
            </p>
          </div>
        ) : (
          <p>I don't think this is my baby. Try again later, intruder! 😁🤣</p>
        )}
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center pt-4 p-6 h-screen text-zinc-900">
      {!yesPressed && (
        <>
          <img
            src={lovesvg}
            className="fixed animate-pulse top-10 left-6 w-28 md:w-40"
          />
          {/* <img
            src={lovesvg2}
            className="fixed bottom-16 right-10 md:right-24 md:w-40 w-32 animate-pulse"
          /> */}
          <img
            className="h-[230px] rounded-lg shadow-lg mb-6"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.webp"
          />
          <p className="text-2xl text-red-500">Happy Valentine</p>
          <h1 className="text-4xl md:text-6xl my-4 text-center">
            Will you be my Forever?
          </h1>
          <div className="flex flex-wrap justify-center gap-2 items-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button
              onClick={handleNoClick}
              className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4"
            >
              {getNoButtonText()}
            </button>
            <form name="valentine-yes" method="POST" data-netlify="true" hidden>
              <input type="hidden" name="form-name" value="valentine-yes" />
              <input type="text" name="response" />
            </form>

          </div>
        </>
      )}

      {yesPressed && !readyPressed && (
        <div className="text-center">
          <img
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
            className="mx-auto mb-4"
          />
          <h2 className="text-4xl md:text-6xl font-bold my-4">Ok Yayyyyy!!!</h2>
          <p>
            There is a surprise waiting for you. To unlock it, answer a few
            questions only someone who knows us would get right. Ready?
          </p>
          <button
            onClick={() => setReadyPressed(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
          >
            Yes I'm Ready
          </button>
        </div>
      )}

      {yesPressed && readyPressed && (
        <div className="text-center">
          <h2 className="mb-2">
            Question {currentQuestion + 1} / {quizData.length}
          </h2>

          {current.image && (
            <img
              src={current.image}
              className="w-[200px] h-[200px] rounded-md overflow-hidden mb-4"
            />
          )}
          <h3 className="mb-4">{current.question}</h3>

          {answers.map((answer, index) => {
            const isCorrect = answer === current.correctAnswer;
            const isSelected = selected === answer;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="block w-full md:w-auto my-2 px-4 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: selected
                    ? isCorrect
                      ? "green"
                      : isSelected
                      ? "red"
                      : ""
                    : "white",
                  color: selected ? "white" : "black",
                }}
              >
                {letters[index]}. {answer}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
