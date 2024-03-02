import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './DataTable';
import DataFormModal from './DataFormModal';
import { fetchData, fetchOptions, postData } from '../services/APIService';


function TableDetailsCard({
    siteConfig,
    siteObject,
    setSiteSubObject,
    setFormFields,
    formFields,
    columns,
}) {
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchDatatableData = useCallback(async () => {
        if (siteObject) {
            const fetchedData = await fetchData(`${siteConfig.dataUrl}${siteObject.id}`);
            setData(fetchedData);
        }
    }, [siteObject, siteConfig]);

    const fetchFieldOptions = useCallback(async () => {
        const fieldsWithOptions = formFields.filter((field) => field.fetchUrl && field.fetchUrl.trim() !== '');

        for (const field of fieldsWithOptions) {
            const options = await fetchOptions(field.fetchUrl);
            setFormFields((prevFields) =>
                prevFields.map((f) => (f.name === field.name ? { ...f, options } : f))
            );
        }
    }, [formFields, setFormFields]);

    const handleOpenModal = useCallback(async () => {
        setShowModal(true);
    }, []);

    const onRowDoubleClick = useCallback((rowData) => {

        fetchFieldOptions();

        if (!rowData) {
            // If rowData is empty, create an array with one object
            const defaultRowData = {
                [formFields.length > 0 ? formFields[0].name : '']: siteObject.id,
            };

            setEditData(defaultRowData);
        } else {
            setEditData(rowData);
        }

        handleOpenModal();
    }, [fetchFieldOptions, setEditData, formFields, siteObject, handleOpenModal]);

    const onRowClick = useCallback((rowData) => {
        if (setSiteSubObject) {
            setSiteSubObject(rowData);
        }

    }, [setSiteSubObject]);


    const handleAddRow = () => {
        onRowDoubleClick();
    };

    useEffect(() => {
        if (siteObject) {
            fetchDatatableData();

            const handleKeyDown = (event) => {
                const isInputField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
                if (isInputField) {
                    return;
                }
                // Check if "H" key is pressed and no modal is open
                if (event.key === 'h' && !showModal) {
                    onRowDoubleClick()
                }
            };

            // Add event listener when component mounts
            document.addEventListener('keydown', handleKeyDown);

            // Clean up event listener when component unmounts
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [siteObject, showModal, fetchDatatableData, onRowDoubleClick]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData(null);
    };

    const onSubmit = async (formData) => {
        console.log('Form submitted with data:', formData);

        postData(siteConfig.dataUrl, formData);
        handleCloseModal();
    };

    return (

        <div>
            <Card.Title>{siteObject ? `${siteConfig.subject} ${siteObject.name}` : `Bitte wähle ${siteConfig.name} aus`}</Card.Title>
            <Card.Text>{siteObject ? siteObject.description : ''}</Card.Text>

            <DataFormModal
                show={showModal}
                onClose={handleCloseModal}
                onSubmit={onSubmit}
                formFields={formFields}
                initialData={editData}
                modalName="Zutat"
            />
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleAddRow}>
                    +
                </Button>
            </div>
            <DataTable columns={columns} data={data} setData={setData} onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick} />
        </div>
    );
};

export default TableDetailsCard;
