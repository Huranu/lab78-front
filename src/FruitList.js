import React from 'react';
import Fruit from './Fruit';

export default function FruitList({ fruits, toggleFruit }) {
  return (
    <div style={styles.listContainer}>
      {fruits.map((fruit) => (
        <Fruit key={fruit.id} toggleFruit={toggleFruit} fruit={fruit} />
      ))}
    </div>
  );
}

const styles = {
  listContainer: {
    marginTop: '20px',
  },
};
