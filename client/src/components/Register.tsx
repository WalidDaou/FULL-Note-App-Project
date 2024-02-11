import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

interface RegisterFormProps {
    name: string;
    password: string;
    email: string;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const requestBody = {
            name,
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // Registration successful, handle the redirect here
                window.location.href = '#Login';
                
            } else {

                const content = await response.json();

                // Check if the user already exists
                if (content.error && content.error.includes('user already exist')) {
                    setShowMessage(true);
                    setErrorMessage('User already exists');
                    console.log('user already exist')
                } else {
                    setShowMessage(false);
                    setErrorMessage(`Failed to register: ${response.statusText}. ${JSON.stringify(content)}`);

                }

                throw new Error(errorMessage);
            }

            const content = await response.json();
            console.log(content);

            // Update the state variable for all users
            //@ts-ignore
            setAllUsers([...allUsers, content]);
        } catch (error: any) {
            console.error('Error during fetch:', error.message);
            setErrorMessage('Network error. Please try again.');
        }
 
    };

    return (
        <>
            <form action="">
                <div className='RegisterForm'>
                    <div className='RegisterForme'>
                        <span className="flex">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} value={name} />
                        </span>

                        <span className="flex">
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                        </span>
                        {showMessage && <div className='errorMessage'>{errorMessage}</div>}
                        <span className="flex">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </span>
                    </div>
                    <Link to='/Login' className='linkReg'>Already have an account?</Link>
                    <button onClick={handleLogin} type="button">Register</button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;
