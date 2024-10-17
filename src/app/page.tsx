'use client';
import { useEffect, useState } from 'react';
import styles from './styles/styles.module.css';

export default function Home() {
  const [character, setCharacter] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      const date = new Date();
      const today = date.toDateString();
      const storedData = localStorage.getItem('characterData');
      if (storedData) {
        const { characterId, dateStored } = JSON.parse(storedData);
        if (dateStored === today) {
          const response = await fetch(`https://swapi.dev/api/people/${characterId}/`);
          const data = await response.json();
          setCharacter(data);
          return;
        }
      }
      const randomId = Math.floor(Math.random() * 82) + 1; 
      const response = await fetch(`https://swapi.dev/api/people/${randomId}/`);
      const data = await response.json();
      setCharacter(data);
      localStorage.setItem('characterData', JSON.stringify({ characterId: randomId, dateStored: today }));
    };
    fetchCharacter();
  }, []);

  const handleReveal = () => {
    setIsRevealed(true); 
  };

  if (!character) return <div className={styles.loading}>Loading...</div>;
  const getCharacterImage = (name) => {
    return `/images/characters/${name.toLowerCase().replace(' ', '_')}.png`;
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Star Wars - Character of the Day</h1>
      {!isRevealed && (
        <button className={styles.revealButton} onClick={handleReveal}>
          Reveal Character
        </button>
      )}
      {isRevealed && (
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img
              src={getCharacterImage(character.name)}
              alt={character.name}
              className={styles.characterImage}
              onError={(e) => (e.target.src = '/images/characters/placeholder.png')}
            />
          </div>
          <div className={styles.detailsContainer}>
            <h2 className={styles.characterName}>{character.name}</h2>
            <ul className={styles.characterDetails}>
              <li><strong>Height:</strong> {character.height} cm</li>
              <li><strong>Mass:</strong> {character.mass} kg</li>
              <li><strong>Hair Color:</strong> {character.hair_color}</li>
              <li><strong>Skin Color:</strong> {character.skin_color}</li>
              <li><strong>Eye Color:</strong> {character.eye_color}</li>
              <li><strong>Birth Year:</strong> {character.birth_year}</li>
              <li><strong>Gender:</strong> {character.gender}</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}