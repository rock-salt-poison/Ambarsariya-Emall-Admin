import { Route, Routes } from "react-router-dom";
import "./styles/style.scss";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import TodoSubpage from "./Components/Dashboard/ITManager/TodoSubpage";
import AuthLayout from "./Pages/AuthLayout";
import ToDo from "./Components/Dashboard/ITManager/ToDo";
import 'rsuite/DateRangePicker/styles/index.css';
import Account from "./Components/Dashboard/Accounts/Account";
import AccountDetails from "./Components/Dashboard/Accounts/AccountDetails";
import NoticeDetail from "./Components/Dashboard/ITManager/NoticeDetail";
import B2B from "./Components/Dashboard/Finance/B2B";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/todo/:page" element={<TodoSubpage />} />
        <Route path="/todo/notices/:title/:id" element={<NoticeDetail />} />
        <Route path="/accounts/:user_type" element={<Account />} />
        <Route path="/accounts/:user_type/:token" element={<AccountDetails />} />
        <Route path="/finance/:type" element={<B2B />} />
      </Route>
    </Routes>
  );
}

export default App;
