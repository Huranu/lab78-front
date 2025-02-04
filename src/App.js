import React, { useState, useRef, useEffect } from 'react';
import FruitList from './FruitList';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'fruitApp.fruits';

function App() {
  const [fruits, setFruits] = useState(() => {
    const storedFruits = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedFruits ? JSON.parse(storedFruits) : [];
  });

  const fruitNameRef = useRef();

  function toggleFruit(id) {
    const newFruits = [...fruits];
    const fruit = newFruits.find((fruit) => fruit.id === id);
    if (!fruit) return;
    fruit.complete = !fruit.complete;
    setFruits(newFruits);
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fruits));
  }, [fruits]);

  function handleAddFruits() {
    const name = fruitNameRef.current.value.trim();
    if (name === '') return;
    setFruits((prevFruits) => [
      ...prevFruits,
      { id: uuidv4(), name, complete: false },
    ]);
    fruitNameRef.current.value = null;
  }

  function handleClearFruits() {
    const newFruits = fruits.filter((fruit) => !fruit.complete);
    setFruits(newFruits);
  }

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.title}>Жимсний жагсаалт</h1>
      <FruitList fruits={fruits} toggleFruit={toggleFruit} />
      <div style={styles.inputContainer}>
        <input
          ref={fruitNameRef}
          type="text"
          placeholder="Жимсний нэр"
          style={styles.input}
        />
        <button onClick={handleAddFruits} style={styles.button}>
          Жагсаалт нэмэх
        </button>
      </div>
      <button onClick={handleClearFruits} style={styles.clearButton}>
        Арилгах
      </button>
      <div style={styles.counter}>
        {fruits.filter((fruit) => !fruit.complete).length}-ийг нэмсэн
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: '500px',
    margin: '50px 350px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  clearButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  counter: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#555',
  },
};

export default App;
