import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import FormFields from "../../Form/FormFields";
import CustomSnackbar from "../../CustomSnackbar";
import {
  get_role_employees,
  get_staff_members_by_manager_id,
  put_replaceManagerAndDeleteEmployee,
} from "../../../API/expressAPI";

const AssignStaffAnEmployeeForm = ({ onClose, selectedTask }) => {
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
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
        if (resp) setStaffMembers(resp || []);
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
    } else {
      setAssignments([]);
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
     SUBMIT (REASSIGN + DELETE)
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      setLoading(true);

      await put_replaceManagerAndDeleteEmployee({
        old_employee_id: selectedTask,
        assignments,
      });

      setSnackbar({
        open: true,
        message: "Staff reassigned and employee deleted successfully",
        severity: "success",
      });

      setTimeout(() => onClose(), 1000);
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
     DELETE ONLY (NO STAFF)
  ========================== */
  const handleDeleteOnly = async () => {
    try {
      setLoading(true);

      await put_replaceManagerAndDeleteEmployee({
        old_employee_id: selectedTask,
        assignments: [],
      });

      setSnackbar({
        open: true,
        message: "Employee deleted successfully",
        severity: "success",
      });

      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.message || "Failed to delete employee",
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
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}

      {staffMembers.length === 0 ? (
        <Box>
          <Typography sx={{ mb: 2 }}>
            No staff members are assigned to this employee.
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteOnly}
          >
            Delete Employee
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          {staffMembers.map((staff, index) => (
            <Box
              key={staff.id}
              sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
            >
              <FormFields
                label="Staff Member"
                type="text"
                value={staff.username}
                readOnly
              />

              <FormFields
                label="Employee"
                type="select"
                value={assignments[index]?.employee_id || ""}
                options={employees.map((e) => ({
                  label: e.username,
                  value: e.id,
                }))}
                onChange={(e) =>
                  handleEmployeeChange(index, e.target.value)
                }
                error={!!errors[`employee_${index}`]}
                helperText={errors[`employee_${index}`]}
              />
            </Box>
          ))}

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      )}

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default AssignStaffAnEmployeeForm;
