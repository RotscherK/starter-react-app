import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import FamilyMemberIndicator from '../components/FamilyMemberIndicator'; // Import the custom component

function MealPlanner() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  // Default family members
  const defaultFamilyMembers = [
    { name: 'Salome', selected: true },
    { name: 'Roger', selected: true },
    { name: 'Emily', selected: true },
    { name: 'Sanna', selected: true }
  ];

  const [selectedMeals, setSelectedMeals] = useState({});
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState({});

  const handleMealSelection = (day, meal) => {
    setSelectedMeals((prevSelected) => ({
      ...prevSelected,
      [day]: {
        ...prevSelected[day],
        [meal]: !prevSelected[day]?.[meal] // Toggle selection
      }
    }));
  };

  const toggleFamilyMember = (day, meal, memberIndex) => {
    setSelectedFamilyMembers((prevSelected) => {
      const isSelected = prevSelected[day]?.[meal]?.[memberIndex]?.selected;
      if (isSelected === undefined) return prevSelected; // No need to toggle if undefined
      const updatedSelection = {
        ...prevSelected,
        [day]: {
          ...prevSelected[day],
          [meal]: prevSelected[day]?.[meal].map((member, index) => {
            if (index === memberIndex) {
              return {
                ...member,
                selected: !member.selected // Toggle selection
              };
            }
            return member;
          })
        }
      };
      return updatedSelection;
    });
  };

  const initializeDefaultFamilyMembers = () => {
    const defaultSelections = {};
    daysOfWeek.forEach((day) => {
      defaultSelections[day] = {};
      meals.forEach((meal) => {
        defaultSelections[day][meal] = [...defaultFamilyMembers];
      });
    });
    setSelectedFamilyMembers(defaultSelections);
  };

  // Set default family members for each day and meal on component mount
  useEffect(() => {
    initializeDefaultFamilyMembers();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="container">
      <h1 className="mt-4">Meal Planner</h1>
      <Row>
        {daysOfWeek.map((day) => (
          <Col key={day} xs={12} sm={6} md={4} lg={3}>
            <div className="mt-4">
              <h3>{day}</h3>
              {meals.map((meal) => (
                <Card key={`${day}-${meal}`} className="mb-3">
                  <Card.Body>
                    <Card.Title>{meal}</Card.Title>
                    <Card.Text>
                      Meal Description
                    </Card.Text>
                    <div>
                      <Button
                        variant={selectedMeals[day]?.[meal] ? 'success' : 'outline-success'}
                        onClick={() => handleMealSelection(day, meal)}
                      >
                        Select Meal
                      </Button>
                    </div>
                    <div className="" style={{ position: 'absolute', top: '0px', right: '10px' }}>
                      {selectedFamilyMembers[day]?.[meal] &&
                        selectedFamilyMembers[day][meal].map((member, index) => (
                          <div key={index} className="mt-2">
                            <FamilyMemberIndicator
                              member={member.name}
                              onClick={() => toggleFamilyMember(day, meal, index)}
                              selected={member.selected}
                            />
                          </div>
                        ))}
                    </div>
                    <div className="mt-3">
                      <strong>Price:</strong> $XX.XX
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MealPlanner;
