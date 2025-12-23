import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_permissions,
  get_staff_task_with_token,
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
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const StaffReportForm = () => {

  const initialData = {
    assigned_task:'',
    assigned_date:'',
    assigned_area:'',
    approx_shops:'',
    approx_offices:'',
    approx_hawkers:'',
    task_reporting_date:'',
    visits:'',
    joined:'',
    in_pipeline:'',
    total_leads:'',
    daily_leads:'',
    total_capture:'',
    daily_capture:'',
    lead_suggestions:'',
    lead_suggestions_after_confirmation:'',
    total_confirmation:'',
    Daily_confirmation:'',
    client_summary_type:'',
    client_summary_status:'',
    capture_summary_shop_no:'',
    client_summary_name:'',
    client_summary_phone:'',
    client_summary_email:'',
    client_summary_shop:'',
    client_summary_shop_domain:'',
    client_summary_location:'',
    client_summary_select:'',
  };
  const [formData, setFormData] = useState(initialData);

  const { token: task_token } = useParams();

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
  const [clientSummaryCount, setClientSummaryCount] = useState(1);


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
    if (task_token) {
      const fetchTaskDetails = async () => {
        try {
          setLoading(true);
          const selectedTask = (await get_staff_task_with_token(task_token))?.[0];
          console.log(selectedTask);

          if (selectedTask) {
            setFormData((prev) => ({
              ...prev,
              assigned_task: selectedTask?.assigned_task || "",
              assigned_date: selectedTask?.start_date && selectedTask?.end_date
                ? [
                  dayjs(selectedTask.start_date).toDate(),
                  dayjs(selectedTask.end_date).toDate()
                ]
                : []
                || "",

              assigned_area: (selectedTask?.assign_area?.map((a)=>a?.description)) || "",
              approx_shops: selectedTask?.approx_shops || "",
              approx_offices: selectedTask?.approx_offices || "",
              approx_hawkers: selectedTask?.approx_hawkers || "",
            }));
          }
        } catch (e) {
          console.log(e);
        }
        finally {
          setLoading(false);
        }
      }

      fetchTaskDetails();
    }
  }, [task_token]);

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

  const clientSummaryFields = Array.from(
  { length: clientSummaryCount },
  (_, i) => {
    const idx = i + 1;
    const typeValue = formData[`client_summary_type_${idx}`];

    return [
      {
      id: `summary_${idx}`,
      label: `Client Summary ${idx}`,
      btn: "Add",
    },
      {
        id: `type_${idx}`,
        label: "Type",
        name: `client_summary_type_${idx}`,
        type: "select",
        options: ["Client Summary", "Lead Summary", "Capture Summary"],
        cName: "w-30",
      },
      {
        id: `status_${idx}`,
        label: "Status",
        name: `client_summary_status_${idx}`,
        type: "select",
        options: ["Pending / Revisit", "Confirm"],
        cName: "w-30",
      },

      ...(typeValue === "Capture Summary"
        ? [{
            id: `shopno_${idx}`,
            label: "Shop No",
            name: `capture_summary_shop_no_${idx}`,
            type: "text",
            cName: "w-30",
          }]
        : []),

      {
        id: `name_${idx}`,
        label: "Name",
        name: `client_summary_name_${idx}`,
        type: "text",
        cName: "w-30",
      },
      {
        id: `phone_${idx}`,
        label: "Phone",
        name: `client_summary_phone_${idx}`,
        type: "phone_number",
        cName: "w-30",
      },
      {
        id: `email_${idx}`,
        label: "Email",
        name: `client_summary_email_${idx}`,
        type: "email",
        cName: "w-30",
      },
      {
        id: `shop_${idx}`,
        label: "Shop Name",
        name: `client_summary_shop_${idx}`,
        type: "text",
        cName: "w-30",
      },
      {
        id: `domain_${idx}`,
        label: "Shop Domain",
        name: `client_summary_shop_domain_${idx}`,
        type: "text",
        cName: "w-30",
      },
      {
        id: `sector_${idx}`,
        label: "Shop Sector",
        name: `client_summary_shop_sector_${idx}`,
        type: "text",
        cName: "w-30",
      },
      {
        id: `location_${idx}`,
        label: "Location",
        name: `client_summary_location_${idx}`,
        type: "address",
        cName: "w-30",
      },

      ...(typeValue === "Lead Summary"
        ? [{
            id: `lead_${idx}`,
            label: "Select",
            name: `lead_summary_select_${idx}`,
            type: "select",
            options: ["Appointment", "Walkin", "Form 1", "Pending / Revisit"],
            cName: "w-30",
          }]
        : []),
    ];
  }
).flat();

