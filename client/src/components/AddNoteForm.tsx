// AddNoteForm.js
import React, { useState } from 'react';
import './addNoteForm.css';

interface AddNoteFormProps {
  onAdd: (text: string, priority: number, category: string) => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(1); // Default priority
  const [category, setCategory] = useState('home'); // Default category

  const handleAddClick = () => {
    if (text.trim() !== '') {
      onAdd(text, priority, category);
      setText('');
      setPriority(1);
      setCategory('home');
    }
  };

  return (
    <div className='addNote'>
      <textarea
        className='addText'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <label>
          Priority:
          <input
            type="radio"
            value={1}
            checked={priority === 1}
            onChange={() => setPriority(1)}
          />
          1
        </label>
        <label>
          <input
            type="radio"
            value={2}
            checked={priority === 2}
            onChange={() => setPriority(2)}
          />
          2
        </label>
        <label>
          <input
            type="radio"
            value={3}
            checked={priority === 3}
            onChange={() => setPriority(3)}
          />
          3
        </label>
        <label>
          <input
            type="radio"
            value={4}
            checked={priority === 4}
            onChange={() => setPriority(4)}
          />
          4
        </label>
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="home">Home</option>
          <option value="stuff">Stuff</option>
          <option value="hobby">Hobby</option>
          <option value="fun">Fun</option>
        </select>
      </div>
      <button className='click' onClick={handleAddClick}>
        Add Note
      </button>
    </div>
  );
};

export default AddNoteForm;
