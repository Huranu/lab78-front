import React from 'react';

export default function Fruit({ fruit, toggleFruit }) {
  function handleFruitClick() {
    toggleFruit(fruit.id);
  }

  return (
    <div style={styles.fruitItem}>
      <label style={styles.label}>
        <input
          type="checkbox"
          checked={fruit.complete}
          onChange={handleFruitClick}
          style={styles.checkbox}
        />
        <span >
          {fruit.name}
        </span>
      </label>
    </div>
  );
}

const styles = {
  fruitItem: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkbox: {
    transform: 'scale(1.2)',
  },
};
