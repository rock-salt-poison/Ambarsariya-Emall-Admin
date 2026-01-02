import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_staff_task_report_details,
  get_staff_tasks,
  get_staff_tasks_by_reporting_date,
} from "../../../../API/expressAPI";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import StaffReportSubmittedTable from "./StaffReportSubmittedTable";

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


  // Fetch user by token
  useEffect(() => {
      if (token && formData?.task_reporting_date) {
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
    }, [token, formData?.task_reporting_date]);





  // Handle Input Change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset errors while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 useEffect(()=>{
    if(formData?.assigned_task && formData?.task_reporting_date){
      try{
        setLoading(true);
        const fetch_selected_task = tasks?.find(t => t.access_token === formData?.assigned_task);

        if(fetch_selected_task){
          const fetchTaskReport = async () =>{
            const resp = (await get_staff_task_report_details(fetch_selected_task?.id, dayjs(formData?.task_reporting_date).format('YYYY-MM-DD')))?.[0];
            console.log(resp);
            
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
    }
  }, [tasks && formData?.assigned_task, formData?.task_reporting_date]);
  
  
  // FIELDS
  const formFields = [
    {
      id: 1,
      label: "Reporting Date",
      name: "task_reporting_date",
      type: "date",
      cName: 'w-45',
      minDate: currentTask?.start_date, 
      maxDate: currentTask?.end_date, 
    },
    {
      id: 2,
      label: "Assigned Task",
      name: "assigned_task",
      type: "select",
      options: tasks?.map((t) => ({ label: t?.assigned_task, value: t?.access_token })),
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

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
        />
    </Box>
        <StaffReportSubmittedTable data={taskReport}/>
        </>
  );
};

export default StaffReportSubmitted;
