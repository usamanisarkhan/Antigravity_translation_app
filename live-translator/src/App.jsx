import { useState, useRef, useEffect } from "react";

export default function App() {
  const [listening, setListening] = useState(false);
  const [direction, setDirection] = useState("EN_TO_FI");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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

      try {
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
        if (data.translatedText) {
          setTranslated(data.translatedText);
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
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

  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setCameraActive(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera");
      }
    }
  };

  return (
    <div className="translator-container">
      <h2>Live Video Translator</h2>

      <div className="button-group">
        <button 
          onClick={toggleListening}
          className={`btn-primary ${listening ? "btn-listening" : ""}`}
        >
          {listening ? "Stop" : "Start"} Listening
        </button>

        <button
          onClick={toggleCamera}
          className={`btn-primary ${cameraActive ? "btn-active" : ""}`}
          style={{ backgroundColor: cameraActive ? "#059669" : "#10b981" }}
        >
          {cameraActive ? "Turn Off" : "Turn On"} Camera
        </button>

        <button
          onClick={() =>
            setDirection(
              direction === "EN_TO_FI" ? "FI_TO_EN" : "EN_TO_FI"
            )
          }
          className="btn-secondary"
        >
          {direction === "EN_TO_FI"
            ? "English → Finnish"
            : "Finnish → English"}
        </button>
      </div>

      <div className="video-section">
        <div className="video-wrapper">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`video-feed ${cameraActive ? "visible" : "hidden"}`}
          />
          {!cameraActive && <div className="video-placeholder">Camera Off</div>}
          
          <div className="subtitle-overlay">
            <div className="subtitle-original">{text}</div>
            <div className="subtitle-translated">{translated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}