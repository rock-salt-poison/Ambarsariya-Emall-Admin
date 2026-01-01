import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  fetchDomains,
  fetchDomainSectors,
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
    visits:0,
    joined:0,
    in_pipeline:0,
    total_leads:0,
    daily_leads:0,
    total_capture:0,
    daily_capture:0,
    total_client:0,
    daily_client:0,
    total_confirmation:0,
    Daily_confirmation:0,
  };
  const [formData, setFormData] = useState(initialData);
  const [viewReport, setViewReport] = useState(false);

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
    client_action: "",
    confirm_action: "",
    capture_action: "",
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
  const [domains, setDomains] = useState([]);
  const [sectorMap, setSectorMap] = useState({});
  const navigate=useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
 const [clientSummaries, setClientSummaries] = useState([
    createClientSummaryGroup(1),
  ]);

  const copyCommonData = (fromData) => ({
    name: fromData.name,
    phone: fromData.phone,
    email: fromData.email,
    shop: fromData.shop,
    domain: fromData.domain,
    sector: fromData.sector,
    location: fromData.location,
  });


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

  useEffect(()=>{
    const getDomains= async () => {
      try{
        setLoading(true);
        const resp = await fetchDomains();
        console.log(resp);
        
        if(resp){
          setDomains(resp);
        }else{
          setDomains([]);
        }
      }catch(e){
        setDomains([]);
        console.log(e);
      }finally{
        setLoading(false);
      }
    }
    getDomains();
  }, []);

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
const loadSectorsForStage = async (domainName, groupIndex, stageIndex) => {
  if (!domainName) return;

  const selectedDomain = domains.find(
    (d) => d.domain_id === domainName
  );
  if (!selectedDomain) return;

  try {
    const resp = await fetchDomainSectors(selectedDomain.domain_id);

    setSectorMap((prev) => ({
      ...prev,
      [`${groupIndex}_${stageIndex}`]: resp || [],
    }));
  } catch (err) {
    console.error(err);
    setSectorMap((prev) => ({
      ...prev,
      [`${groupIndex}_${stageIndex}`]: [],
    }));
  }
};


// const handleStageChange = (groupIndex, stageIndex, field, value) => {
//   setClientSummaries((prev) => {
//     const updated = [...prev];
//     const group = { ...updated[groupIndex] };
//     const stages = [...group.stages];
//     const currentStage = { ...stages[stageIndex] };

//     const prevStatus = currentStage.status;
//     currentStage[field] = value;
//     stages[stageIndex] = currentStage;

//     const clientActionValue = currentStage.data.client_action;
//     const captureActionValue = currentStage.data.capture_action;
//     const confirmActionValue = currentStage.data.confirm_action;


//     /* CLIENT → CAPTURE */
//     if (
//       currentStage.type === "Client Summary" &&
//       value === "Confirm" && clientActionValue === "Completed"
//     ) {
//       const hasCapture = stages.some(
//         (s) => s.type === "Capture Summary"
//       );

//       if (!hasCapture) {
//         const captureIndex = stages.length;

//         const newStage = {
//           ...createEmptyStage("Capture Summary"),
//           data: {
//             ...createEmptyStage("Capture Summary").data,
//             ...copyCommonData(currentStage.data),
//           },
//         };

//         stages.push(newStage);

//         loadSectorsForStage(
//           currentStage.data.domain,
//           groupIndex,
//           captureIndex
//         );
//       }
//     }

//     /* CAPTURE → CONFIRM */
//     if (
//       currentStage.type === "Capture Summary" &&
//       value === "Confirm" && captureActionValue === "Captured"
//     ) {
//       const hasConfirm = stages.some(
//         (s) => s.type === "Confirm Summary"
//       );

//       if (!hasConfirm) {
//         const confirmIndex = stages.length;

//         const newStage = {
//           ...createEmptyStage("Confirm Summary"),
//           data: {
//             ...createEmptyStage("Confirm Summary").data,
//             ...copyCommonData(currentStage.data),
//           },
//         };

//         stages.push(newStage);

