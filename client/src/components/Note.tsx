import React, { useState } from 'react';
import './Note.css';


interface NoteProps {
  id: number;

  text: string;
  priority: number;
  category: string;
  onEdit: (newText: string) => void;
  onDelete: Function;
  onEditCategoryPriority: (newCategory: string, newPriority: number) => void;
}

function Note({
  id,
  text,
  priority,
  category,
  onEdit,
  onDelete,
  onEditCategoryPriority,
}: NoteProps) {
  const [isEditing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedPriority, setEditedPriority] = useState(priority);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedText);
    onEditCategoryPriority(editedCategory, editedPriority);
    setEditing(false);
  };

  const getBackgroundColor = () => {
    switch (category) {
      case 'home':
        return 'lightblue';
      case 'hobby':
        return 'lightgreen';
      case 'work':
        return 'lightcoral';
      case 'fun':
        return 'lightpink';
      default:
        return 'lightgray';
    }
  };

  return (
    <div style={{ backgroundColor: getBackgroundColor() }} className={`Note priority-${priority}`}>
      {isEditing ? (
        <>
          <div className='noteText'>
            <div className='forEdit'>
              <textarea
                className='textare'
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={4}
              />
              <div className='pticat'>
                <div className='PRIORITY'>
                  <label>
                    Priority:
                    <input
                      type="radio"
                      value={1}
                      checked={editedPriority === 1}
                      onChange={() => setEditedPriority(1)}
                    />
                    1
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={2}
                      checked={editedPriority === 2}
                      onChange={() => setEditedPriority(2)}
                    />
                    2
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={3}
                      checked={editedPriority === 3}
                      onChange={() => setEditedPriority(3)}
                    />
                    3
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={4}
                      checked={editedPriority === 4}
                      onChange={() => setEditedPriority(4)}
                    />
                    4
                  </label></div>

                <div className='CATEGORY'>
                  <label>Category:</label>
                  <select
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                  >
                    <option value="home">Home</option>
                    <option value="stuff">Stuff</option>
                    <option value="hobby">Hobby</option>
                    <option value="fun">Fun</option>
                  </select>
                </div>
              </div></div>
            <button onClick={handleSaveClick} className='save'>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='noteED'>
            <div className='stuff'>

              <p className='text'>{text}</p>
              <div  className='priocaty'>
                <p>Priority: {priority}</p>
                <p>Category: {category}</p>
              </div>
            </div>
            <div className='ED'>
              <button onClick={handleEditClick} className='Edit'>
                Edit
              </button>
              <button onClick={() => onDelete(id)} className='Delete'>
                Delete
              </button>
            </div>
          </div>
        </>
      )
      }
    </div >
  );
}

export default Note;
