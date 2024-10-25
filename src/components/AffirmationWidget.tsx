import { useEffect, useState } from 'react';

const affirmations = [
  "I am capable of achieving great things",
  "Every day is a new opportunity",
  "I choose to be confident and self-assured",
  "I am worthy of love and respect",
  "I trust in my abilities",
];

export default function AffirmationWidget() {
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * affirmations.length);
      setAffirmation(affirmations[newIndex]);
    }, 60000); // Change every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h3 className="mb-2 text-sm font-medium text-white">Daily Affirmation</h3>
      <p className="text-lg font-medium italic text-white">{affirmation}</p>
    </div>
  );
}