//         loadSectorsForStage(
//           currentStage.data.domain,
//           groupIndex,
//           confirmIndex
//         );
//       }
//     }

//     /* ROLLBACK */
//     if (prevStatus === "Confirm" && value === "Pending") {
//       if (currentStage.type === "Client Summary") {
//         stages.splice(stageIndex + 1);
//       }

//       if (currentStage.type === "Capture Summary") {
//         const confirmIndex = stages.findIndex(
//           (s) => s.type === "Confirm Summary"
//         );
//         if (confirmIndex > -1) stages.splice(confirmIndex);
//       }
//     }

//     updated[groupIndex] = { ...group, stages };
//     return updated;
//   });
// };




//  const handleStageDataChange = async (
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
//                 : {
//                     ...stage,
//                     data: {
//                       ...stage.data,
//                       [field]: value,
//                       ...(field === "domain" ? { sector: "" } : {}),
//                     },
//                   }
//             ),
//           }
//     )
//   );

//   // ✅ FETCH SECTORS ONLY WHEN DOMAIN CHANGES
//   if (field === "domain" && value) {
//     try {
//       const selectedDomain = domains.find(
//         (d) => d.domain_name === value
//       );

//       if (!selectedDomain) return;

//       const resp = await fetchDomainSectors(
//         selectedDomain.domain_id
//       );

//       setSectorMap((prev) => ({
//         ...prev,
//         [`${groupIndex}_${stageIndex}`]: resp || [],
//       }));
//     } catch (err) {
//       console.error(err);
//       setSectorMap((prev) => ({
//         ...prev,
//         [`${groupIndex}_${stageIndex}`]: [],
//       }));
//     }
//   }
// };

const handleStageChange = (groupIndex, stageIndex, field, value) => {
  setClientSummaries((prev) => {
    const updated = [...prev];
    const stages = [...updated[groupIndex].stages];
    const currentStage = { ...stages[stageIndex] };

    // 1️⃣ Update status
    currentStage[field] = value;
    stages[stageIndex] = currentStage;

    /**
     * 2️⃣ ROLLBACK LOGIC
     * If a parent stage is moved backward,
     * remove all dependent stages after it
     */

    // CLIENT → rollback CAPTURE + CONFIRM
    if (
      currentStage.type === "Client Summary" &&
      value !== "Confirm"
    ) {
      const captureIndex = stages.findIndex(
        (s) => s.type === "Capture Summary"
      );
      if (captureIndex !== -1) {
        stages.splice(captureIndex);
      }
    }

    // CAPTURE → rollback CONFIRM
    if (
      currentStage.type === "Capture Summary" &&
      value !== "Confirm"
    ) {
      const confirmIndex = stages.findIndex(
        (s) => s.type === "Confirm Summary"
      );
      if (confirmIndex !== -1) {
        stages.splice(confirmIndex);
      }
    }

    updated[groupIndex] = {
      ...updated[groupIndex],
      stages,
    };

    return updated;
  });
};


