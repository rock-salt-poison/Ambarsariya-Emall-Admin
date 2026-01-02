import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import FormFields from "../../Form/FormFields";
import CustomSnackbar from "../../CustomSnackbar";
import {
  get_role_employees,
  get_staff_members_by_manager_id,
  post_role_employees,
  put_replaceManagerAndDeleteEmployee,
} from "../../../API/expressAPI";

const AssignStaffAnEmployeeForm = ({ onClose, selectedTask }) => {
  const [loading, setLoading] = useState(false);

  const [staffMembers, setStaffMembers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // 🔹 Array-based assignments
  const [assignments, setAssignments] = useState([]);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     FETCH EMPLOYEES
  ========================== */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const resp = await get_role_employees();
        if (resp) setEmployees(resp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  /* =========================
     FETCH STAFF MEMBERS
  ========================== */
  useEffect(() => {
    if (!selectedTask) return;

    const fetchStaffMembers = async () => {
      try {
        setLoading(true);
        const resp = await get_staff_members_by_manager_id(selectedTask);
        if (resp) setStaffMembers(resp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMembers();
  }, [selectedTask]);

  /* =========================
     INIT ASSIGNMENTS
  ========================== */
  useEffect(() => {
    if (staffMembers.length > 0) {
      setAssignments(
        staffMembers.map((staff) => ({
          staff_id: staff.id,
          employee_id: "",
        }))
      );
    }
  }, [staffMembers]);

  /* =========================
     HANDLE CHANGE
  ========================== */
  const handleEmployeeChange = (index, value) => {
    setAssignments((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, employee_id: value } : item
      )
    );

    setErrors((prev) => ({
      ...prev,
      [`employee_${index}`]: "",
    }));
  };

  /* =========================
     VALIDATION
  ========================== */
  const validateFields = () => {
    const newErrors = {};
    let valid = true;

    assignments.forEach((a, index) => {
      if (!a.employee_id) {
        newErrors[`employee_${index}`] = "Employee is required";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateFields()) return;

  const payload = {
    old_employee_id: selectedTask, // 🔥 employee to be deleted
    assignments,                  // 🔥 [{ staff_id, employee_id }]
  };

  try {
    setLoading(true);

    console.log("Submitting payload:", payload);

    await put_replaceManagerAndDeleteEmployee(payload); // 🔥 call replace + delete API

    setSnackbar({
      open: true,
      message: "Staff reassigned and employee deleted successfully",
      severity: "success",
    });

    setTimeout(()=>{onClose();}, 1000);
    
  } catch (err) {
    console.error(err);
    setSnackbar({
      open: true,
      message:
        err?.response?.data?.message ||
        "Failed to reassign staff and delete employee",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};


  /* =========================
     RENDER
  ========================== */
  return (
    <>
      {" "}
      {staffMembers.length === 0 ? (
        <Typography>No staff members found</Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          {loading && (
            <Box className="loading">
              <CircularProgress />
            </Box>
          )}

          {staffMembers.map((staff, index) => (
            <Box
              key={staff.id}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 2,
              }}
            >
              {/* Staff Name */}
              <FormFields
                label="Staff Member"
                type="text"
                value={staff.username}
                readOnly
              />

              {/* Employee Select */}
              <FormFields
                label="Employee"
                type="select"
                value={assignments[index]?.employee_id || ""}
                options={employees.map((e) => ({
                  label: e.username,
                  value: e.id,
                }))}
                onChange={(e) => handleEmployeeChange(index, e.target.value)}
                error={!!errors[`employee_${index}`]}
                helperText={errors[`employee_${index}`]}
              />
            </Box>
          ))}

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>

          <CustomSnackbar
            open={snackbar.open}
            handleClose={() =>
              setSnackbar((prev) => ({ ...prev, open: false }))
            }
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </Box>
      )}
    </>
  );
};

export default AssignStaffAnEmployeeForm;
