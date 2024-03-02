import React, { useState } from 'react';
import { Container, Form, InputGroup, FormControl, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import { register } from '../services/AuthService';

const Register = ({isLoggedIn, setIsLoggedIn}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const navigate = useNavigate(); // Create history object

  const handleRegister = async () => {
    try {
      await register({ username, email, password });
      setFeedbackMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate.push('/login'); // Redirect to login page after 2 seconds
      }, 2000);
    } catch (error) {
      setFeedbackMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 56px)" }}>
      <Card className="p-4 bg-black shadow">
        <div className="text-center mb-4">
          <h2 className="text-white">Register</h2>
        </div>
        <Form className="rk-placeholder-white">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ color: "white" }}
              className="bg-dark text-white border-secondary"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </InputGroup>
          <Button variant="primary" onClick={handleRegister}>
            Let it happen!
          </Button>
        </Form>
        {feedbackMessage && (
          <div className="mt-3 text-center text-white">
            {feedbackMessage}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Register;
