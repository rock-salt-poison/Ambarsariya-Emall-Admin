import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  fetchDomains,
  fetchDomainSectors,
  get_selected_staff_task_report,
  get_staff_member_task_report_details,
  get_staff_task_with_token,
  post_task_report_details,
} from "../../../../API/expressAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const UpdateStaffReportSubmittedForm = () => {

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingReportId, setExistingReportId] = useState(null);

  const [searchParams] = useSearchParams();

  const taskId = searchParams.get("id");
  const taskReportingDate = searchParams.get("date");
  const task_token = searchParams.get("token");
  const summary_group_id = searchParams.get("group");

  const createEmptyStage = (type) => ({
  type,
  status: "",
  history: {
    form1: false,
    send_url: false,
    visit: false,
  },
  action: {},          // 🔥 action = JSON history
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
    client_comment: "",
    capture_comments: {},
    confirm_comment: "",
    shop_no: "",
  },
});

const getLastAction = (arr) =>
  Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null;

const shouldShowClientComment = (stage) =>
  stage.type === "Client Summary" &&
  stage.status === "Contact";

const shouldShowCaptureComment = (stage) =>
  stage.type === "Capture Summary" &&
  ["Form 1", "Send URL", "Visit"].includes(stage.data.capture_action);

const shouldShowConfirmComment = (stage) =>
  stage.type === "Confirm Summary" &&
  !!stage.data.confirm_action;

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
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [domains, setDomains] = useState([]);
  const [sectorMap, setSectorMap] = useState({});
  const navigate=useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
 const [clientSummaries, setClientSummaries] = useState([
    createClientSummaryGroup(1),
  ]);
  const isInitialHydrationRef = React.useRef(true);
