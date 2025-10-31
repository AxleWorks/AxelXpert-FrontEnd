import EmployeeLayout from "../../layouts/employee/EmployeeLayout";
import { EmployeeTasks } from "../../components/employee/EmployeeTasks";

const EmployeeTasksPage = () => {
  return (
    <EmployeeLayout>
      <EmployeeTasks />
    </EmployeeLayout>
  );
};

export default EmployeeTasksPage;
