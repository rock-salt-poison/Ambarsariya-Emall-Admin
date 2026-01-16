import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_permissions,
  get_staff_member_tasks,
  get_staff_task_report_details,
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
import dayjs from "dayjs";
import StaffReportTable from "./StaffReportTable";

const StaffReportForm = () => {

  const initialData = {
    staff_type: "",
    staff: "",
    assigned_task: '',
    assigned_date: '',
    assigned_area: '',
    approx_shops: '',
    approx_offices: '',
    approx_hawkers: '',
    task_reporting_date: '',
    visits: 0,
    joined: 0,
    in_pipeline: 0,
    total_leads: 0,
    daily_leads: 0,
    total_capture: 0,
    daily_capture: 0,
    total_client: 0,
    daily_client: 0,
    total_confirmation: 0,
    Daily_confirmation: 0,
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


  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [staffTypes, setStaffTypes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [taskReport, setTaskReport] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);

  const [currentTask, setCurrentTask] = useState(null);
  const [clientSummaries, setClientSummaries] = useState([
    createClientSummaryGroup(1),
  ]);


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
    if (formData?.staff && manager) {
      const assigned_to = staffMembers?.find((sm) => sm.name === formData?.staff)?.id
      const assigned_by = manager?.id;

      if (assigned_to && assigned_by) {
        const fetchTasks = async () => {
          try {
            setLoading(true);
            const resp = await get_staff_member_tasks(assigned_by, assigned_to);
            console.log(resp);

            if (resp) {
              setTasks(resp);
            }
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
        }
        fetchTasks();
      }
    }
  }, [formData?.staff, manager])

  useEffect(() => {
    if (formData?.assigned_task) {
      const fetch_selected_task = tasks?.find(t => t.access_token === formData?.assigned_task);

      const date_range = fetch_selected_task && [
        dayjs(fetch_selected_task.start_date).toDate(),
        dayjs(fetch_selected_task.end_date).toDate()
      ];
      console.log(date_range);

      setFormData((prev) => ({
        ...prev,
        assigned_date: date_range,
        assigned_area: fetch_selected_task?.assign_area?.map((a)=>a?.formatted_address),
        approx_shops: fetch_selected_task?.approx_shops, 
        approx_offices: fetch_selected_task?.approx_offices, 
        approx_hawkers: fetch_selected_task?.approx_hawkers, 
      }))
    }
  }, [formData?.assigned_task]);

const mapApiSummariesToClientSummaries = (summaries = []) => {
  if (!Array.isArray(summaries)) return [];

  // 1️⃣ Index summaries by id
  const byId = {};
  summaries.forEach((s) => {
    byId[s.id] = {
      id: s.id,
      parent_summary_id: s.parent_summary_id || null,
      type: s.summary_type,
      status: s.status || "",
      data: {
        name: s.name || "",
        phone: s.phone || "",
        email: s.email || "",
        shop: s.shop_name || "",
        domain: s.shop_domain || "",
        sector: s.shop_sector || "",
        location: s.location || "",
        lead_select: s.lead_select || "",
        shop_no: s.shop_no || "",
      },
      children: [],
    };
  });

  // 2️⃣ Build tree
  const roots = [];
  Object.values(byId).forEach((node) => {
    if (node.parent_summary_id && byId[node.parent_summary_id]) {
      byId[node.parent_summary_id].children.push(node);
    } else {
      roots.push(node); // Client Summary
    }
  });

  // 3️⃣ Build UI groups with SAME index
  const groups = [];
  let clientIndex = 1;

  const buildStages = (node, index, stages = []) => {
    stages.push({
      type: `${node.type} - ${index}`,
      status: node.status,
      data: node.data,
    });

    node.children.forEach((child) =>
      buildStages(child, index, stages)
    );

    return stages;
  };

  roots.forEach((root) => {
    groups.push({
      id: clientIndex,
      stages: buildStages(root, clientIndex, []),
    });
    clientIndex++;
  });

  return groups;
};




  useEffect(()=>{
    if(formData?.assigned_task && formData?.task_reporting_date){
      try{
        setLoading(true);
        const fetch_selected_task = tasks?.find(t => t.access_token === formData?.assigned_task);

        if(fetch_selected_task){
          const fetchTaskReport = async () =>{
            const resp = (await get_staff_task_report_details(fetch_selected_task?.id, dayjs(formData?.task_reporting_date).format('YYYY-MM-DD')))?.[0];
            setTaskReport(resp);
            console.log(resp);
            
            if(resp){
              setFormData((prev)=>({
                ...prev, 
                visits: resp?.visits,
                joined: resp?.joined,
                in_pipeline: resp?.in_pipeline,
                total_leads: resp?.total_leads_summary,
                daily_leads: resp?.daily_leads_summary,
                total_client: resp?.total_client_summary,
                daily_client: resp?.daily_client_summary,
                total_capture: resp?.total_capture_summary,
                daily_capture: resp?.daily_capture_summary,
                total_confirmation: resp?.total_confirmation,
                Daily_confirmation: resp?.daily_confirmation,
              }));

               if (Array.isArray(resp.summaries) && resp.summaries.length > 0) {
                const mappedSummaries = mapApiSummariesToClientSummaries(resp.summaries);
                setClientSummaries(mappedSummaries);
              }else {
              setClientSummaries([createClientSummaryGroup(1)]);
            }
            }else {
              setSnackbar({
                open: true,
                message: "No record exists for the selected date",
                severity: "error",
              });
              setTaskReport(null);
               setFormData((prev)=>({
                ...prev, 
                visits: 0,
                joined: 0,
                in_pipeline: 0,
                total_leads: 0,
                daily_leads: 0,
                total_client: 0,
                daily_client: 0,
                total_capture: 0,
                daily_capture: 0,
                total_confirmation: 0,
                Daily_confirmation: 0,
              }));

              setClientSummaries([createClientSummaryGroup(1)]);

            }
          }

          fetchTaskReport();
        }
        
      }catch(e){
        console.log(e);
        setTaskReport(null);
      }finally{
        setLoading(false);
      }
    }
  }, [tasks && formData?.assigned_task, formData?.task_reporting_date]);


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
              // if (stage.type === "Lead Summary" && field === "lead_select" && value === "Form 1") {
              //   updatedStage.status = "Confirm";
              // }

              return updatedStage;
            }),
          }
      )
    );
  };
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
  // const validateFields = () => {
  //   const newErrors = {};
  //   let valid = true;

  //   // 1️⃣ Validate main formData fields
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (
  //       value === "" ||
  //       value === null ||
  //       (Array.isArray(value) && value.length === 0)
  //     ) {
  //       newErrors[key] = `${key.replace(/_/g, " ")} is required`;
  //       valid = false;
  //     }
  //   });

  //   // 2️⃣ Validate clientSummaries stages
  //   clientSummaries.forEach((group, gIdx) => {
  //     group.stages.forEach((stage, sIdx) => {
  //       if (!stage.status) {
  //         newErrors[`cs_${gIdx}_${sIdx}_status`] = "Status is required";
  //         valid = false;
  //       }

  //       Object.entries(stage.data).forEach(([field, value]) => {
  //         // Conditional required fields
  //         if (
  //           (stage.type === "Lead Summary" && field === "lead_select" && !value) ||
  //           (stage.type === "Capture Summary" && field === "shop_no" && !value)
  //         ) {
  //           newErrors[`cs_${gIdx}_${sIdx}_${field}`] = `${field.replace(/_/g, " ")} is required`;
  //           valid = false;
  //         } else if (
  //           !["lead_select", "shop_no"].includes(field) && // other fields are always required
  //           (value === "" || value === null || (typeof value === "object" && value && Object.keys(value).length === 0))
  //         ) {
  //           newErrors[`cs_${gIdx}_${sIdx}_${field}`] = `${field.replace(/_/g, " ")} is required`;
  //           valid = false;
  //         }
  //       });
  //     });
  //   });

  //   setErrors(newErrors);
  //   return valid;
  // };




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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // 1️⃣ Validate all fields first
  //   let isValid = validateFields();
  //   if (!isValid) {
  //     setSnackbar({
  //       open: true,
  //       message: "Please fill all required fields",
  //       severity: "error",
  //     });
  //     return; // stop here if fields are not filled
  //   }

  //   // 2️⃣ Add new stage/group if last stage is confirmed
  //   setClientSummaries((prev) => {
  //     const updated = [...prev];
  //     const lastGroup = updated[updated.length - 1];
  //     const lastStage = lastGroup.stages[lastGroup.stages.length - 1];

  //     if (lastStage.status === "Confirm") {
  //       if (lastStage.type === "Client Summary") {
  //         lastGroup.stages.push(createEmptyStage("Lead Summary"));
  //       } else if (lastStage.type === "Lead Summary") {
  //         lastGroup.stages.push(createEmptyStage("Capture Summary"));
  //       } else if (lastStage.type === "Capture Summary") {
  //         updated.push(createClientSummaryGroup(updated.length + 1));
  //       }
  //     }

  //     return updated;
  //   });

  //   // 3️⃣ Wait for the new stage to be added and validate again
  //   setTimeout(() => {
  //     const validAfterAdding = validateFields();
  //     if (!validAfterAdding) {
  //       setSnackbar({
  //         open: true,
  //         message: "Please fill all required fields",
  //         severity: "error",
  //       });
  //       return;
  //     }

  //     // 4️⃣ Prepare payload and submit
  //     const payload = {
  //       formData: { ...formData, task_id: currentTask?.id },
  //       clientSummaries,
  //     };

  //     // 5️⃣ Submit API
  //     (async () => {
  //       try {
  //         setLoading(true);
  //         const resp = await post_task_report_details(payload);
  //         if (resp?.success) {
  //           setSnackbar({
  //             open: true,
  //             message: "Task reported successfully",
  //             severity: "success",
  //           });
  //         }
  //       } catch (err) {
  //         console.error(err);
  //         setSnackbar({
  //           open: true,
  //           message: "Failed to report the task",
  //           severity: "error",
  //         });
  //       } finally {
  //         setLoading(false);
  //       }
  //     })();
  //   }, 0); // schedule after state update
  // };





  const clientSummaryFields = clientSummaries.flatMap(
    (group, groupIndex) =>
      group.stages.flatMap((stage, stageIndex) => {
        const prefix = `cs_${groupIndex}_${stageIndex}`;

        return [
          {
            id: `${prefix}_title`,
            name: `${prefix}_title`,
            label: `${stage.type}`,
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
      label: "Select staff type",
      name: "staff_type",
      type: "select",
      options: staffTypes.map((s) => s.staff_type_name),
      cName: 'w-45',
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
      cName: 'w-45',
    },
    {
      id: 3,
      label: "Assigned Task",
      name: "assigned_task",
      type: "select",
      options: tasks?.map((t) => ({ label: t?.assigned_task, value: t?.access_token })),
      disable: tasks?.length === 0 ? true : false,
      cName: 'w-45',
    },
    {
      id: 4,
      label: "Date",
      name: "assigned_date",
      type: "date-range",
      readOnly: true,
      cName: 'flex-auto',
    },
    {
      id: 6,
      label: "Assigned area",
      name: "assigned_area",
      type: "multi-select-checkbox",
      readOnly: true,
      cName: 'w-100'
    },
    {
      id: 7,
      label: "Approx. Shops",
      name: "approx_shops",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 8,
      label: "Approx. Offices",
      name: "approx_offices",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 9,
      label: "Approx. hawkers or small huts",
      name: "approx_hawkers",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 5,
      label: "Date",
      name: "task_reporting_date",
      type: "date",
      cName: 'flex-auto',
    },
    // {
    //   id: 10,
    //   label: "Total number of visits",
    //   name: "visits",
    //   type: "number",
    //   cName: 'w-30',
    // },
    // {
    //   id: 11,
    //   label: "Total number of joined",
    //   name: "joined",
    //   type: "number",
    //   cName: 'w-30',
    // },
    // {
    //   id: 12,
    //   label: "Total number of clients in pipeline",
    //   name: "in_pipeline",
    //   type: "number",
    //   cName: 'w-30',
    // },
    // {
    //   id: 13,
    //   label: "Total Leads Summary",
    //   name: "total_leads",
    //   type: "number",
    //   cName: 'w-45'
    // },
    // {
    //   id: 14,
    //   label: "Daily Leads Summary",
    //   name: "daily_leads",
    //   type: "number",
    //   cName: 'w-45'
    // },
    // {
    //   id: 15,
    //   label: "Total Client Summary",
    //   name: "total_client",
    //   type: "number",
    //   cName: 'w-45'
    // },
    // {
    //   id: 16,
    //   label: "Daily Client Summary",
    //   name: "daily_client",
    //   type: "number",
    //   cName: 'w-45'
    // },
    // {
    //   id: 17,
    //   label: "Total Capture  Summary",
    //   name: "total_capture",
    //   type: "text",
    //   cName: 'w-45',
    // },
    // {
    //   id: 18,
    //   label: "Daily Capture Summary",
    //   name: "daily_capture",
    //   type: "text",
    //   cName: "w-45",
    // },
    // {
    //   id: 19,
    //   label: "Total Confirmation",
    //   name: "total_confirmation",
    //   type: "number",
    //   cName: "w-45",
    // },
    // {
    //   id: 20,
    //   label: "Daily Confirmation",
    //   name: "Daily_confirmation",
    //   type: "number",
    //   cName: "w-45",
    // },

    // ...clientSummaryFields,
  ];

  return (
    <>
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

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
        />
    </Box>
        <StaffReportTable data={taskReport}/>
        </>
  );
};

export default StaffReportForm;
