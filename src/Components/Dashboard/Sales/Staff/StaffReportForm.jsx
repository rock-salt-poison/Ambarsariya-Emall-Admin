import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_staff_task_with_token,
  post_task_report_details,
} from "../../../../API/expressAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
    total_leads:0,
    daily_leads:'',
    total_capture:'',
    daily_capture:'',
    total_client:'',
    daily_client:'',
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
  const navigate=useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
 const [clientSummaries, setClientSummaries] = useState([
    createClientSummaryGroup(1),
  ]);


  useEffect(() => {
  const visits = Number(formData?.visits || 0);
  const joined = Number(formData?.joined || 0);
  const inPipeline = Number(formData?.in_pipeline || 0);

  const total_leads_summary = visits + joined + inPipeline;

  setFormData(prev => ({
    ...prev,
    total_leads: total_leads_summary,
  }));
}, [formData?.visits, formData?.joined, formData?.in_pipeline]);

  

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


  // const handleStageChange = (
  //   groupIndex,
  //   stageIndex,
  //   field,
  //   value
  // ) => {
  //   setClientSummaries((prev) =>
  //     prev.map((group, gIdx) =>
  //       gIdx !== groupIndex
  //         ? group
  //         : {
  //             ...group,
  //             stages: group.stages.map((stage, sIdx) =>
  //               sIdx !== stageIndex
  //                 ? stage
  //                 : { ...stage, [field]: value }
  //             ),
  //           }
  //     )
  //   );
  // };


  const handleStageChange = (groupIndex, stageIndex, field, value) => {
  setClientSummaries((prev) => {
    const updated = [...prev];

    const group = { ...updated[groupIndex] };
    const stages = [...group.stages];
    const currentStage = { ...stages[stageIndex] };

    const prevStatus = currentStage.status;

    // Update field
    currentStage[field] = value;
    stages[stageIndex] = currentStage;

    // 🔴 CONFIRM → PENDING / REVISIT
    if (prevStatus === "Confirm" && value === "Pending / Revisit") {

      // 1️⃣ Client Summary rollback
      if (currentStage.type === "Client Summary") {
        // Remove Capture + Confirm summaries
        stages.splice(stageIndex + 1);
      }

      // 2️⃣ Capture Summary rollback
      if (currentStage.type === "Capture Summary") {
        // Remove only Confirm Summary
        const confirmIndex = stages.findIndex(
          (s) => s.type === "Confirm Summary"
        );

        if (confirmIndex > -1) {
          stages.splice(confirmIndex);
        }
      }

      // 3️⃣ Confirm Summary → Pending
      // ❌ Do nothing (explicitly)
    }

    updated[groupIndex] = {
      ...group,
      stages,
    };

    return updated;
  });
};


  const handleStageDataChange = (groupIndex, stageIndex, field, value) => {
  setClientSummaries((prev) =>
    prev.map((group, gIdx) =>
      gIdx !== groupIndex
        ? group
        : {
            ...group,
            stages: group.stages.map((stage, sIdx) => {
              if (sIdx !== stageIndex) return stage;

              const updatedStage = {
                ...stage,
                data: {
                  ...stage.data,
                  [field]: value,
                },
              };

              // ✅ Auto-confirm if Lead Summary and lead_select is "Form 1"
              // if (stage.type === "Capture Summary" && field === "lead_select" && value === "Form 1") {
              //   updatedStage.status = "Confirm";
              // }

              return updatedStage;
            }),
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

  // 🔹 1️⃣ Validate main formData (skip readonly auto-filled ones if needed)
  const requiredMainFields = [
    "task_reporting_date",
    "visits",
    "joined",
    "in_pipeline",
    "total_leads",
    "daily_leads",
    "total_capture",
    "daily_capture",
    "total_client",
    "daily_client",
    "total_confirmation",
    "Daily_confirmation",
  ];

  requiredMainFields.forEach((key) => {
    const value = formData[key];
    if (value === "" || value === null) {
      newErrors[key] = "This field is required";
      valid = false;
    }
  });

  // 🔹 2️⃣ Validate Client Summary Groups
  clientSummaries.forEach((group, gIdx) => {
    group.stages.forEach((stage, sIdx) => {
      const baseKey = `cs_${gIdx}_${sIdx}`;

      // ✅ Status is REQUIRED for every stage
      if (!stage.status) {
        newErrors[`${baseKey}_status`] = "Status is required";
        valid = false;
      }

      // // ✅ Common required fields
      // const requiredCommonFields = [];

      // requiredCommonFields.forEach((field) => {
      //   if (!stage.data[field]) {
      //     newErrors[`${baseKey}_${field}`] = "This field is required";
      //     valid = false;
      //   }
      // });

      // // ✅ Capture Summary specific
      // if (stage.type === "Capture Summary") {
      //   if (!stage.data.lead_select) {
      //     newErrors[`${baseKey}_lead_select`] = "Selection is required";
      //     valid = false;
      //   }
      // }

      // // ✅ Confirm Summary specific
      // if (stage.type === "Confirm Summary") {
      //   if (!stage.data.shop_no) {
      //     newErrors[`${baseKey}_shop_no`] = "Shop No is required";
      //     valid = false;
      //   }
      // }
    });
  });

  setErrors(newErrors);
  return valid;
};
  
useEffect(() => {
  let totalClient = 0;
  let totalCapture = 0;
  let totalConfirmation = 0;

  clientSummaries.forEach(group => {

    const clientStage = group.stages.find(
      stage => stage.type === "Client Summary"
    );

    const captureStage = group.stages.find(
      stage => stage.type === "Capture Summary"
    );

    // 🔹 CLIENT SUMMARY (1 per group)
    if (clientStage) {
      if (clientStage.status === "Confirm") {
        totalCapture += 1;          // ✅ +1 PER GROUP
      } else if (clientStage.status === "Pending / Revisit") {
        totalClient += 1;           // ✅ +1 PER GROUP
      }
    }

    // 🔹 CAPTURE SUMMARY (1 per group)
    if (captureStage) {
      if (captureStage.status === "Confirm") {
        totalConfirmation += 1;     // ✅ +1 PER GROUP
      } else if (captureStage.status === "Pending / Revisit") {
        totalCapture += 1;          // ✅ +1 PER GROUP
      }
    }

  });

  setFormData(prev => ({
    ...prev,
    total_client: totalClient,
    total_capture: totalCapture,
    total_confirmation: totalConfirmation,
  }));

}, [clientSummaries]);


  console.log(errors);

const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Validate all fields first
  let isValid = validateFields();
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
        lastGroup.stages.push(createEmptyStage("Capture Summary"));
      } else if (lastStage.type === "Capture Summary") {
        lastGroup.stages.push(createEmptyStage("Confirm Summary"));
      } else if (lastStage.type === "Confirm Summary") {
        updated.push(createClientSummaryGroup(updated.length + 1));
      }
    }

    return updated;
  });

  // 3️⃣ Wait for the new stage to be added and validate again
  setTimeout(() => {
    const validAfterAdding = validateFields();
    if (!validAfterAdding) {
      
      return;
    }

    // 4️⃣ Prepare payload and submit
    const payload = {
      formData: { ...formData, task_id: currentTask?.id },
      clientSummaries,
    };

    // 5️⃣ Submit API
    (async () => {
      try {
        setLoading(true);
        const resp = await post_task_report_details(payload);
        if (resp?.success) {
          setSnackbar({
            open: true,
            message: "Task reported successfully",
            severity: "success",
          });
          setFormData(initialData);
          setTimeout(()=>{navigate('../sales-staff/my-tasks')},[1000]);
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
    })();
  }, 0); // schedule after state update
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

        ...(stage.type === "Capture Summary"
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

        ...(stage.type === "Confirm Summary"
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
      label: "Total Leads Summary",
      name: "total_leads",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 11,
      label: "Daily Leads Summary",
      name: "daily_leads",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 12,
      label: "Total Client Summary",
      name: "total_client",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 13,
      label: "Daily Client Summary",
      name: "daily_client",
      type: "number",
      cName: 'w-45'
    },
    {
      id: 14,
      label: "Total Capture Summary",
      name: "total_capture",
      type: "number",
      cName: 'w-45',
    },
    {
      id: 15,
      label: "Daily Capture Summary",
      name: "daily_capture",
      type: "number",
      cName: "w-45",
    },
    {
      id: 16,
      label: "Total Confirmation",
      name: "total_confirmation",
      type: "number",
      cName: "w-45",
    },
    {
      id: 17,
      label: "Daily Confirmation",
      name: "Daily_confirmation",
      type: "number",
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
