import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, ListGroup, Badge} from 'react-bootstrap';
import { fetchData } from '../services/APIService';

function MainTable({ siteConfig, selectedSiteObject, siteObjectList, setSiteObjectList, handleClick }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [filteredSiteObjectList, setFilteredSiteObjectList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const listRef = useRef(null);
  const searchFieldRef = useRef(null);


  useEffect(() => {
    async function fetchDataFunc() {
      const fetchedData = await fetchData(`${siteConfig.mainURL}`);
      setSiteObjectList(fetchedData);
      setLoading(false);
    }
    fetchDataFunc();
  }, [siteConfig, setSiteObjectList]);

  useEffect(() => {
    setFilteredSiteObjectList(
      siteObjectList.filter((siteObject) =>
        siteObject.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [siteObjectList, filter]);

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
    setSelectedIndex(null); // Reset selected index when filtering
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!listRef.current) {
        setSelectedIndex(0);
      }
      const listItems = listRef.current.querySelectorAll('.list-group-item');

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === null || prevIndex === listItems.length - 1) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (prevIndex === null || prevIndex === 0) {
            return listItems.length - 1;
          } else {
            return prevIndex - 1;
          }
        });
      } else if (event.key === 'Enter' && selectedIndex !== null) {
        handleClick(filteredSiteObjectList[selectedIndex]);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, filteredSiteObjectList, handleClick]);

  useEffect(() => {
    if (selectedIndex !== null && listRef.current) {
      const listItems = listRef.current.querySelectorAll('.list-group-item');
      listItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.focus();
        } else {
          item.blur();
        }
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (searchFieldRef.current) {
      searchFieldRef.current.focus();
    }
  }, []);

  const onClick = (siteObject, index) => {
    handleClick(siteObject);
    setSelectedIndex(index); // Reset selected index when filtering
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"d-flex flex-column align-items-stretch flex-shrink-0"} >
      <div className={"d-flex align-items-center flex-shrink-0  link-dark text-decoration-none border-bottom pl-1 py-1"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Form.Control
          ref={searchFieldRef}
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilterChange}
          variant="dark"
          style={{ marginRight: '2px', height: "30px" }}
        />
        <div>
          <Button className="p-0" variant="success" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            +
          </Button>
        </div>
      </div>
      <div ref={listRef} className={`list-group list-group-flush border-bottom`} style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        {filteredSiteObjectList.map((siteObject, index) => (
          <ListGroup.Item
            key={index}
            className={`d-flex justify-content-between align-items-start ${selectedIndex === index ? 'active' : ''}`}
            onClick={() => onClick(siteObject, index)}
            role="button"
            >
            <div >{siteObject.name}</div>
            <Badge bg="primary" pill>
            {siteObject.id}
            </Badge>
          </ListGroup.Item>
        ))}
      </div>
    </div>
  );
}

export default MainTable;
