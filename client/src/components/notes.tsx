import React from 'react';

const DeleteAccountButton: React.FC = () => {
  const handleDeleteAccount = async () => {
    try {
      // Perform any additional logic before deleting the account (e.g., displaying a confirmation modal)
      const confirmDeletion = window.confirm('Are you sure you want to delete your account?');

      if (confirmDeletion) {
        // Call your API or service to delete the account
        const response = await fetch('http://localhost:5000/api/Logout', {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add your authentication token if needed
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Clear local storage or perform any additional cleanup
          localStorage.removeItem('token');

          // Redirect to the login page or any other desired page after successful deletion
          window.location.href = '/Login';
        } else {
          // Handle error response from the server
          console.error('Account deletion failed:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  };

  return (
    <button onClick={handleDeleteAccount}>
      Delete Account
    </button>
  );
};

export default DeleteAccountButton;
