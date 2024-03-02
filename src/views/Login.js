import React, { useState } from 'react';
import { Container, Form, InputGroup, FormControl, Button, Card } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import { login } from '../services/AuthService'
import { useNavigate, useLocation } from 'react-router-dom';


const LoginPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        try {
            await login({ username, password });
            setIsLoggedIn(true);

            // Redirect back to the original page if redirected from ProtectedRoute


            setFeedbackMessage('Login successful! Redirecting ...');
            setTimeout(() => {
                if (location.state && location.state.from) {
                    navigate(location.state.from);
                } else {
                    // If no redirected state, go to default page
                    navigate('/');
                }
            }, 2000);
        } catch (error) {
            setFeedbackMessage('Registration failed. Please try again.');
        }
    };

    return (

        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 56px)" }}>
            <Card className="p-4 bg-black shadow">
                <div className="text-center mb-4">
                    <h2 className="text-white">Login</h2>
                </div>
                <Form className="rk-placeholder-white">
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <Button variant="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </Form>
                {feedbackMessage && (
                    <div className="mt-3 text-center text-white">
                        {feedbackMessage}
                    </div>
                )}
                <div className="mt-3 text-center">
                    <RouterLink to="/register" className="text-white">
                        Register
                    </RouterLink>
                </div>
            </Card>
        </Container>
    );
};

export default LoginPage;