const handleAddField = () => {
  setClientSummaryCount((prev) => prev + 1);

  setFormData((prev) => ({
    ...prev,
    [`client_summary_type_${clientSummaryCount + 1}`]: "",
    [`client_summary_status_${clientSummaryCount + 1}`]: "",
    [`capture_summary_shop_no_${clientSummaryCount + 1}`]: "",
    [`client_summary_name_${clientSummaryCount + 1}`]: "",
    [`client_summary_phone_${clientSummaryCount + 1}`]: "",
    [`client_summary_email_${clientSummaryCount + 1}`]: "",
    [`client_summary_shop_${clientSummaryCount + 1}`]: "",
    [`client_summary_shop_domain_${clientSummaryCount + 1}`]: "",
    [`client_summary_shop_sector_${clientSummaryCount + 1}`]: "",
    [`client_summary_location_${clientSummaryCount + 1}`]: "",
    [`lead_summary_select_${clientSummaryCount + 1}`]: "",
  }));
};


  // FIELDS
  const formFields = [
    {
      id: 1,
      label: "Assigned Task",
      name: "assigned_task",
      type: "text",
      readOnly: true,
      cName:'w-45',
    },
    {
      id: 2,
      label: "Date",
      name: "assigned_date",
      type: "date-range",
      cName: 'flex-auto',
      readOnly: true,
    },
    {
      id: 2,
      label: "Assigned area",
      name: "assigned_area",
      type: "multi-select-checkbox",
      readOnly: true,
      cName:'w-100'
    },
    {
      id: 4,
      label: "Approx. Shops",
      name: "approx_shops",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 5,
      label: "Approx. Offices",
      name: "approx_offices",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 6,
      label: "Approx. hawkers or small huts",
      name: "approx_hawkers",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 30,
      label: "Date",
      name: "task_reporting_date",
      type: "date",
      cName: 'w-100',
    },
    {
      id: 7,
      label: "Total number of visits",
      name: "visits",
      type: "number",
      cName: 'w-30',
    },
    {
      id: 8,
      label: "Total number of joined",
      name: "joined",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 9,
      label: "Total number of clients in pipeline",
      name: "in_pipeline",
      type: "number",
      cName: 'w-30',
    },
    {
      id: 10,
      label: "Total Leads",
      name: "total_leads",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 11,
      label: "Daily Leads",
      name: "daily_leads",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 12,
      label: "Total Capture",
      name: "total_capture",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 13,
      label: "Daily Capture",
      name: "daily_capture",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 14,
      label: "Lead Suggestions",
      name: "lead_suggestions",
      type: "text",
      cName: 'w-45',
    },
    {
      id: 15,
      label: "Lead Suggestions after confirmation",
      name: "lead_suggestions_after_confirmation",
      type: "text",
      cName: "w-45",
    },
    {
      id: 16,
      label: "Total Confirmation",
      name: "total_confirmation",
      type: "text",
      cName: "w-45",
    },
    {
      id: 17,
      label: "Daily Confirmation",
      name: "Daily_confirmation",
      type: "text",
      cName: "w-45",
      readOnly: true,
    },
    

    ...clientSummaryFields,
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
          btn={field.btn}
          handleAddClick={handleAddField}
        />
      ))}
      <Box sx={{ width: '100%' }}>
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
