import { useState, useEffect } from "react";

const messages = [
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
  "✅ Success! You've played your part in democracy!",
  "✅ Thank you for participating in the election!",
  "✅ Your choice matters! Vote recorded!",
  "✅ Vote cast! Thank you for being a responsible citizen!",
  "✅ You did it! Thanks for casting your vote!",
  "✅ Your vote is in! Thank you for supporting democracy!",
  "✅ Voting complete! Your contribution is valuable!",
  "✅ Mission accomplished! Your vote is secured!",
  "✅ Your vote, your right! Thanks for exercising it!",
  "✅ Great work! Your vote is now part of history!",
  "✅ Election process complete! Thank you for voting!",
];

export default function ThankYouPage() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Indian Flag Background */}
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 bg-[#FF9933]" /> {/* Saffron */}
        <div className="flex-1 bg-white" /> {/* White */}
        <div className="flex-1 bg-[#138808]" /> {/* Green */}
      </div>

      {/* Ashoka Chakra */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 md:w-64 md:h-64 relative animate-spin-slow">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-1/2 bg-[#000080] origin-bottom"
              style={{
                transform: `rotate(${i * 15}deg)`,
                left: "calc(50% - 1px)",
              }}
            />
          ))}
          <div className="absolute inset-0 border-4 border-[#000080] rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="p-6 md:p-8 rounded-lg max-w-2xl mx-auto text-black">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">THANK YOU FOR VOTING! 🎉</h1>

          <p className="text-lg md:text-xl font-medium italic mb-6">
            &quot;The ballot is stronger than the bullet.&quot; - Abraham Lincoln
          </p>

          <p className="text-lg md:text-xl font-medium transition-all duration-500 ease-in-out">
            {messages[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
