import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_staff_task_report_details,
  get_staff_tasks,
  get_staff_tasks_by_reporting_date,
  get_all_staff_reports_by_token,
} from "../../../../API/expressAPI";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import StaffReportSubmittedTable from "./StaffReportSubmittedTable";
import { Link } from "react-router-dom";

const StaffReportSubmitted = () => {

  const initialData = {
    assigned_task: '',
    assigned_date: '',
    assigned_area: '',
    approx_shops: '',
    approx_offices: '',
    approx_hawkers: '',
    task_reporting_date: '',
  };
  const [formData, setFormData] = useState(initialData);


  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [taskReport, setTaskReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);


  useEffect(() => {
    if (formData?.assigned_task) {
      const fetch_selected_task = tasks?.find(t => t.access_token === formData?.assigned_task);
      if(fetch_selected_task){
        setCurrentTask(fetch_selected_task);
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
      }else{
        setFormData((prev)=>({
          ...prev, 
          assigned_area: '',
          assigned_date: '',
          approx_shops: '', 
          approx_offices: '', 
          approx_hawkers: '',
        }))
      }
    }
  }, [formData?.assigned_task, tasks]);


  // Fetch all reports by default
  useEffect(() => {
    if (token && !isFiltered) {
      const fetchAllReports = async () => {
        try {
          setLoading(true);
          const resp = await get_all_staff_reports_by_token(token);
          console.log("All reports:", resp);
          if (resp && resp.length > 0) {
            setAllReports(resp);
          } else {
            setAllReports([]);
          }
        } catch (e) {
          console.log(e);
          setAllReports([]);
        } finally {
          setLoading(false);
        }
      };
      fetchAllReports();
    }
  }, [token, isFiltered]);

  // Fetch user by token
  useEffect(() => {
      if (token && formData?.task_reporting_date && isFiltered) {
        const fetchTasks = async () => {
          try {
            setLoading(true);
            const resp = await get_staff_tasks_by_reporting_date(token, dayjs(formData?.task_reporting_date)?.format('YYYY-MM-DD'));
            console.log(resp);
            if (resp) setTasks(resp);
          } catch (e) {
            console.log(e);
            setTaskReport([]);
          } finally {
            setLoading(false);
          }
        };
        fetchTasks();
      }
    }, [token, formData?.task_reporting_date, isFiltered]);





  // Handle Input Change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // If date or task is selected, enable filtering
    if (name === 'task_reporting_date' || name === 'assigned_task') {
      setIsFiltered(true);
    }

    // Reset errors while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 useEffect(()=>{
    if(formData?.assigned_task && formData?.task_reporting_date && isFiltered){
      try{
        setLoading(true);
        const fetch_selected_task = tasks?.find(t => t.access_token === formData?.assigned_task);

        if(fetch_selected_task){
          const fetchTaskReport = async () =>{
            const resp = (await get_staff_task_report_details(fetch_selected_task?.id, dayjs(formData?.task_reporting_date).format('YYYY-MM-DD')))?.[0];
            
            if(resp){
              setTaskReport(resp);
            }else {
              setSnackbar({
                open: true,
                message: "No record exists for the selected date",
                severity: "error",
              });
              setTaskReport(null);
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
    } else if (!isFiltered) {
      // Reset taskReport when not filtering
      setTaskReport(null);
    }
  }, [tasks && formData?.assigned_task, formData?.task_reporting_date, isFiltered]);
  
  
  // Reset filter handler
  const handleResetFilter = () => {
    setFormData(initialData);
    setIsFiltered(false);
    setTaskReport(null);
    setTasks([]);
  };

  // FIELDS
  const formFields = [
    {
      id: 1,
      label: "Reporting Date",
      name: "task_reporting_date",
      type: "date",
      cName: 'w-45', 
    },
    {
      id: 2,
      label: "Assigned Task",
      name: "assigned_task",
      type: "select",
      options: tasks.length > 0 ? tasks?.map((t) => ({ label: t?.assigned_task, value: t?.access_token })) : ['No task reported'],
      disable: tasks?.length == 0 ? true : false,
      cName: 'w-45',
    },
    {
      id: 3,
      label: "Date",
      name: "assigned_date",
      type: "date-range",
      readOnly: true,
      cName: 'flex-auto',
    },
    {
      id: 4,
      label: "Assigned area",
      name: "assigned_area",
      type: "multi-select-checkbox",
      readOnly: true,
      cName: 'w-100'
    },
    {
      id: 5,
      label: "Approx. Shops",
      name: "approx_shops",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 6,
      label: "Approx. Offices",
      name: "approx_offices",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
    {
      id: 7,
      label: "Approx. hawkers or small huts",
      name: "approx_hawkers",
      type: "number",
      cName: 'w-30',
      readOnly: true,
    },
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
          minDate= {field.minDate}
          maxDate= {field.maxDate}
        />
      ))}

      {isFiltered && (
        <Box className="label_group">
          <Link 
            variant="outlined" 
            onClick={handleResetFilter}
            className="btn-link"
          >
            Show All Reports
          </Link>
        </Box>
      )}

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
        />
    </Box>
        <StaffReportSubmittedTable data={isFiltered ? taskReport : null} allReports={!isFiltered ? allReports : null}/>
        </>
  );
};

export default StaffReportSubmitted;
