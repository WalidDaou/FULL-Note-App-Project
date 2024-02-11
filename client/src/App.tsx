import React, { useState, useEffect } from 'react';
import { Redirect, Route, HashRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import RegisterForm from './components/Register';
import Login from './components/Login';
import AddNoteForm from './components/AddNoteForm';
import NotesList from './components/NotesList';

import './main.css';
import Welcome from './components/welcome';
import { useCommerceStore } from './store';

type Note = {
  id: number;
  text: string;
  priority: number;
  category: string;
  userId: string;
};

const App: React.FC = () => {
  const { token, decodedToken, setToken } = useCommerceStore()
  const [notes, setNotes] = useState<Note[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchNotes = async (id: number) => {
      try {
        const response = await fetch(`http://localhost:5000/note/unique?userId=${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

          },
        });

        if (!response.ok) {
          // Handle unauthorized or other error cases
          console.error('Error fetching notes:', response.statusText);
          return;
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    const userId = decodedToken?.userId
    fetchNotes(userId);
  }, [token, userId]);


  const handleDelete = async (id: number) => {
    // Make a DELETE request to the backend to delete the note
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },


      });
      if (response.ok) {
        // The request was successful, update the state with the remaining notes
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      } else {
        // The request was not successful, handle the error
        const errorData = await response.json(); // You can parse the error response if available
        console.error('Delete request failed:', errorData);
        // Handle the error, show a message to the user, etc.
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during delete request:', error);
      // Handle the error, show a message to the user, etc.
    }
  };

  const handleEdit = async (id: number, newText: string) => {
    // Make a PUT request to the backend to update the note
    const response = await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: newText }),
    });
    if (response.ok) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? { ...note, text: newText } : note))
      );

    } else {
      // The request was not successful, handle the error
      const errorData = await response.json(); // You can parse the error response if available
      console.error('edit request failed:', errorData);
      // Handle the error, show a message to the user, etc.
    }

    // Update the state with the edited note
  };


  const handleAdd = async (
    text: string,
    priority: number,
    category: string
  ): Promise<void> => {
    try {
      // Make a POST request to the backend to add a new note
      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({ text, priority, category, userId }),
      });

      const newNote = await response.json();

      // Update the state with the new note
      setNotes((prevNotes) => [...prevNotes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };
  const handleEditCategoryPriority = async (
    id: number,
    newCategory: string,
    newPriority: number
  ) => {
    // Make a PUT request to the backend to update the category and priority of the note
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ category: newCategory, priority: newPriority }),
    });

    // Update the state with the edited category and priority
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, category: newCategory, priority: newPriority }
          : note
      )
    );
  };




  const handelLogout = async () => {
    try {
      setToken(null);
      window.location.href = '#login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };




  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/Login" component={Login} />
        <Route path="/register" exact component={RegisterForm} />

        {token ? <Route path="/notes" exact>
          <div className="main">

            <NotesList
              onLogout={handelLogout}
              notes={notes}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onEditCategoryPriority={handleEditCategoryPriority}
            />
            <AddNoteForm onAdd={handleAdd} />
          </div>
        </Route> : <Redirect to="/login" />}
      </Switch>
    </Router>
  );
};

export default App;
