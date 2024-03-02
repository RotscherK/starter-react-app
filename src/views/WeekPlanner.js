import React, { useState, useEffect, useMemo } from 'react';
import { fetchData, postData } from '../services/APIService';
import { Container, Form, Row, InputGroup, Button, Col, Card, Modal, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MealPlanner() {
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [dateRangeFrom, setDateRangeFrom] = useState(new Date());
  //const [dateRangeTo, setDateRangeTo] = useState(null);
  const [currentMeal, setCurrentMeal] = useState({});
  const [currentDay, setCurrentDay] = useState({});
  const [menusWithPrice, setMenusWithPrice] = useState({});
  const [filteredMenus, setFilteredMenus] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const meals = useMemo(() => (
    ['breakfast', 'lunch', 'dinner']
  ), []);

  const formatDate = (date, code, options) => {
    if (!options) {
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    }
    return date.toLocaleDateString(code, options);
  };

  const getPlannedMealsForDate = (date, mealType) => {
    return plannedMeals.filter((meal) => {
      const mealDate = new Date(meal.date);
      return mealDate.toDateString() === date.toDateString() && meal.meal_type.toLowerCase() === mealType.toLowerCase();
    })[0];
  };

  // Fetch the planned meals when the component mounts
  useEffect(() => {
    const fetchPlannedMeals = async () => {
      try {
        const formattedDateRangeFrom = formatDate(new Date(), 'en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const formattedDateRangeTo = null;

        const data = await fetchData(`getPlannedMenusForUser/${formattedDateRangeFrom}/${formattedDateRangeTo}`)
        setPlannedMeals(data); // Assuming response.data is an array of planned meals
      } catch (error) {
        console.error('Error fetching planned meals:', error);
      }
    };

    fetchPlannedMeals();

    async function fetchDataFunc() {
      const fetchedData = await fetchData(`getMenusWithPrices`);
      setMenusWithPrice(fetchedData);
      setFilteredMenus(fetchedData);
    }
    fetchDataFunc();

  }, [showModal]);

  useMemo(() => {
    const days = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 6; i++) {
      const date = new Date(dateRangeFrom);
      date.setDate(date.getDate() + i);

      const day = {
        date: formatDate(date),
        datePlain: date,
        dayName: dayNames[date.getDay()],
        plannedMeals: { 
          'breakfast': getPlannedMealsForDate(date, 'breakfast') ,
          'lunch': getPlannedMealsForDate(date, 'lunch') ,
          'dinner': getPlannedMealsForDate(date, 'dinner') 
        }
      };

      days.push(day);
    }
    setDaysOfWeek(days);
  }, [plannedMeals, dateRangeFrom]);

  const handleDateChange = (date) => {
    setDateRangeFrom(date);
  };

  const handlePrevDay = () => {
    const newDate = new Date(dateRangeFrom);
    newDate.setDate(dateRangeFrom.getDate() - 1);
    console.log('newDate<=(new Date(), newDate<=(new Date()', newDate>(new Date()), newDate, (new Date()));
    if(newDate>(new Date())){
      setDateRangeFrom(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = new Date(dateRangeFrom);
    newDate.setDate(dateRangeFrom.getDate() + 1);
    setDateRangeFrom(newDate);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = menusWithPrice.filter(menu =>
      menu.menu_name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredMenus(filtered);
  };

  const handleMealSelection = (day, meal) => {
    setCurrentDay(day);
    setCurrentMeal(meal);
    handleShowModal();
  };

  const handleSelectMenu = (selectedMeal) => {
    const planned_menu = {
      date: currentDay.datePlain,
      meal_type: currentMeal,
      menu_id: selectedMeal.menu_id
    }
    postData('updateMenuOfPlannedMenu', planned_menu)
    setCurrentDay(null);
    setCurrentMeal(null);
    setShowModal(false);

  };

  const onPersonCountChange = (e, day, meal) => {
      console.log('select', e.target.value);
      const planned_menu = {
        date: day.datePlain,
        meal_type: meal,
        eating_members: e.target.value
      }
      postData('updatePeopleCountOfPlannedMenu', planned_menu)
  }

  return (
    <Container>
      <h2>Meal Planner</h2>
      <Row>
        <Form>
          <Form.Group>
            <InputGroup>
              <Button variant="primary" onClick={handlePrevDay}>
                -
              </Button>
              <Button variant="primary" onClick={handleNextDay}>
                +
              </Button>
              <DatePicker
                selected={dateRangeFrom}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                className="form-control"
              />

            </InputGroup>
          </Form.Group>
        </Form>
      </Row>
      <Row>
        <Col style={{ minWidth: '3%', maxWidth: '3%' }}>
          <div style={{ marginTop: "183px" }}>
            {meals.map((meal, index) => (
              <div key={index} style={{ height: "190px" }}>
                <div style={{ transform: 'rotate(-90deg)', textTransform:'capitalize' }}>

                  <h3>{meal}</h3>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <Row>

            {daysOfWeek.map((day, index) => (
              <Col key={`${index}`} xs={12} sm={6} md={4} lg={2}>
                <div className="mt-4">
                  <h3>{day.dayName}</h3>

                  {meals.map((mealType) => (
                    <Card key={`${day.day}-${mealType}`} className="mb-3 rk-menu-card" 
                      onClick={() => handleMealSelection(day, mealType)}
                      bg={day.plannedMeals[mealType] ? 'warning' : ''}>
                      
                      <Card.Body>
                        {/*Card.Title>{meal}</Card.Title> */}
                          <Card.Text>
                            {day.plannedMeals[mealType]? day.plannedMeals[mealType].menu_name:'Offen'} {day.plannedMeals[mealType]? day.plannedMeals[mealType].eating_members:''}
                            </Card.Text>
                        <div>
                        <Form.Select 
                          value={day.plannedMeals[mealType] && day.plannedMeals[mealType].eating_members ? day.plannedMeals[mealType].eating_members : ''}
                          onChange={(e) => onPersonCountChange(e, day, mealType)}>
                          <option>Anzahl Personen</option>
                          <option value="1">Ein</option>
                          <option value="2">Zwei</option>
                          <option value="3">Drei</option>
                          <option value="4">Vier</option>
                        </Form.Select>
                        </div>
                        {/*<div style={{ position: 'absolute', top: '0px', right: '10px' }}>
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
                            </div>*/}
                        <div className="mt-3">
                        <strong>Preis Mat:</strong> $XX.XX
                        <strong> Preis Total:</strong> $XX.XX
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
      <Row>
        <ul>

          {/*daysOfWeek.map((day, index) => (

            <li key={index}>
              {day.dayName} - {day.date}
              <ul>
                {day.plannedMeals.map((meal, mealIndex) => (
                  <li key={mealIndex}>
                    Meal: {meal.meal_type}, Menu: {meal.menuId}, Eating Members: {meal.eating_members}
                  </li>
                ))}
              </ul>
            </li>
                ))*/}

        </ul>
      </Row>
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
              <Button key={menu.id} className="m-3 btn btn-secondary" onClick={() => handleSelectMenu(menu)}>
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
    </Container >
  );
}

export default MealPlanner;
