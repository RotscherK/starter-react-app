import React, { useState, useMemo } from 'react';
import { Row, Col, Card
} from 'react-bootstrap';
import MainTable from '../components/MainTable';
import TableDetailsCard from '../components/TableDetailsCard';
import { useTranslation } from 'react-i18next';

function Menu() {
  const { t } = useTranslation();

  // State to keep track of the selected menu and whether the menu table column is visible
  const [siteObjectList, setSiteObjectList] = useState([]);
  const [siteObject, setSiteObject] = useState(null);

  const siteConfig = useMemo(() => ({
    name: 'Menu',
    mainURL: '/menus/',
    subject: 'Zutaten',
    dataUrl: '/ingredients/'
    }), []); // Empty dependency array means it only calculates once

  const [formFields, setFormFields] = useState([
    { name: 'menu_id', type: 'hidden', required: true },
    { name: 'product_id', label: 'Select Product', type: 'select', required: true, fetchUrl: `/products`, options: [] },
    { name: 'quantity', placeholder: 'Menge', type: 'number', required: true  },
  ]);

  const columns = [
    { Header: 'ID', accessor: 'id', show: false },
    { Header: 'Menu ID', accessor: 'menu_id', show: false },
    { Header: 'Product ID', accessor: 'product_id', show: false },
    { Header: 'Product Name', accessor: 'product_name' },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Product Type', accessor: 'product_type_name' },
    { Header: 'Measure', accessor: 'measure' },
  ];

  // Function to handle menu item click
  const handleClick = (obj) => {
    setSiteObject(obj);
  };

  return (
    <div className="rk-body-fill-page rk-table-container">
        <Col xs={2}>
          <MainTable siteConfig={siteConfig} selectedSiteObject={siteObject} siteObjectList={siteObjectList} setSiteObjectList={setSiteObjectList} handleClick={handleClick} />
        </Col>
        {/* Right column for MenuDetails */}
        <Col>
          <div className="h-100 p-4">
            {siteObject ? (
              <div>
                <Row>
                <Col lg={9} md={12} sm={12}>
                    <Card style={{ width: '100%', marginBottom: '15px' }}>
                      <Card.Body>
                        <TableDetailsCard siteConfig={siteConfig} siteObject={siteObject} formFields={formFields} setFormFields={setFormFields} columns={columns} />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={3} md={12} sm={12}>
                    <Row>
                      <Col lg={12} md={6} sm={12}>
                        <Card style={{ width: '100%', marginBottom: '15px' }}>
                          <Card.Body>
                            Kosten
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={12} md={6} sm={12}>
                        <Card style={{ width: '100%', marginBottom: '15px' }}>
                          <Card.Body>
                            Vitamine
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={12} md={6} sm={12}>
                        <Card style={{ width: '100%', marginBottom: '15px' }}>
                          <Card.Body>
                            Rezept
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <h4>{t('app.product.hintChooseProduct')}</h4>
              </div>
            )}
          </div>
        </Col>
    </div>
  );
}

export default Menu;
