import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import FormFields from '../../Form/FormFields';
import { useNavigate } from 'react-router-dom';
import { post_travel_time } from '../../../API/expressAPI';

function Form({ page, fieldsData }) {
    const [category, setCategory] = useState(fieldsData[0]); // Default category
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const generateInitialData = (fields) => {
        const data = {};
        fields.forEach((field) => {
            if (field.fields && field.fields.length > 0) {

                field.fields.forEach((nestedField) => {
                    data[nestedField.name] = '';
                });

            } else {
                data[field.name] = field.value || '';
            }
        });
        return data;
    };

    const handleCategoryChange = (key) => {
        const fields = fieldsData[key] || [];
        setCategory(key);
        setFormData({
            ...generateInitialData(fields),
            dynamicShops: [],
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};

        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !Array.isArray(formData[field])) {
                formErrors[field] = `${field} is required`;
            }
        });

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {

            if(page.includes("arrival") || page.includes("departure")){
                const heading = page.split("_");

                const travel_type = (heading[0].slice(0,1)).toUpperCase()+(heading[0].slice(1));
                const mode = (heading[1].slice(0,1)).toUpperCase()+(heading[1].slice(1));
                const data = {
                    ...formData,
                    travel_type: travel_type,
                    mode: mode
                }
                const resp = await post_travel_time(formData);
            }

            console.log('Form Submitted', formData);
            setTimeout(() => navigate('../todo'), 1000);
        }
    };
   

    useEffect(() => {
        handleCategoryChange(page);
    }, [page]);

    const fields = fieldsData[category] || [];

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} className='form2'>
            {fields.map((field) => (
                <React.Fragment key={field.id}>
                    <FormFields
                        label={field.label}
                        name={field.name}
                        value={field.value ? field.value : formData[field.name]}
                        type={field.type}
                        options={field.options}
                        error={!!errors[field.name]}
                        onChange={handleChange}
                        helperText={errors[field.name]}
                        optionalCname={field.cName}
                    />
                    {field.fields && (
                        <Box className="form-group">
                            {field.fields.length > 0 && field.fields.map((nestedField) => (
                                <FormFields
                                    key={nestedField.id}
                                    label={nestedField.label}
                                    name={nestedField.name}
                                    value={nestedField.value ? nestedField.value : formData[nestedField.name]}
                                    type={nestedField.type}
                                    options={nestedField.options}
                                    error={!!errors[nestedField.name]}
                                    onChange={handleChange}
                                    helperText={errors[nestedField.name]}
                                />
                            ))}
                        </Box>
                    )}
                </React.Fragment>
            ))}

            {fields.length>0 && <Button type="submit" variant="contained" className='btn_submit'>
                Save
            </Button>}
        </Box>
    );
}

export default Form;
