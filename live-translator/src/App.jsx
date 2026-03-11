import { useState, useRef, useEffect } from "react";

export default function App() {
  const [listening, setListening] = useState(false);
  const [direction, setDirection] = useState("EN_TO_FI");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome or Edge browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      direction === "EN_TO_FI" ? "en-US" : "fi-FI";

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;
      setText(transcript);

      const target = direction === "EN_TO_FI" ? "fi" : "en";

      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: transcript,
          source: "auto",
          target: target,
          format: "text"
        })
      });

      const data = await res.json();
      setTranslated(data.translatedText);
    };

    recognitionRef.current = recognition;
  }, [direction]);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Live Voice Translator</h2>

      <button onClick={toggleListening}>
        {listening ? "Stop" : "Start"} Listening
      </button>

      <button
        onClick={() =>
          setDirection(
            direction === "EN_TO_FI" ? "FI_TO_EN" : "EN_TO_FI"
          )
        }
        style={{ marginLeft: "10px" }}
      >
        {direction === "EN_TO_FI"
          ? "English → Finnish"
          : "Finnish → English"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <h4>Recognized:</h4>
        <p>{text}</p>

        <h4>Translated:</h4>
        <p>{translated}</p>
      </div>
    </div>
  );
}