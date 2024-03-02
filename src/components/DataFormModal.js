import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function DataFormModal({
  show, onClose, onSubmit, formFields, initialData, modalName,
}) {
  const [formData, setFormData] = useState(initialData || {});
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleInputChange = (e, field) => {
    const { value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [field]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are set
    const requiredFields = formFields.filter((field) => field.required);

    const missing = requiredFields.filter((field) => !formData[field.name]);
    if (missing.length > 0) {
      // Set the missing fields to display error messages
      setMissingFields(missing.map((field) => field.label));
    } else {
      // All required fields are set, proceed with form submission
      onSubmit(formData);
    }
  };

  const countProperties = (initialData) => {
    if (initialData === null || initialData === undefined) {
      return 0; // Return 0 if initialData is null or undefined
    }
    
    // Use Object.keys to count properties if initialData is an object
    return Object.keys(initialData).length;
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalName + (countProperties(initialData)>1 ? ' hinzufügen' : ' bearbeiten')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {formFields.map((field, index) => {
            return (
              <Form.Group key={index}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === 'select' ? (
                  <Form.Control
                    as="select"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(e, field.name)}
                    {...(field.required ? { required: true } : {})}
                  >
                    {/* Add default empty option */}
                    <option value="" disabled={!formData[field.name]} hidden={!formData[field.name]}>
                      {field.placeholder || field.label}
                    </option>
                    {/* Map through options */}
                    {field.options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                ) : field.type === 'checkbox' ? (
                  <Form.Check
                    type="checkbox"
                    label={field.label}
                    checked={formData[field.name] || false}
                    onChange={(e) => handleInputChange(e, field.name)}
                  />
                ) : field.type === 'date' ? (
                  <Form.Control
                    type="date"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(e, field.name)}
                    placeholder={field.placeholder || field.label}
                    {...(field.required ? { required: true } : {})}
                  />
                ) : (
                  <Form.Control
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(e, field.name)}
                    placeholder={field.placeholder || field.label}
                    {...(field.required ? { required: true } : {})}
                  />
                )}
                {missingFields.includes(field.label) && (
                  <Form.Text className="text-danger">Please fill in {field.label}</Form.Text>
                )}
              </Form.Group>
            );
          })}
          <Button className="mt-3" variant="primary" type="submit">
            {countProperties(initialData)>1 ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DataFormModal;
