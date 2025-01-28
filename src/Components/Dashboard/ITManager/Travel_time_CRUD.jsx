import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import FormFields from '../../Form/FormFields';
import { useNavigate } from 'react-router-dom';
import { get_travel_time, post_travel_time } from '../../../API/expressAPI';
import CustomSnackbar from '../../CustomSnackbar';

function TravelTimeCRUD({ page, fieldsData }) {
    const [category, setCategory] = useState(fieldsData[0]); // Default category
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    let heading;
    let mode;
    let travel_type;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const initialFormData = {
        location: "Amritsar",
        date: '',
        time_from: '',
        time_to: '',
        from_1: '',
        from_2: '',
        from_3: '',
        from_4: '',
        from_5: '',
        to_1: '',
        to_2: '',
        to_3: '',
        to_4: '',
        to_5: '',
        time_1: '',
        time_2: '',
        time_3: '',
        time_4: '',
        time_5: '',
        arrived_time_1:'',
        arrived_time_2:'',
        arrived_time_3:'',
        arrived_time_4:'',
        arrived_time_5:'',
        departed_time_1:'',
        departed_time_2:'',
        departed_time_3:'',
        departed_time_4:'',
        departed_time_5:'',
    };

    // Fetch data from the API based on mode and travel_type
    const fetchData = async (data) => {
        try {
            const resp = await get_travel_time(data);
            return resp?.message === 'Valid' ? resp.data : null;
        } catch (error) {
            return null;
        }
    };

    const handleCategoryChange = (key) => {
        const fields = fieldsData[key] || [];
        setCategory(key);
        setFormData({ ...initialFormData });
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
        const formErrors = {};

        Object.keys(formData).forEach((field) => {
            if (!formData[field] && !Array.isArray(formData[field])) {
                formErrors[field] = `${field} is required`;
            }
        });

        if (!formData['date']) formErrors['date'] = 'Date is required';
        if (!formData['time_from']) formErrors['time_from'] = 'Time From is required';
        if (!formData['time_to']) formErrors['time_to'] = 'Time To is required';

        setErrors(formErrors);

        // if (Object.keys(formErrors).length === 0) {
            heading = page.split("_");
            mode = heading[0].charAt(0).toUpperCase() + heading[0].slice(1);
            travel_type = heading[1].charAt(0).toUpperCase() + heading[1].slice(1);
            const data = { ...formData, travel_type, mode };

            try {
                const resp = await post_travel_time(data);
                setSnackbar({
                    open: true,
                    message: resp ? "Details stored successfully." : "Failed to store details.",
                    severity: resp ? "success" : "error",
                });
            } catch {
                setSnackbar({ open: true, message: "Failed to store details.", severity: "error" });
            }
        // }
    };

    useEffect(() => {
        handleCategoryChange(page);
        if (page.includes("arrival") || page.includes("departure")) {
            heading = page.split("_");
            mode = heading[0].charAt(0).toUpperCase() + heading[0].slice(1);
            travel_type = heading[1].charAt(0).toUpperCase() + heading[1].slice(1);

            fetchData({ mode, travel_type }).then((resp) => {

                setFormData( { 
                    location: resp?.[0].location || 'Amritsar',
                date: resp?.[0].date || '',
                time_from: resp?.[0].time_from || '',
                time_to: resp?.[0].time_to || '',
                from_1: resp?.[0].travel_from || '',
                from_2: resp?.[1].travel_from || '',
                from_3: resp?.[2].travel_from || '',
                from_4: resp?.[3].travel_from || '',
                from_5: resp?.[4].travel_from || '',
                to_1: resp?.[0].travel_to || '',
                to_2: resp?.[1].travel_to || '',
                to_3: resp?.[2].travel_to || '',
                to_4: resp?.[3].travel_to || '',
                to_5: resp?.[4].travel_to || '',
                time_1: resp?.[0].departure_time?resp?.[0].departure_time: resp?.[0].arrival_time,
                time_2: resp?.[1].departure_time?resp?.[1].departure_time: resp?.[1].arrival_time,
                time_3: resp?.[2].departure_time?resp?.[2].departure_time: resp?.[2].arrival_time,
                time_4: resp?.[3].departure_time?resp?.[3].departure_time: resp?.[3].arrival_time,
                time_5: resp?.[4].departure_time?resp?.[4].departure_time: resp?.[4].arrival_time,

                arrived_time_1: resp?.[0]?.arrived_at || "",
                arrived_time_2: resp?.[1]?.arrived_at || "",
                arrived_time_3: resp?.[2]?.arrived_at || "",
                arrived_time_4: resp?.[3]?.arrived_at || "",
                arrived_time_5: resp?.[4]?.arrived_at || "",
                departed_time_1: resp?.[0]?.departed_at || "",
                departed_time_2: resp?.[1]?.departed_at || "",
                departed_time_3: resp?.[2]?.departed_at || "",
                departed_time_4: resp?.[3]?.departed_at || "",
                departed_time_5: resp?.[4]?.departed_at || "",

                 } );
            });
        } else {
            setFormData(initialFormData);
        }
    }, [page, category]);

    const fields = fieldsData[category] || [];

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} className='form2'>
            {fields.map((field) => (
                <React.Fragment key={field.id}>
                    <FormFields
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ''}
                        type={field.type}
                        options={field.options}
                        error={!!errors[field.name]}
                        onChange={handleChange}
                        helperText={errors[field.name]}
                        optionalCname={field.cName}
                    />
                    {field.fields && (
                        <Box className="form-group">
                            {field.fields.map((nestedField) => (
                                <FormFields
                                    key={nestedField.id}
                                    label={nestedField.label}
                                    name={nestedField.name}
                                    value={formData[nestedField.name] || ''}
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

            {fields.length > 0 && (
                <Button type="submit" variant="contained" className='btn_submit'>
                    Save
                </Button>
            )}

            <CustomSnackbar
                open={snackbar.open}
                handleClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box>
    );
}

export default TravelTimeCRUD;
