import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { fetchData,postData } from '../services/APIService';

const UserSettings = () => {
  // Initial form state with sample data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    async function fetchDataFunc() {
      try {
        const fetchedData = await fetchData('/settings');
        setFormData(fetchedData);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    }
    fetchDataFunc();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await postData('/settings', formData);
      console.log('User data updated:', updatedData);
      // Optionally, you can show a success message or handle other actions
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error, show error message, etc.
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container className="rk-body-fill-page">
      <h2 className="mt-4">Settings</h2>
      <Form className="mt-4" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default UserSettings;
