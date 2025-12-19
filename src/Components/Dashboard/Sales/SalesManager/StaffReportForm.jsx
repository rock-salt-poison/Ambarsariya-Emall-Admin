import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_permissions,
  get_staff_types,
  get_staff_with_type,
  get_userByToken,
  post_create_staff,
  post_create_staff_tasks,
  post_staff_email_otp,
  post_verify_staff_email_otp,
  send_otp_to_email,
} from "../../../../API/expressAPI";
import { useDispatch, useSelector } from "react-redux";
import { clearOtp, setEmailOtp } from "../../../../store/otpSlice";

const StaffReportForm = ({ selectedTask }) => {
  console.log(selectedTask);

  const initialData = {
    assigned_task: "",
    start_date: "",
    end_date: "",
    assign_area: "",
    approx_shops: "",
    approx_offices: "",
    approx_hawkers: "",
    assign_daily_task: "",
    daily_task_date: "",
    daily_location: "",

    shops_visited: "",
    offices_visited: "",
    hawkers_visited: "",
    task_reporting_date: "",
    visited_location: "",
    remarks: "",
    client_summary_type:'',
    client_summary_status:''
  };
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [staffTypes, setStaffTypes] = useState([]);
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    if (token && formData?.staff_type) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);
          console.log(formData.staff_type);

          const resp = await get_staff_with_type(token, formData.staff_type);
          console.log(resp);
          if (resp) {
            setStaffMembers(resp);
          }
        } catch (e) {
          console.log(e);
          setStaffMembers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }
  }, [token, formData?.staff_type]);

  useEffect(() => {
    if (selectedTask) {
      setFormData((prev) => ({
        ...prev,
        assigned_task: selectedTask?.assigned_task || "",
        start_date: selectedTask?.start_date || "",
        end_date: selectedTask?.end_date || "",
        assign_area: selectedTask?.assign_area || "",
        approx_shops: selectedTask?.approx_shops || "",
        approx_offices: selectedTask?.approx_offices || "",
        approx_hawkers: selectedTask?.approx_hawkers || "",
        assign_daily_task: selectedTask?.assign_daily_task || "",
        daily_task_date: selectedTask?.choose_date || "",
        daily_location: selectedTask?.daily_location || "",
      }));
    }
  }, [selectedTask]);

  useEffect(() => {
    if (!formData.staff_member) return;

    const selectedStaff = staffMembers.find(
      (s) => s.name === formData.staff_member
    );

    if (selectedStaff?.assign_area) {
      setFormData((prev) => ({
        ...prev,
        location: selectedStaff.assign_area, // full object
      }));
    }
  }, [formData.staff_member, staffMembers]);

  // Fetch user by token
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const resp = await get_userByToken(token);
          if (resp?.user) {
            console.log(resp?.user);
            setManager(resp.user);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Handle Input Change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset errors while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // VALIDATION FUNCTION
  const validateFields = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.staff_type) {
      newErrors.staff_type = "Staff Type is required";
      valid = false;
    }
    if (!formData.assign_area) {
      newErrors.assign_area = "Asisgn area is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch API data
  const fetchStaffTypes = async () => {
    try {
      setLoading(true);
      const resp = await get_staff_types();
      setStaffTypes(resp || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  console.log(errors);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateFields();
    if (!isValid) return;

    try {
      setLoading(true);

      const assigned_to = staffMembers.find(
        (s) => s.name === formData.staff_member
      )?.id;

      const assigned_by = manager?.id;

      const start_date = formData?.task_date[0];
      const end_date = formData?.task_date[1];

      const data = {
        assigned_task: formData?.assigned_task,
        start_date,
        end_date,
        assign_area: formData?.assign_area,
        approx_shops: formData?.approx_shops,
        approx_offices: formData?.approx_offices,
        approx_hawkers: formData?.approx_hawkers,
        assign_daily_task: formData?.assign_daily_task,
        choose_date: formData?.daily_task_date,
        daily_location: formData?.daily_location,
      };

      if (data) {
        const resp = await post_create_staff_tasks(data);
        if (resp?.success) {
          console.log(resp);
          setSnackbar({
            open: true,
            message: resp?.message,
            severity: "success",
          });
          setTimeout(() => {
            setFormData(initialData);
          }, 300);
        }
      }
    } catch (e) {
      console.log(e);

      setSnackbar({
        open: true,
        message: "Failed to assign the task",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // FIELDS
  const formFields = [
    {
      id: 1,
      label: "Select staff type",
      name: "staff_type",
      type: "select",
      options: staffTypes.map((s) => s.staff_type_name),
      cName: 'flex-auto',
    },
    {
      id: 2,
      label: "Select staff",
      name: "staff",
      type: "select",
      options:
      staffMembers.length > 0
      ? staffMembers.map((s) => s.name)
      : ["No staff members"],
      disable: staffMembers.length > 0 ? false : true,
      cName: 'flex-auto',
    },
    {
      id: 3,
      label: "Date",
      name: "assigned_date",
      type: "date-range",
    },
    {
      id: 4,
      label: "Total number of visits",
      name: "visits",
      type: "number",
      cName: 'flex-auto',
    },
    {
      id: 5,
      label: "Total number of joined",
      name: "joined",
      type: "number",
      cName: 'flex-auto',
      readOnly: true,
    },
    {
      id: 6,
      label: "Total number of clients in pipeline",
      name: "in_pipeline",
      type: "number",
      cName: 'flex-auto',
    },
    ...[{
      id: 7,
      label: "Total Leads",
      name: "total_leads",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 8,
      label: "Daily Leads",
      name: "daily_leads",
      type: "number",
      cName: 'w-45'
    },],
    {
      id: 9,
      label: "Total Capture",
      name: "total_capture",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 10,
      label: "Daily Capture",
      name: "daily_capture",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 11,
      label: "Lead Suggestions",
      name: "lead_suggestions",
      type: "text",
      cName: 'w-45',
    },
    {
      id: 12,
      label: "Lead Suggestions after confirmation",
      name: "lead_suggestions_after_confirmation",
      type: "text",
      cName: "w-45",
    },
    {
      id: 13,
      label: "Total Confirmation",
      name: "total_confirmation",
      type: "text",
      cName: "w-45",
    },
    {
      id: 14,
      label: "Daily Confirmation",
      name: "Daily_confirmation",
      type: "text",
      cName: "w-45",
      readOnly: true,
    },
    {
      id: 15,
      label: "Summary Type - Status",
    },

    {
      id: 16,
      label: "Type",
      name: "client_summary_type",
      type: "select",
      options: ['Client Summary', 'Lead Summary', 'Capture Summary'],
      cName: "w-30",
    },
    {
      id: 17,
      label: "Status",
      name: "client_summary_status",
      type: "select",
      options: ['Pending / Revisit', 'Confirm'],
      cName: "w-30",
    },
    ... formData?.client_summary_type === 'Capture Summary' ? [{
      id: 18,
      label: "Shop No",
      name: "shop_no",
      type: "text",
      cName: "w-30",
    },]: [],
    {
      id: 19,
      label: "Name",
      name: "client_summary_name",
      type: "text",
      cName: "w-30",
    },
    {
      id: 20,
      label: "Phone",
      name: "client_summary_phone",
      type: "phone_number",
      cName: "w-30",
    },
    {
      id: 21,
      label: "Email",
      name: "client_summary_email",
      type: "email",
      cName: "w-30",
    },
    {
      id: 22,
      label: "Shop Name",
      name: "client_summary_shop",
      type: "text",
      cName: "w-30",
    },
    {
      id: 23,
      label: "Shop Domain",
      name: "client_summary_shop_domain",
      type: "text",
      cName: "w-30",
    },
    {
      id: 24,
      label: "Shop Sector",
      name: "client_summary_shop_sector",
      type: "text",
      cName: "w-30",
    },
    {
      id: 25,
      label: "Location",
      name: "client_summary_location",
      type: "address",
      cName: "w-30",
    },
    ...formData?.client_summary_type === 'Lead Summary' ? [{
      id: 26,
      label: "Select",
      name: "client_summary_select",
      type: "select",
      options: ['Appointment', 'Walkin', 'Form 1', 'Pending / Revisit'],
      cName: "w-30",
    },]: []
  ];

  return (
    <Box component="form" className="form2" >
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}

      {formFields.map((field) => (
        <FormFields
          key={field.id}
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          type={field.type}
          options={field.options}
          onChange={handleOnChange}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
          optionalCname={field.cName}
          multiple={field.multiple}
          readOnly={field.readOnly}
          disable={field.disable}
        />
      ))}
      <Box sx={{width: '100%'}}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default StaffReportForm;
