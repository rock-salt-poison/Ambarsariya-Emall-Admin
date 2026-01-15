import { Route, Routes } from "react-router-dom";
import "./styles/style.scss";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import TodoSubpage from "./Components/Dashboard/ITManager/TodoSubpage";
import AuthLayout from "./Pages/AuthLayout";
import ToDo from "./Components/Dashboard/ITManager/ToDo";
import "rsuite/DateRangePicker/styles/index.css";
import Account from "./Components/Dashboard/Accounts/Account";
import AccountDetails from "./Components/Dashboard/Accounts/AccountDetails";
import NoticeDetail from "./Components/Dashboard/ITManager/NoticeDetail";
import B2B from "./Components/Dashboard/Finance/B2B";
import SalesDashboard from "./Components/Dashboard/Sales/Manager/Dashboard";
import AssignTask from "./Components/Dashboard/Sales/Manager/AssignTask";
import SalesStaffDashboard from "./Components/Dashboard/Sales/Staff/StaffDashboard";
import StaffReport from "./Components/Dashboard/Sales/Staff/StaffReport";
import StaffDailyTaskReport from "./Components/Dashboard/Sales/Staff/StaffDailyTaskReport";
import ReportsSubmitted from "./Components/Dashboard/Sales/Staff/ReportsSubmitted";
import MarketingDashboard from "./Components/Dashboard/Marketing/Manager/Dashboard";
import MarketingStaffDashboard from "./Components/Dashboard/Marketing/Staff/StaffDashboard";
import MarketingStaffReportsSubmitted from "./Components/Dashboard/Marketing/Staff/MarketingStaffReportsSubmitted";
import MarketingStaffDailyTaskReport from "./Components/Dashboard/Marketing/Staff/MarketingStaffDailyTaskReport";
import MarketingAssignTask from "./Components/Dashboard/Marketing/Manager/MarketingAssignTask";
import MarketingStaffReport from "./Components/Dashboard/Marketing/Staff/MarketingStaffReport";
import MarketingStaffReportDetails from "./Components/Dashboard/Marketing/Manager/MarketingStaffReportDetails";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/sales-staff/my-tasks" element={<SalesStaffDashboard />} />
        <Route
          path="/sales-staff/my-tasks/:token"
          element={<StaffDailyTaskReport />}
        />
        <Route path="/sales/assign-task" element={<AssignTask />} />
        <Route path="/sales/staff-report" element={<StaffReport />} />
        <Route
          path="/sales-staff/reports-submitted"
          element={<ReportsSubmitted />}
        />
        <Route
          path="/sales-staff/reports-submitted/:task_token/:summary_group"
          element={<ReportsSubmitted />}
        />


        <Route path="/marketing" element={<MarketingDashboard />} />
        <Route
          path="/marketing-staff/my-tasks"
          element={<MarketingStaffDashboard />}
        />
        <Route
          path="/marketing-staff/my-tasks/:token"
          element={<MarketingStaffDailyTaskReport />}
        />
        <Route path="/marketing/assign-task" element={<MarketingAssignTask />} />
        <Route path="/marketing/staff-report" element={<MarketingStaffReport />} />
        <Route
          path="/marketing/staff-report-details/:summary_id"
          element={<MarketingStaffReportDetails />}
        />
        <Route
          path="/marketing-staff/reports-submitted"
          element={<MarketingStaffReportsSubmitted />}
        />
        <Route
          path="/marketing-staff/reports-submitted/:task_token/:summary_group"
          element={<MarketingStaffReportsSubmitted />}
        />

        <Route path="/todo/:page" element={<TodoSubpage />} />
        <Route path="/todo/notices/:title/:id" element={<NoticeDetail />} />
        <Route path="/accounts/:user_type" element={<Account />} />
        <Route
          path="/accounts/:user_type/:token"
          element={<AccountDetails />}
        />
        <Route path="/finance/:type" element={<B2B />} />
      </Route>
    </Routes>
  );
}

export default App;
