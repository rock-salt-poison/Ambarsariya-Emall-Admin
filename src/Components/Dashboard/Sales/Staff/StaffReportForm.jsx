import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_staff_task_with_token,
  post_task_report_details,
} from "../../../../API/expressAPI";
import { useDispatch, useSelector } from "react-redux";
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
  };
  const [formData, setFormData] = useState(initialData);

  const createEmptyStage = (type) => ({
  type,
  status: "",
  data: {
    name: "",
    phone: "",
    email: "",
    shop: "",
    domain: "",
    sector: "",
    location: "",
    lead_select: "",
    shop_no: "",
  },
});

const createClientSummaryGroup = (id) => ({
  id,
  stages: [createEmptyStage("Client Summary")],
});

  const { token: task_token } = useParams();

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [currentTask, setCurrentTask] = useState(null);
 const [clientSummaries, setClientSummaries] = useState([
    createClientSummaryGroup(1),
  ]);

  

  const handleAddClientSummary = () => {
    setClientSummaries((prev) => [
      ...prev,
      createClientSummaryGroup(prev.length + 1),
    ]);
  };

  const handleRemoveClientSummary = (groupIndex) => {
  setClientSummaries((prev) =>
    prev.filter((_, idx) => idx !== groupIndex)
  );
};


  const handleStageChange = (
    groupIndex,
    stageIndex,
    field,
    value
  ) => {
    setClientSummaries((prev) =>
      prev.map((group, gIdx) =>
        gIdx !== groupIndex
          ? group
          : {
              ...group,
              stages: group.stages.map((stage, sIdx) =>
                sIdx !== stageIndex
                  ? stage
                  : { ...stage, [field]: value }
              ),
            }
      )
    );
  };

  const handleStageDataChange = (
    groupIndex,
    stageIndex,
    field,
    value
  ) => {
    setClientSummaries((prev) =>
      prev.map((group, gIdx) =>
        gIdx !== groupIndex
          ? group
          : {
              ...group,
              stages: group.stages.map((stage, sIdx) =>
                sIdx !== stageIndex
                  ? stage
                  : {
                      ...stage,
                      data: {
                        ...stage.data,
                        [field]: value,
                      },
                    }
              ),
            }
      )
    );
  };

  
  useEffect(() => {
    if (task_token) {
      const fetchTaskDetails = async () => {
        try {
          setLoading(true);
          const selectedTask = (await get_staff_task_with_token(task_token))?.[0];
          console.log(selectedTask);

          if (selectedTask) {
            setCurrentTask(selectedTask);
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

  // 1️⃣ Validate main formData fields
  Object.entries(formData).forEach(([key, value]) => {
    if (
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    ) {
      newErrors[key] = `${key.replace(/_/g, " ")} is required`;
      valid = false;
    }
  });

  // 2️⃣ Validate clientSummaries stages
  clientSummaries.forEach((group, gIdx) => {
    group.stages.forEach((stage, sIdx) => {
      if (!stage.status) {
        newErrors[`cs_${gIdx}_${sIdx}_status`] = "Status is required";
        valid = false;
      }

      Object.entries(stage.data).forEach(([field, value]) => {
        // Conditional required fields
        if (
          (stage.type === "Lead Summary" && field === "lead_select" && !value) ||
          (stage.type === "Capture Summary" && field === "shop_no" && !value)
        ) {
          newErrors[`cs_${gIdx}_${sIdx}_${field}`] = `${field.replace(/_/g, " ")} is required`;
          valid = false;
        } else if (
          !["lead_select", "shop_no"].includes(field) && // other fields are always required
          (value === "" || value === null || (typeof value === "object" && value && Object.keys(value).length === 0))
        ) {
          newErrors[`cs_${gIdx}_${sIdx}_${field}`] = `${field.replace(/_/g, " ")} is required`;
          valid = false;
        }
      });
    });
  });

  setErrors(newErrors);
  return valid;
};


  

  console.log(errors);

const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Validate all fields first
  const isValid = validateFields();
  if (!isValid) {
    setSnackbar({
      open: true,
      message: "Please fill all required fields",
      severity: "error",
    });
    return; // stop here if fields are not filled
  }

  // 2️⃣ Add new stage/group if last stage is confirmed
  setClientSummaries((prev) => {
    const updated = [...prev];
    const lastGroup = updated[updated.length - 1];
    const lastStage = lastGroup.stages[lastGroup.stages.length - 1];

    if (lastStage.status === "Confirm") {
      if (lastStage.type === "Client Summary") {
        lastGroup.stages.push(createEmptyStage("Lead Summary"));
      } else if (lastStage.type === "Lead Summary") {
        lastGroup.stages.push(createEmptyStage("Capture Summary"));
      } else if (lastStage.type === "Capture Summary") {
        updated.push(createClientSummaryGroup(updated.length + 1));
      }
    }

    return updated;
  });

  // 3️⃣ Re-validate all fields after adding new group
  const errorsExist = Object.keys(errors).length > 0;
  if (errorsExist) {
    return; // stop API call
  }

  // 4️⃣ Prepare payload and submit
  const payload = {
    formData: { ...formData, task_id: currentTask?.id },
    clientSummaries,
  };

  try {
    setLoading(true);
    const resp = await post_task_report_details(payload);
    if (resp?.success) {
      setSnackbar({
        open: true,
        message: "Task reported successfully",
        severity: "success",
      });
    }
  } catch (err) {
    console.error(err);
    setSnackbar({
      open: true,
      message: "Failed to report the task",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};




  const clientSummaryFields = clientSummaries.flatMap(
  (group, groupIndex) =>
    group.stages.flatMap((stage, stageIndex) => {
      const prefix = `cs_${groupIndex}_${stageIndex}`;

      return [
        {
          id: `${prefix}_title`,
          name: `${prefix}_title`,
          label: `${stage.type} - ${group.id} `,
          btn: stageIndex === 0 ? "Add" : null,
          handleAddClick: handleAddClientSummary,

          btn: groupIndex > 0 ? "Remove" : stageIndex === 0 ? "Add" : null,
          handleRemoveClick: () => handleRemoveClientSummary(groupIndex),
        },

        {
          id: `${prefix}_status`,
          name: `${prefix}_status`,
          label: "Status",
          type: "select",
          options: ["Pending / Revisit", "Confirm"],
          value: stage.status,
          cName: "w-30",
          onChange: (e) =>
            handleStageChange(
              groupIndex,
              stageIndex,
              "status",
              e.target.value
            ),
        },

        {
          id: `${prefix}_name`,
          name: `${prefix}_name`,
          label: "Name",
          type: "text",
          cName: "w-30",
          value: stage.data.name,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "name",
              e.target.value
            ),
        },
        {
          id: `${prefix}_phone`,
          name: `${prefix}_phone`,
          label: "Phone",
          type: "phone_number",
          cName: "w-30",
          value: stage.data.phone,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "phone",
              e.target.value
            ),
        },
        {
          id: `${prefix}_email`,
          name: `${prefix}_email`,
          label: "Email",
          type: "email",
          cName: "w-30",
          value: stage.data.email,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "email",
              e.target.value
            ),
        },
        {
          id: `${prefix}_shop`,
          name: `${prefix}_shop`,
          label: "Shop Name",
          type: "text",
          cName: "w-30",
          value: stage.data.shop,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "shop",
              e.target.value
            ),
        },
        {
          id: `${prefix}_domain`,
          name: `${prefix}_domain`,
          label: "Shop Domain",
          type: "text",
          cName: "w-30",
          value: stage.data.domain,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "domain",
              e.target.value
            ),
        },
        {
          id: `${prefix}_sector`,
          name: `${prefix}_sector`,
          label: "Shop Sector",
          type: "text",
          cName: "w-30",
          value: stage.data.sector,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "sector",
              e.target.value
            ),
        },
        {
          id: `${prefix}_location`,
          name: `${prefix}_location`,
          label: "Location",
          type: "address",
          cName: "w-30",
          value: stage.data.location,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "location",
              e.target.value
            ),
        },

        ...(stage.type === "Lead Summary"
          ? [
              {
                id: `${prefix}_lead_select`,
                name: `${prefix}_lead_select`,
                label: "Select",
                type: "select",
                options: [
                  "Appointment",
                  "Walkin",
                  "Form 1",
                  "Pending / Revisit",
                ],
                cName: "w-30",
                value: stage.data.lead_select,
                onChange: (e) =>
                  handleStageDataChange(
                    groupIndex,
                    stageIndex,
                    "lead_select",
                    e.target.value
                  ),
              },
            ]
          : []),

        ...(stage.type === "Capture Summary"
          ? [
              {
                id: `${prefix}_shop_no`,
                name: `${prefix}_shop_no`,
                label: "Shop No",
                type: "text",
                cName: "w-30",
                value: stage.data.shop_no,
                onChange: (e) =>
                  handleStageDataChange(
                    groupIndex,
                    stageIndex,
                    "shop_no",
                    e.target.value
                  ),
              },
            ]
          : []),
      ];
    })
);


