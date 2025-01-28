import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DashboardTable from "../DashboardTable";
import DialogPopup from "../DialogPopup";
import { useNavigate } from "react-router-dom";
import BoxHeader from "../DashboardContent/BoxHeader";

function DashboardMainContent() {
    const [open, setOpen] = useState(false);

    const initialData = {
        department: "",
        position: "",
        rights: "",
        name: "",
        phone_no: "",
        email: "",
        username: "",
        password: "",
        confirm_password: "",
    };

    const formFields = [
        {
            id: 1,
            label: "Select Department",
            name: "department",
            type: "select",
            options: ['Admin', 'Sales Manager', 'IT Manager', 'Marketing Manager', 'Designers', 'Accounts', 'Finance', 'Log Activity']
        },
        {
            id: 2,
            label: "Enter name of role",
            name: "position",
            type: "text",
        },
        {
            id: 3,
            label: "Rights",
            name: "rights",
            type: "select",
            options: ['Create', 'Read', 'Update', 'Delete']
        },
        {
            id: 4,
            label: "Enter name",
            name: "name",
            type: "text",
        },
        {
            id: 5,
            label: "Enter phone no.",
            name: "phone_no",
            type: "text",
        },
        {
            id: 6,
            label: "Enter email id",
            name: "email",
            type: "email",
        },
        {
            id: 7,
            label: "Enter username",
            name: "position",
            type: "text",
        },
        {
            id: 8,
            label: "Enter Password",
            name: "password",
            type: "password",
        },
        {
            id: 9,
            label: "Confirm Password",
            name: "confirm_password",
            type: "password",
        },
    ];

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({}); // State to track errors
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation (example)
        let formErrors = {};

        Object.keys(formData).forEach((field)=>{
            if(!formData[field]){
                formErrors[field] = `${field} is required`;
            }
        })

        setErrors(formErrors);

        // If no errors, submit form
        if (Object.keys(formErrors).length === 0) {
            console.log('Form Submitted', formData);
            setTimeout(() => { navigate('../') }, 1000)
        }
    };

    return (
        <Box className="body">
            <Box className="cta-button">
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="btn_submit"
                >
                
                    Create Role
                </Button>
            </Box>
            <Box className="content">
                <BoxHeader title="Employees" searchField={true}/>
                <DashboardTable />
            </Box>

            <DialogPopup
                open={open}
                handleClose={() => setOpen(false)}
                fields={formFields}
                formData={formData}
                handleOnChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
            />
        </Box>
    );
}

export default DashboardMainContent;
