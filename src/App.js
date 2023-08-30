import "./App.css";
import { useState, useRef, useEffect } from "react";

const DELAY = 3000;
const TIMER = 2;
const INTERVAL = 1000;

export default function App() {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(TIMER);

  const timerRef = useRef();
  const intervalRef = useRef();
  const ballRef = useRef();
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const currentTimer = useRef(null);


  useEffect(() => {
    const resize = () => {
      if (!visible) {
        return
      }

      setTimer(currentTimer.current);
      timeout(currentTimer.current * INTERVAL);
      countdown();
      moveFromTo(ballRef, block2Ref, currentTimer.current * INTERVAL);
    }

    currentTimer.current = timer
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [visible, timer])

  

  const countdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => setTimer((prev) => prev - 1), INTERVAL);
  };

  const timeout = (delay) => {    
    setVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, delay);
  };

  const getCenter = (ref) => {
    const circleRect = ballRef.current.getBoundingClientRect();
    const rect = ref.current.getBoundingClientRect();

    const left = rect.left + rect.width / 2 - circleRect.width / 2 + document.documentElement.scrollLeft;
    const top = rect.top + rect.height / 2 - circleRect.width / 2 + document.documentElement.scrollTop;

    return [left, top];
  };

  const moveFromTo = (start, end, delay) => {
    const [startLeft, startTop] = getCenter(start);
    const [endLeft, endTop] = getCenter(end);

    ballRef.current.animate(
      [
        {
          transform: `translate(${startLeft}px, ${startTop}px)`
        },
        {
          transform: `translate(${endLeft}px, ${endTop}px)`
        }
      ],
      {
        duration: delay,
        easing: "linear"
      }
    );
  };

  const handleStartClick = () => {
    setTimer(TIMER);
    timeout(DELAY);
    countdown();
    moveFromTo(block1Ref, block2Ref, DELAY);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="block block-1" ref={block1Ref}></div>
        <div className="block block-2" ref={block2Ref}></div>
        <div
          className={`ball ${!visible ? "ball_hidden" : ""}`}
          ref={ballRef}
        ></div>
      </div>

      <button
        className="button"
        onClick={handleStartClick}
        disabled={visible ? true : false}
      >
        {visible ? timer : "START"}
      </button>
    </div>
  );
}