// const handleAddField = () => {
//   setClientSummaryCount((prev) => prev + 1);

//   setFormData((prev) => ({
//     ...prev,
//     [`client_summary_type_${clientSummaryCount + 1}`]: "",
//     [`client_summary_status_${clientSummaryCount + 1}`]: "",
//     [`capture_summary_shop_no_${clientSummaryCount + 1}`]: "",
//     [`client_summary_name_${clientSummaryCount + 1}`]: "",
//     [`client_summary_phone_${clientSummaryCount + 1}`]: "",
//     [`client_summary_email_${clientSummaryCount + 1}`]: "",
//     [`client_summary_shop_${clientSummaryCount + 1}`]: "",
//     [`client_summary_shop_domain_${clientSummaryCount + 1}`]: "",
//     [`client_summary_shop_sector_${clientSummaryCount + 1}`]: "",
//     [`client_summary_location_${clientSummaryCount + 1}`]: "",
//     [`lead_summary_select_${clientSummaryCount + 1}`]: "",
//   }));
// };


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
      id: 3,
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
    },
    

    ...clientSummaryFields,
  ];

  return (
    <Box component="form" className="form2" onSubmit={handleSubmit}>
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
          value={field.value ?? formData[field.name]}
          type={field.type}
          options={field.options}
          onChange={field.onChange || handleOnChange}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
          optionalCname={field.cName}
          multiple={field.multiple}
          readOnly={field.readOnly}
          disable={field.disable}
          btn={field.btn}
          handleAddClick={field.handleAddClick}
          handleRemoveClick={field.handleRemoveClick}
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
