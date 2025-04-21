import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slogans = [
  "✅ Your vote is recorded! Thank you for voting!",
  "✅ Vote successful! Your voice matters!",
  "✅ Voting done! Thank you for participating!",
  "✅ Your vote is counted! Have a great day!",
  "✅ You have voted! Democracy wins!",
  "✅ Voting complete! Thank you for making a difference!",
  "✅ Success! Your vote is safe and counted!",
  "✅ Thank you! Your vote helps shape the future!",
  "✅ Your vote, your power! Thanks for voting!",
  "✅ Done! You made your voice heard!",
  "✅ Vote cast successfully! Thank you!",
  "✅ Thank you! Every vote counts!",
  "✅ Great job! Your vote is secured!",
  "✅ Ballot submitted! Thanks for being part of democracy!",
  "✅ Your decision matters! Thank you for voting!",
  "✅ One vote can make a difference! Thanks for yours!",
  "✅ Your duty is done! Thanks for voting!",
  "✅ Vote counted! Thank you for shaping the future!",
  "✅ Well done! Your vote has been recorded!",
  "✅ Success! You’ve played your part in democracy!",
  "✅ Thank you for participating in the election!",
  "✅ Your choice matters! Vote recorded!",
  "✅ Vote cast! Thank you for being a responsible citizen!",
  "✅ You did it! Thanks for casting your vote!",
  "✅ Your vote is in! Thank you for supporting democracy!",
  "✅ Voting complete! Your contribution is valuable!",
  "✅ Mission accomplished! Your vote is secured!",
  "✅ Your vote, your right! Thanks for exercising it!",
  "✅ Great work! Your vote is now part of history!",
  "✅ Election process complete! Thank you for voting!"
];

export default function VotingEndScreen() {
  const [slogan, setSlogan] = useState(slogans[0]);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sloganInterval = setInterval(() => {
      const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
      setSlogan(randomSlogan);
    }, 5000);

    const timeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/booth-officer/VotingPhase');
      }, 2000);
    }, 10000);

    return () => {
      clearInterval(sloganInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className={`flex items-center justify-center h-screen text-center font-sans relative overflow-hidden bg-gradient-to-b from-[#FF9933] via-white to-[#138808] transition-opacity duration-[2000ms] ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <svg className="absolute w-[300px] h-[300px] opacity-20 slow-spin" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#000088" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="5" fill="#000088" />
        <g stroke="#000088" strokeWidth="3">
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="5"
              x2="50"
              y2="95"
              transform={`rotate(${i * 15},50,50)`}
            />
          ))}
        </g>
      </svg>

      <div className="z-10 text-black space-y-4 animate-fadeIn">
        <h1 className="text-3xl font-bold animate-fadeInScale delay-[200ms]">🎉 THANK YOU FOR VOTING! 🗳️</h1>
        <p className="text-xl font-semibold animate-slideIn delay-[600ms]">
          "The ballot is stronger than the bullet." - Abraham Lincoln
        </p>
        <div className="overflow-hidden h-8 relative">
          <p
            className="text-lg font-bold absolute w-full animate-scrollUp"
            key={slogan}
          >
            {slogan}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scrollUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            transform: translateY(0%);
            opacity: 1;
          }
          90% {
            transform: translateY(0%);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slowSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 1.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 2.5s ease-in;
        }

        .animate-slideIn {
          animation: slideIn 2s ease-out forwards;
        }

        .animate-scrollUp {
          animation: scrollUp 5s ease-in-out infinite;
        }

        .slow-spin {
          animation: slowSpin 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
