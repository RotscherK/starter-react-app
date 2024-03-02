import React, { useState, useMemo } from 'react';
import {
  Row, Col, Card
} from 'react-bootstrap';
import MainTable from '../components/MainTable';
import TableDetailsCard from '../components/TableDetailsCard';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

function Product() {
  const { t } = useTranslation();

  // State to keep track of the selected product and whether the product table column is visible
  const [siteObjectList, setSiteObjectList] = useState([]);
  const [siteObject, setSiteObject] = useState(null);
  const [siteObjectPrice, setSiteObjectPrice] = useState(null);

  const siteConfig = useMemo(() => ({
    name: 'Product',
    mainURL: '/products/',
    subject: 'Angebot',
    dataUrl: '/offers/'
  }), []); // Empty dependency array means it only calculates once

  const [formFields, setFormFields] = useState([
    { name: 'product_id', type: 'hidden'},
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'text' },
    { name: 'amount', label: 'Amount', type: 'text' },
    { name: 'url', label: 'URL', type: 'text' },
    { name: 'store_id', label: 'Select Store', type: 'select', required: true, fetchUrl: `/stores`, options: [] },
  ]);

  const columns = [
    { Header: 'ID', accessor: 'id', show: true },
    { Header: 'Product ID', accessor: 'product_id', show: false },
    { Header: 'Name', accessor: 'name', show: true },
    { Header: 'Brand', accessor: 'brand', show: true },
    { Header: 'Quantity', accessor: 'quantity', show: true },
    { Header: 'Amount', accessor: 'amount', show: true },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Currency', accessor: 'currency' },
    { Header: 'Discount', accessor: 'discount' , show: false},
    { Header: 'Discount Type', accessor: 'discount_type' , show: false},
    { Header: 'URL', accessor: 'url', show: true },
    { Header: 'Store ID', accessor: 'store_id', show: false },
    { Header: 'Store Name', accessor: 'store_name', show: true },
    { Header: 'Store Location', accessor: 'store_location', show: true },
  ];

  const siteConfigPrice = useMemo(() => ({
    name: 'Angebot',
    subject: 'Preis',
    dataUrl: '/prices/'
  }), []); // Empty dependency array means it only calculates once

  const [formFieldsPrice, setFormFieldsPrice] = useState([
    { name: 'offer_id', type: 'hidden' },
    { name: 'price', label: 'Price', type: 'text' },
    { name: 'currency', label: 'Currency', type: 'text' },
    { name: 'discount', label: 'Discount', type: 'text' },
    { name: 'discount_type', label: 'Discount Type', type: 'text' },
    { name: 'date', label: 'Date', type: 'date' },
  ]);
  
  const columnsPrice = [
    { Header: 'ID', accessor: 'id', show: false },
    { Header: 'Offer ID', accessor: 'offer_id', show: false },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Currency', accessor: 'currency' },
    { Header: 'Discount', accessor: 'discount' },
    { Header: 'Discount Type', accessor: 'discount_type' },
    { 
      Header: 'Date', 
      accessor: 'date',
      Cell: ({ value }) => {
        // Custom formatter function to format date
        const formattedDate = value ? format(new Date(value), 'dd.MM.yyyy') : '';
        return formattedDate;
      }, 
    },
  ];


  // Function to handle product item click
  const handleClick = (obj) => {
    setSiteObject(obj);
  };

  return (
    <div data-bs-theme="dark" className="rk-body-fill-page rk-table-container">
        <Col xs={2}>
          <MainTable siteConfig={siteConfig} selectedSiteObject={siteObject} siteObjectList={siteObjectList} setSiteObjectList={setSiteObjectList} handleClick={handleClick} />
        </Col>

        {/* Right column for ProductDetails */}
        <Col>
          <div className="h-100 p-4">
            {siteObject ? (
              <div>
                <Row>
                  <Col lg={9} md={12} sm={12}>
                    <Card style={{ width: '100%', marginBottom: '15px' }}>
                      <Card.Body>
                        <TableDetailsCard siteConfig={siteConfig} siteObject={siteObject} setSiteSubObject={setSiteObjectPrice} formFields={formFields}  setFormFields={setFormFields} columns={columns} />
                      </Card.Body>
                    </Card>

                    <Card style={{ width: '100%', marginBottom: '15px' }}>
                      <Card.Body>
                        <TableDetailsCard siteConfig={siteConfigPrice} siteObject={siteObjectPrice} formFields={formFieldsPrice} setFormFields={setFormFieldsPrice} columns={columnsPrice} />
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

export default Product;