const apiTotalsRef = React.useRef(null);
const [allSummaryGroups, setAllSummaryGroups] = useState([]);


  console.log(currentTask);
  

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
  // Only calculate total_leads if not in edit mode (for new reports)
  if (isEditMode && apiTotalsRef.current) {
    setFormData(prev => ({
      ...prev,
      total_leads: apiTotalsRef.current.total_leads,
    }));
    return;
  }

  const visits = Number(formData?.visits || 0);
  const joined = Number(formData?.joined || 0);
  const inPipeline = Number(formData?.in_pipeline || 0);

  const total_leads_summary = visits + joined + inPipeline;

  setFormData(prev => ({
    ...prev,
    total_leads: total_leads_summary,
  }));
}, [formData?.visits, formData?.joined, formData?.in_pipeline, isEditMode]);

  useEffect(()=>{
    const getDomains= async () => {
      try{
        setLoading(true);
        const resp = await fetchDomains();
        
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

  const resetToCreateMode = () => {
  setIsEditMode(false);
  setExistingReportId(null);
  setClientSummaries([createClientSummaryGroup(1)]);
  apiTotalsRef.current = null;
};


  useEffect(() => {
  if (!taskId || !taskReportingDate || !task_token || !summary_group_id) return;

  const fetchExistingReport = async () => {
    try {
      setLoading(true);      

      const resp = await get_selected_staff_task_report(
        taskId,
        taskReportingDate, 
        task_token,
        summary_group_id
      );
      console.log('------------ previously submitted----------- ', resp);
      
      if (resp?.[0]) {
        setIsEditMode(true);
        setExistingReportId(resp?.[0].id);
        setViewReport(true);

        hydrateReport(resp?.[0]);
      } else {
        resetToCreateMode();
      }
    } catch (err) {
      console.error(err);
      resetToCreateMode();
    } finally {
      setLoading(false);
    }
  };

  fetchExistingReport();
}, [taskId, taskReportingDate, task_token, summary_group_id]);


const hydrateReport = (report) => {
  /* 1️⃣ Store API totals in ref */
  apiTotalsRef.current = {
    total_leads: Number(report.total_leads_summary) || 0,
    total_client: Number(report.total_client_summary) || 0,
    total_capture: Number(report.total_capture_summary) || 0,
    total_confirmation: Number(report.total_confirmation) || 0,
  };

  /* 2️⃣ Set form data with API totals and daily values */
  setFormData((prev) => ({
    ...prev,
    visits: Number(report.visits) || 0,
    joined: Number(report.joined) || 0,
    in_pipeline: Number(report.in_pipeline) || 0,
    total_leads: apiTotalsRef.current.total_leads,
    daily_leads: Number(report.daily_leads_summary) || 0,
    total_client: apiTotalsRef.current.total_client,
    daily_client: Number(report.daily_client_summary) || 0,
    total_capture: apiTotalsRef.current.total_capture,
    daily_capture: Number(report.daily_capture_summary) || 0,
    total_confirmation: apiTotalsRef.current.total_confirmation,
    Daily_confirmation: Number(report.daily_confirmation) || 0,
  }));

  /**
   * 2️⃣ Build logical groups using parent relationship
   */
  const summaries = report.summaries || [];
  const tempGroups = {};
  const summaryMap = new Map();

  summaries.forEach((s) => {
    summaryMap.set(s.id, s);
  });

  summaries.forEach((s) => {
    // Find ROOT client summary
    let root = s;
    while (root.parent_summary_id) {
      root = summaryMap.get(root.parent_summary_id);
    }

    if (!tempGroups[root.id]) {
      tempGroups[root.id] = [];
    }

    tempGroups[root.id].push(s);
  });

  /**
   * 3️⃣ Convert to UI groups (1,2,3…)
   */
  const ORDER = ["Client Summary", "Capture Summary", "Confirm Summary"];

const allGroups = Object.values(tempGroups).map((items) => ({
  summary_group_id: items[0]?.summary_group_id, // 🔑 IMPORTANT
  stages: items
    .sort(
      (a, b) =>
        ORDER.indexOf(a.summary_type) -
        ORDER.indexOf(b.summary_type)
    )
    .map((s) => {
      const action = s.action || {};

      const lastClient = getLastAction(action.client_action);
      const lastCapture = getLastAction(action.capture_action);
      const lastConfirm = getLastAction(action.confirm_action);
      const captureComments = {};
      action.capture_action?.forEach((a) => {
        const key = `${a.status}::${a.action}`;
        captureComments[key] = a.comment;
      });

      return {
        type: s.summary_type,
        status: s.status,

        /* 🔥 FULL HISTORY STORED HERE */
        action,

        /* 🔄 history flags (used for Capture flow logic) */
        history: {
          form1: !!action.capture_action?.some(a => a.action === "Form 1"),
          send_url: !!action.capture_action?.some(a => a.action === "Send URL"),
          visit: !!action.capture_action?.some(a => a.action === "Visit"),
        },

        data: {
          name: s.name || "",
          phone: s.phone || "",
          email: s.email || "",
          shop: s.shop_name || "",
          domain: s.shop_domain || "",
          sector: s.shop_sector || "",
          shop_no: s.shop_no || "",
          location: s.location || "",

          /* ✅ Latest actions only for dropdowns */
          client_action:
            s.summary_type === "Client Summary"
              ? lastClient?.action || ""
              : "",

          capture_action:
            s.summary_type === "Capture Summary"
              ? lastCapture?.action || ""
              : "",

          confirm_action:
            s.summary_type === "Confirm Summary"
              ? lastConfirm?.action || ""
              : "",

          client_comment:
            s.summary_type === "Client Summary"
              ? lastClient?.comment || ""
              : "",

          capture_comments:
            captureComments,

          confirm_comment:
            s.summary_type === "Confirm Summary"
              ? lastConfirm?.comment || ""
              : "",
        },
      };
    }),
}));

/* 🔐 STORE ALL GROUPS FOR REPORT CALC */
setAllSummaryGroups(allGroups);

/* 🧾 FILTER ONLY SELECTED GROUP FOR UI */
const visibleGroups = allGroups
  .filter(
    g => String(g.summary_group_id) === String(summary_group_id)
  )
  .map((g, index) => ({
    id: index + 1,
    summary_group_id: g.summary_group_id,
    stages: g.stages,
  }));

// If no summaries exist, ensure at least one empty group is shown
setClientSummaries(visibleGroups.length > 0 ? visibleGroups : [createClientSummaryGroup(1)]);

  // Note: Sectors will be loaded by the useEffect hook when domains are available
  isInitialHydrationRef.current = false;

};

useEffect(() => {
  if (!domains.length || !clientSummaries.length) return;

  // Load sectors for all stages that have a domain
  // This ensures sectors are loaded when domains become available
  clientSummaries.forEach((group, gIdx) => {
    group.stages.forEach((stage, sIdx) => {
      if (stage.data.domain) {
        loadSectorsForStage(stage.data.domain, gIdx, sIdx);
      }
    });
  });
}, [domains, clientSummaries]);



const loadSectorsForStage = async (domainName, groupIndex, stageIndex) => {
  if (!domainName) return;
  console.log(domainName);
  
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

const syncToAllGroups = (updatedClientSummaries) => {
  setAllSummaryGroups(prev =>
    prev.map(group => {
      if (
        String(group.summary_group_id) === String(summary_group_id)
      ) {
        return {
          ...group,
          stages: updatedClientSummaries[0].stages, // selected group only
        };
      }
      return group;
    })
  );
};


const handleStageChange = (groupIndex, stageIndex, field, value) => {
  setClientSummaries((prev) => {
    const updated = [...prev];
    const stages = [...updated[groupIndex].stages];
    const currentStage = { ...stages[stageIndex] };

    // 1️⃣ Update status
    currentStage[field] = value;
    if (currentStage.type === "Capture Summary") {
      currentStage.data = {
        ...currentStage.data,
        capture_action: "",
      };
    }
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
syncToAllGroups(updated);

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

    // 1️⃣ Update stage.data with the new value
    currentStage.data = {
      ...currentStage.data,
      [field]: value,
      ...(field === "domain" ? { sector: "" } : {}), // Reset sector if domain changes
    };

    // 3️⃣ Add or remove dependent stages based on action/status
    const type = currentStage.type;

    if (type === "Client Summary" && field === "client_action") {
      const captureIndex = stages.findIndex((s) => s.type === "Capture Summary");

      if (value === "Completed" && captureIndex === -1) {
        const newStage = {
          ...createEmptyStage("Capture Summary"),
          data: {
            ...createEmptyStage("Capture Summary").data,
            ...copyCommonData(currentStage.data),
          },
        };
        stages.push(newStage);
        loadSectorsForStage(currentStage.data.domain, groupIndex, stages.length - 1);
      } else if (value !== "Completed" && captureIndex !== -1) {
        stages.splice(captureIndex);
      }
    }

    if (
      currentStage.type === "Capture Summary" &&
      field === "capture_action"
    ) {
      const key = `${currentStage.status}::${value}`;

      currentStage.data.capture_comments = {
        ...currentStage.data.capture_comments,
        [key]:
          currentStage.data.capture_comments?.[key] || "",
      };
    }

    if (type === "Capture Summary" && field === "capture_action") {
      const confirmIndex = stages.findIndex((s) => s.type === "Confirm Summary");
      
      if (value === "Captured" && confirmIndex === -1) {
        const newStage = {
          ...createEmptyStage("Confirm Summary"),
          data: {
            ...createEmptyStage("Confirm Summary").data,
            ...copyCommonData(currentStage.data),
          },
        };
        stages.push(newStage);
        loadSectorsForStage(currentStage.data.domain, groupIndex, stages.length - 1);
      } else if (value !== "Captured" && confirmIndex !== -1) {
        stages.splice(confirmIndex);
      }
    }

    // 4️⃣ Update the stages in the group
    stages[stageIndex] = currentStage;
    updated[groupIndex] = { ...group, stages };
    syncToAllGroups(updated);

    return updated;
  });

  // 🔁 keep your existing domain → sector fetch exactly as-is
  if (field === "domain" && value) {
    try {
      console.log(value);
      
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
              task_reporting_date: taskReportingDate
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

      if (
  shouldShowClientComment(stage) &&
  !stage.data.client_comment
) {
  newErrors[`${baseKey}_client_comment`] = "Comment required";
  valid = false;
}

if (
  stage.type === "Capture Summary" &&
  stage.status &&
  stage.data.capture_action
) {
  const key = `${stage.status}::${stage.data.capture_action}`;
  const comment = stage.data.capture_comments?.[key];

  if (!comment) {
    newErrors[`${baseKey}_capture_comment_${key}`] =
      "Comment required";
    valid = false;
  }
}

if (
  shouldShowConfirmComment(stage) &&
  !stage.data.confirm_comment
) {
  newErrors[`${baseKey}_confirm_comment`] = "Comment required";
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
  if (isInitialHydrationRef.current) return;

  // Calculate daily totals from visible group (clientSummaries) - same way totals were calculated before
  let dailyClient = 0;
  let dailyCapture = 0;
  let dailyConfirmation = 0;

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
      dailyConfirmation += 1;
      joined += 1;
      return;
    }

    if (
      confirm?.status === "Confirm" ||
      (confirm?.status === "Joined" &&
        capture.data.capture_action === "Captured")
    ) {
      dailyConfirmation += 1;
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
          capture.data.capture_action !== "Captured")
      )
    ) {
      dailyCapture += 1;
      inPipeline += 1;
      return;
    }
    
   if (
      capture &&
      (
        capture.status === "Pending" ||
        capture.status === "Re-Action" ||
        (capture.status === "Confirm" &&
          capture.data.capture_action === "Captured")
      )
    ) {
      dailyConfirmation += 1;
      inPipeline += 1;
      return;
    }

    

    /* 🥈 PRIORITY 3: CLIENT */

     if (
      client &&
      (client.status === "Confirm" &&
          client.data.client_action === "Completed")
    ) {
      dailyCapture += 1;
      inPipeline += 1;
      return;
    }
    

    /* 🥉 PRIORITY 4: CLIENT */
    if (client && client?.status ) {
      dailyClient += 1;
      visits += 1;
    }
  });

  const dailyLeads = visits + joined + inPipeline;

  setFormData((prev) => {
    const updated = {
      ...prev,
      daily_client: dailyClient,
      daily_capture: dailyCapture,
      Daily_confirmation: dailyConfirmation,
      daily_leads: dailyLeads,
      visits,
      joined,
      in_pipeline: inPipeline,
    };

    // If in edit mode, use API totals; otherwise calculate totals from form data
    if (isEditMode && apiTotalsRef.current) {
      updated.total_leads = apiTotalsRef.current.total_leads;
      updated.total_client = apiTotalsRef.current.total_client;
      updated.total_capture = apiTotalsRef.current.total_capture;
      updated.total_confirmation = apiTotalsRef.current.total_confirmation;
    } else {
      // Calculate totals from form data (for new reports)
      updated.total_client = dailyClient;
      updated.total_capture = dailyCapture;
      updated.total_confirmation = dailyConfirmation;
    }

    return updated;
  });
}, [clientSummaries, isEditMode]);

// Effect to ensure API totals are displayed when in edit mode
useEffect(() => {
  if (isEditMode && apiTotalsRef.current) {
    setFormData(prev => ({
      ...prev,
      total_leads: apiTotalsRef.current.total_leads,
      total_client: apiTotalsRef.current.total_client,
      total_capture: apiTotalsRef.current.total_capture,
      total_confirmation: apiTotalsRef.current.total_confirmation,
    }));
  }
}, [isEditMode]);


  console.log(formData, clientSummaries);

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

 
  // 3️⃣ Wait for the new stage to be added and validate again
  setTimeout(() => {
    const validAfterAdding = validateFields();
    if (!validAfterAdding) {
      
      return;
    }

    // 4️⃣ Prepare payload and submit
    const payload = {
  formData: {
    ...formData,
    task_id: currentTask?.id,
    task_reporting_date: dayjs(formData.task_reporting_date).format("YYYY-MM-DD"),
  },
  clientSummaries: clientSummaries.map(group => ({
    id: group.id,
    summary_group_id: group.summary_group_id,
    stages: group.stages.map(stage => ({
      type: stage.type,
      status: stage.status,
      data:{...stage.data,
      client_action:   stage.type === "Client Summary" &&
  (stage.data.client_action || stage.data.client_comment)
        ? [{ action: stage.data.client_action || null, comment: stage.data.client_comment || null, date: new Date().toISOString() }]
        : [],
      capture_action:
  stage.type === "Capture Summary"
    ? Object.entries(stage.data.capture_comments || {}).map(
        ([key, comment]) => {
          const [status, action] = key.split("::");

          return {
            action,
            status,
            comment,
            date: new Date().toISOString(),
          };
        }
      )
    : [],


      confirm_action: stage.type === "Confirm Summary" && stage.data.confirm_action
    ? [{
        action: stage.data.confirm_action,
        comment: stage.data.confirm_comment || "",
        date: new Date().toISOString(),
      }]
    : [],
}
    })),
  })),
};

    console.log(payload);
    

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
          setTimeout(()=>{navigate('../marketing-staff/reports-submitted')},[1000]);
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
          
        },

        {
          id: `${prefix}_status`,
          name: `${prefix}_status`,
          label: "Status",
          type: "select",
          options: stage.type === "Client Summary" ? ["Pending", "Contact", "Confirm"] : stage.type === "Capture Summary" ? ["Pending", "Re-Action", "Confirm"] : stage.type === "Confirm Summary" ? ["Joined", "Hold", "Revisit"] : [],
          readOnly: stage.type === "Client Summary" && stage.status === 'Confirm' && stage.data.client_action==='Completed' ?  true : stage.type === "Capture Summary" && stage.status === 'Confirm' && stage.data.capture_action==='Captured' ? true : stage.type === "Confirm Summary" && stage.status === 'Joined' && stage.data.confirm_action ? true : false,
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
          value: stage.data.sector || "",
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
                label: "Select Action",
                type: "select",
                options: [
                  "Completed",
                  "Incomplete",
                  "Recollect",
                  "Discard",
                ],
                cName: "w-30",
                value: stage.data.client_action,
                readOnly: stage.type === "Client Summary" && stage.status === 'Confirm' && stage.data.client_action==='Completed' ?  true : false,
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

        ...(stage.type === "Capture Summary"
          ? [
              {
                id: `${prefix}_capture_action`,
                name: `${prefix}_capture_action`,
                label: "Select Action",
                type: "select",
                options: (() => {
  const h = stage.history || {};

  if (!h.form1) return ["Form 1"];
  if (h.form1 && !h.send_url) return ["Form 1", "Send URL"];
  if (h.form1 && h.send_url && !h.visit) return ["Form 1", "Send URL", "Visit"];

  return ["Form 1", "Send URL", "Visit","Feedback", "Re-Visit", "Captured"];
})(),
                cName: "w-30",
                value: stage.data.capture_action,
                readOnly: stage.type === "Capture Summary" && stage.status === 'Confirm' && stage.data.capture_action==='Captured' ? true : false,
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
                label: "Select Action",
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
                readOnly: stage.type === "Confirm Summary" && stage.status === 'Joined' && stage.data.confirm_action ? true : false,
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
          ...(shouldShowClientComment(stage)
  ? [{
      id: `${prefix}_client_comment`,
      label: "Client Comment",
      type: "textarea",
      value: stage.data.client_comment,
      onChange: (e) =>
        handleStageDataChange(
          groupIndex,
          stageIndex,
          "client_comment",
          e.target.value
        ),
    }]
  : []),
...(stage.type === "Capture Summary" &&
  stage.status &&
  stage.data.capture_action
  ? (() => {
      const key = `${stage.status}::${stage.data.capture_action}`;

      return stage.data.capture_comments?.[key] !== undefined
        ? [{
            id: `${prefix}_capture_comment_${key}`,
            label: `${stage.data.capture_action} Comment`,
            type: "textarea",
            value: stage.data.capture_comments[key],
            onChange: (e) =>
              handleStageDataChange(
                groupIndex,
                stageIndex,
                "capture_comments",
                {
                  ...stage.data.capture_comments,
                  [key]: e.target.value,
                }
              ),
          }]
        : [];
    })()
  : []),


...(shouldShowConfirmComment(stage)
  ? [{
      id: `${prefix}_confirm_comment`,
      label: "Confirm Comment",
      type: "textarea",
      value: stage.data.confirm_comment,
      onChange: (e) =>
        handleStageDataChange(
          groupIndex,
          stageIndex,
          "confirm_comment",
          e.target.value
        ),
    }]
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
      label: "Number of visits",
      name: "visits",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 8,
      label: "Number of joined",
      name: "joined",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 9,
      label: "Number of clients in pipeline",
      name: "in_pipeline",
      type: "number",
      cName: viewReport ? 'w-30' : 'w-30 d_none',
    },
    {
      id: 10,
      label: "Total Leads Summary",
      name: "total_leads",
      type: "number",
      readOnly: isEditMode,
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
      readOnly: isEditMode,
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
      readOnly: isEditMode,
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
      readOnly: isEditMode,
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

export default UpdateStaffReportSubmittedForm;