const handleStageDataChange = async (
  groupIndex,
  stageIndex,
  field,
  value
) => {
  setClientSummaries((prev) => {
    const updated = [...prev];
    const group = { ...updated[groupIndex] };
    const stages = [...group.stages];
    const currentStage = { ...stages[stageIndex] };

    currentStage.data = {
      ...currentStage.data,
      [field]: value,
      ...(field === "domain" ? { sector: "" } : {}),
    };

    stages[stageIndex] = currentStage;

    /* ✅ ADD ONLY THIS BLOCK */
    if (
  field === "client_action" &&
  currentStage.type === "Client Summary" &&
  currentStage.status === "Confirm"
) {
  const captureIndex = stages.findIndex(
    (s) => s.type === "Capture Summary"
  );

  // ✅ ADD Capture when Completed
  if (value === "Completed") {
    if (captureIndex === -1) {
      const newIndex = stages.length;

      const newStage = {
        ...createEmptyStage("Capture Summary"),
        data: {
          ...createEmptyStage("Capture Summary").data,
          ...copyCommonData(currentStage.data),
        },
      };

      stages.push(newStage);

      loadSectorsForStage(
        currentStage.data.domain,
        groupIndex,
        newIndex
      );
    }
  }
  // ❌ REMOVE Capture when NOT Completed
  else {
    if (captureIndex !== -1) {
      stages.splice(captureIndex);
    }
  }
}

if (
  field === "capture_action" &&
  currentStage.type === "Capture Summary" &&
  currentStage.status === "Confirm"
) {
  const confirmIndex = stages.findIndex(
    (s) => s.type === "Confirm Summary"
  );

  // ✅ ADD Capture when Completed
  if (value === "Captured") {
    if (confirmIndex === -1) {
      const newIndex = stages.length;

      const newStage = {
        ...createEmptyStage("Confirm Summary"),
        data: {
          ...createEmptyStage("Confirm Summary").data,
          ...copyCommonData(currentStage.data),
        },
      };

      stages.push(newStage);

      loadSectorsForStage(
        currentStage.data.domain,
        groupIndex,
        newIndex
      );
    }
  }
  // ❌ REMOVE Capture when NOT Completed
  else {
    if (confirmIndex !== -1) {
      stages.splice(confirmIndex);
    }
  }
}

// if (
//   field === "confirm_action" &&
//   currentStage.type === "Confirm Summary" &&
//   currentStage.status === "Joined"
// ) {
//   const confirmIndex = stages.findIndex(
//     (s) => s.type === "Confirm Summary"
//   );

//   // ✅ ADD Capture when Completed
//   if (value === "Captured") {
//     if (confirmIndex === -1) {
//       const newIndex = stages.length;

//       const newStage = {
//         ...createEmptyStage("Confirm Summary"),
//         data: {
//           ...createEmptyStage("Confirm Summary").data,
//           ...copyCommonData(currentStage.data),
//         },
//       };

//       stages.push(newStage);

//       loadSectorsForStage(
//         currentStage.data.domain,
//         groupIndex,
//         newIndex
//       );
//     }
//   }
//   // ❌ REMOVE Capture when NOT Completed
//   else {
//     if (confirmIndex !== -1) {
//       stages.splice(confirmIndex);
//     }
//   }
// }

    /* ✅ END ADD */

    updated[groupIndex] = { ...group, stages };
    return updated;
  });

  // 🔁 keep your existing domain → sector fetch exactly as-is
  if (field === "domain" && value) {
    try {
      const selectedDomain = domains.find(
        (d) => d.domain_id === value
      );

      if (!selectedDomain) return;

      const resp = await fetchDomainSectors(
        selectedDomain.domain_id
      );

      setSectorMap((prev) => ({
        ...prev,
        [`${groupIndex}_${stageIndex}`]: resp || [],
      }));
    } catch (err) {
      console.error(err);
      setSectorMap((prev) => ({
        ...prev,
        [`${groupIndex}_${stageIndex}`]: [],
      }));
    }
  }
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

      if (stage.status === "Confirm" &&
  stage.type === "Client Summary" &&
  !stage.data?.client_action) {
        newErrors[`${baseKey}_client_action`] = "Action is required";
        valid = false;
      }

      if (stage.status === "Confirm" &&
  stage.type === "Capture Summary" &&
  !stage.data?.capture_action) {
        newErrors[`${baseKey}_capture_action`] = "Action is required";
        valid = false;
      }

      if (stage.type === "Confirm Summary" &&
  !stage.data?.confirm_action) {
        newErrors[`${baseKey}_confirm_action`] = "Action is required";
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
  let totaljoinee = 0;

  let visits = 0;
  let inPipeline = 0;
  let joined = 0;

  clientSummaries.forEach((group) => {
    const client = group.stages.find(
      (s) => s.type === "Client Summary"
    );
    const capture = group.stages.find(
      (s) => s.type === "Capture Summary"
    );
    const confirm = group.stages.find(
      (s) => s.type === "Confirm Summary"
    );

    /* 🥇 PRIORITY 1: CONFIRMATION */
    if (
      confirm && (confirm?.status === "Confirm" ||
      confirm?.status === "Joined" )
    ) {
      totalConfirmation += 1;
      joined += 1;
      return;
    }

    if (
      confirm?.status === "Confirm" ||
      (confirm?.status === "Joined" &&
        capture.data.capture_action === "Captured")
    ) {
      totalConfirmation += 1;
      inPipeline += 1;
      return;
    }

    /* 🥈 PRIORITY 2: CAPTURE */
   if (
      capture &&
      (
        capture.status === "Pending" ||
        capture.status === "Re-Action" ||
        (capture.status === "Confirm" &&
          capture.data.capture_action === "Captured")
      )
    ) {
      totalConfirmation += 1;
      inPipeline += 1;
      return;
    }

    if (
      capture &&
      (
        capture.status === "Pending" ||
        capture.status === "Re-Action" ||
        (capture.status === "Confirm" &&
          capture.data.capture_action !== "Captured")
      )
    ) {
      totalCapture += 1;
      inPipeline += 1;
      return;
    }

    /* 🥈 PRIORITY 3: CLIENT */

     if (
      client &&
      (client.status === "Confirm" &&
          client.data.client_action === "Completed")
    ) {
      totalCapture += 1;
      inPipeline += 1;
      return;
    }
    

    /* 🥉 PRIORITY 4: CLIENT */
    if (client && client?.status ) {
      totalClient += 1;
      visits += 1;
    }
  });

  setFormData((prev) => ({
    ...prev,
    total_client: totalClient,
    total_capture: totalCapture,
    total_confirmation: totalConfirmation,
    visits,
    in_pipeline: inPipeline,
    joined,
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
  // setClientSummaries((prev) => {
  //   const updated = [...prev];
  //   const lastGroup = updated[updated.length - 1];
  //   const lastStage = lastGroup.stages[lastGroup.stages.length - 1];

  //   if (lastStage.status === "Confirm") {
  //     if (lastStage.type === "Client Summary") {
  //       lastGroup.stages.push(createEmptyStage("Capture Summary"));
  //     } else if (lastStage.type === "Capture Summary") {
  //       lastGroup.stages.push(createEmptyStage("Confirm Summary"));
  //     } else if (lastStage.type === "Confirm Summary") {
  //       updated.push(createClientSummaryGroup(updated.length + 1));
  //     }
  //   }

  //   return updated;
  // });

  // 3️⃣ Wait for the new stage to be added and validate again
  setTimeout(() => {
    const validAfterAdding = validateFields();
    if (!validAfterAdding) {
      
      return;
    }

    // 4️⃣ Prepare payload and submit
    const payload = {
      formData: { ...formData, task_id: currentTask?.id, task_reporting_date: dayjs(formData.task_reporting_date).format("YYYY-MM-DD"),
 },
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
          btn: stage.type === "Client Summary"
    ? groupIndex === 0
      ? "Add"
      : "Remove"
    : null,
          handleAddClick: handleAddClientSummary,

          // btn: groupIndex > 0 ? "Remove" : stageIndex === 0 ? "Add" : null,
          handleRemoveClick: () => handleRemoveClientSummary(groupIndex),
        },

        {
          id: `${prefix}_status`,
          name: `${prefix}_status`,
          label: "Status",
          type: "select",
          options: stage.type === "Client Summary" ? ["Pending", "Contact", "Confirm"] : stage.type === "Capture Summary" ? ["Pending", "Re-Action", "Confirm"] : stage.type === "Confirm Summary" ? ["Joined", "Hold", "Revisit"] : [],
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
          type: "select",
          cName: "w-30",
          options: domains?.map(d=>({label: d?.domain_name, value:d?.domain_id})) || ['No domain exists'],
          disable: domains?.length> 0 ? false : true,
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
          type: "select",
          cName:'w-30',
          options:
    sectorMap[`${groupIndex}_${stageIndex}`]?.map(
      (s) => ({ label: s.sector_name, value: s.sector_id })
    ) || [],
  disable:
    !sectorMap[`${groupIndex}_${stageIndex}`]?.length,
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
          cName: 'w-30',
          value: stage.data.location,
          onChange: (e) =>
            handleStageDataChange(
              groupIndex,
              stageIndex,
              "location",
              e.target.value
            ),
        },
        ...(stage.type === "Client Summary" && stage.status === "Confirm"
          ? [
              {
                id: `${prefix}_client_action`,
                name: `${prefix}_client_action`,
                label: "Select",
                type: "select",
                options: [
                  "Completed",
                  "Incomplete",
                  "Recollect",
                  "Discard",
                ],
                cName: "w-30",
                value: stage.data.client_action,
                onChange: (e) =>
                  handleStageDataChange(
                    groupIndex,
                    stageIndex,
                    "client_action",
                    e.target.value
                  ),
              },
            ]
          : []),

        ...(stage.type === "Capture Summary" &&  stage.status === "Confirm"
          ? [
              {
                id: `${prefix}_capture_action`,
                name: `${prefix}_capture_action`,
                label: "Select",
                type: "select",
                options: [
                  "Form 1",
                  "Send URL",
                  "Visit",
                  "Feedback",
                  "Re-Visit",
                  "Captured"
                ],
                cName: "w-30",
                value: stage.data.capture_action,
                onChange: (e) =>
                  handleStageDataChange(
                    groupIndex,
                    stageIndex,
                    "capture_action",
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
              {
                id: `${prefix}_confirm_action`,
                name: `${prefix}_confirm_action`,
                label: "Select",
                type: "select",
                options: stage.status === 'Joined' ? [
                  "Self Creation",
                  "Staff Visit",
                  "Support"
                ] : stage.status === 'Hold' ? [
                  "Self Creation",
                  "Staff Visit",
                  "Hold",
                  "Pending",
                  "Support"
                ] : stage.status === 'Revisit' ? [
                  "Self Creation",
                  "Staff Visit",
                  "Hold",
                  "Pending",
                  "Support"
                ] : [],
                cName: "w-30",
                value: stage.data.confirm_action,
                onChange: (e) =>
                  handleStageDataChange(
                    groupIndex,
                    stageIndex,
                    "confirm_action",
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
      minDate: currentTask?.start_date, 
      maxDate: currentTask?.end_date, 
    },
    ...clientSummaryFields,
    ...viewReport ? [{
      id: 31,
      label: 'Report'
    }]:[],
    {
      id: 7,
      label: "Total number of visits",
      name: "visits",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 8,
      label: "Total number of joined",
      name: "joined",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 9,
      label: "Total number of clients in pipeline",
      name: "in_pipeline",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 10,
      label: "Total Leads Summary",
      name: "total_leads",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none'
    },
    {
      id: 11,
      label: "Daily Leads Summary",
      name: "daily_leads",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none'
    },
    {
      id: 12,
      label: "Total Client Summary",
      name: "total_client",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none'
    },
    {
      id: 13,
      label: "Daily Client Summary",
      name: "daily_client",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none'
    },
    {
      id: 14,
      label: "Total Capture Summary",
      name: "total_capture",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none',
    },
    {
      id: 15,
      label: "Daily Capture Summary",
      name: "daily_capture",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none',
    },
    {
      id: 16,
      label: "Total Confirmation",
      name: "total_confirmation",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none',
    },
    {
      id: 17,
      label: "Daily Confirmation",
      name: "Daily_confirmation",
      type: "number",
      cName: viewReport ? 'w-45' : 'w-45 d_none',
    },
    
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
          minDate={field.minDate}
          maxDate={field.maxDate}
          handleAddClick={field.handleAddClick}
          handleRemoveClick={field.handleRemoveClick}
        />
      ))}
      <Box className="submit_button_container">
        <Button type="submit" variant="contained">
          Submit
        </Button>
        {viewReport ? <Button type="button" variant="contained" onClick={()=>setViewReport(false)}>
          Hide Report
        </Button> : <Button type="button" variant="contained" onClick={()=>setViewReport(true)}>
          View Report
        </Button>}
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
