import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Button, Row, Col, Modal, Form, FormControl } from 'react-bootstrap';
import FamilyMemberIndicator from '../components/FamilyMemberIndicator'; // Import the custom component
import { fetchData } from '../services/APIService';

function MealPlanner() {
  const daysOfWeek = useMemo(() => (
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  ), []);
  const meals = useMemo(() => (
    ['Breakfast', 'Lunch', 'Dinner']
  ), []);

  const defaultFamilyMembers = useMemo(() => (
    [
      { name: 'Salome', selected: true },
      { name: 'Roger', selected: true },
      { name: 'Emily', selected: true },
      { name: 'Sanna', selected: true }
    ]
  ), []);


  const [selectedMeals, setSelectedMeals] = useState({});
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [menusWithPrice, setMenusWithPrice] = useState({});

  const handleMealSelection = (day, meal) => {
    handleShowModal();
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

  const initializeDefaultFamilyMembers = useCallback(() => {
    const defaultSelections = {};
    daysOfWeek.forEach((day) => {
      defaultSelections[day] = {};
      meals.forEach((meal) => {
        defaultSelections[day][meal] = [...defaultFamilyMembers];
      });
    });
    setSelectedFamilyMembers(defaultSelections);
  }, [daysOfWeek, meals, defaultFamilyMembers]);

  // Set default family members for each day and meal on component mount
  useEffect(() => {
    initializeDefaultFamilyMembers();

    async function fetchDataFunc() {
      const fetchedData = await fetchData(`getMenusWithPrices`);
      setMenusWithPrice(fetchedData);
      setFilteredMenus(fetchedData);
    }
    fetchDataFunc();

  }, [initializeDefaultFamilyMembers]); // Empty dependency array to run only once on mount

  // Calculate total price and number of articles
  const totalPrice = 0; // Calculate your total price
  const totalArticles = 0; // Calculate your total articles

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = menusWithPrice.filter(menu =>
      menu.menu_name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredMenus(filtered);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Meal Planner</h1>
        <div>
          <div>
            <strong>Totale Kosten:</strong> CHF {totalPrice.toFixed(2)}
          </div>
          <div>
            <strong>Total Artikel zu Kaufen:</strong> {totalArticles}
          </div>
        </div>
      </div>

      <Row>
        <Col style={{ minWidth: '3%', maxWidth: '3%' }}>
          <div style={{ marginTop: "183px" }}>
            {meals.map((meal, index) => (
              <div key={index} style={{ height: "160px" }}>
                <div style={{ transform: 'rotate(-90deg)' }}>

                  <h3>{meal}</h3>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <Row>
            {daysOfWeek.map((day) => (
              <Col key={day} xs={12} sm={6} md={4} lg={2}>
                <div className="mt-4">
                  <h3>{day}</h3>
                  {meals.map((meal) => (
                    <Card key={`${day}-${meal}`} className="mb-3">
                      <Card.Body>
                        {/*Card.Title>{meal}</Card.Title> */}
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
                        <div style={{ position: 'absolute', top: '0px', right: '10px' }}>
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
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-3">
        <div className="mr-3">
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </div>
        <div>
          <strong>Total Articles:</strong> {totalArticles}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form>
          <div className="mt-3">
            {filteredMenus.map((menu) => (
              <Button key={menu.id} className="mb-3 btn btn-secondary">
                <h5>{menu.menu_name} ({menu.total_price})</h5>
                {/* Add more details of the menu */}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MealPlanner;
