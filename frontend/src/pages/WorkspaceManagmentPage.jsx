import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Header from "../components/Header";
import WorkspaceQubicle from "../components/Workspace/WorkspaceQubicle";

const WorkspaceManagmentPage = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workspacesData, setWorkspacesData] = useState([]);
  const [isWorkspacesDataEmpty, setIsWorkspacesDataEmpty] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [isEmployeeDataEmpty, setIsEmployeeDataEmpty] = useState(true);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 765) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const DisplayWorkspaces= async () => {
    const response = await fetchData("/workspace/workspaces", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      
      const data = await response[0].json();  // response[0] contain data returned from server
      await setWorkspacesData(data.workspacesData);
      if (data.workspacesData.length === 0) {
        setIsWorkspacesDataEmpty(true);
      } else {setIsWorkspacesDataEmpty(false)
        console.log(workspacesData)
      };
    }
  }

  const DisplayAvailableEmployees= async () => {
    const response = await fetchData("/user/employees-without-workspace", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      
      const data = await response[0].json();  // response[0] contain data returned from server
      await setEmployeeData(data.employeesWithoutWorkspace);
      console.log("testuje ",employeeData)
      if (data.employeesWithoutWorkspace.length === 0) {
        setIsEmployeeDataEmpty(true);
      } else {setIsEmployeeDataEmpty(false)
        console.log("testuje2 ",employeeData)
      };
    }
  }

  const AddEmployeeToWorkspace = async (employeeID, workspaceID) => {
    console.log(employeeID, workspaceID)
    const response = await fetchData("/workspace/workspace", "POST", { employeeID, workspaceID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
      console.log("AddEmployeeToWorkspace ", response[2])
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      
    }
    DisplayWorkspaces();
    DisplayAvailableEmployees();
  }

  const DeleteEmployeeFromWorkspace = async (workspaceID) => {
    console.log(workspaceID)
    const response = await fetchData("/workspace/workspace", "DELETE", {workspaceID}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
      console.log("DeleteEmployeeFromWorkspace ", response[2])
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      
    }
    DisplayWorkspaces();
    DisplayAvailableEmployees();
  }

  const BlockWorkSpace = async (workspaceID) => {
    console.log(workspaceID)
    const response = await fetchData("/workspace/workspace-block", "PATCH", {workspaceID}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
      console.log("BlockWorkSpace ", response[2])
    } else {
      const data = await response[0].json();
     setMsg(data.msg);
      console.log(data)
    }
    DisplayWorkspaces();
  }

  const UnBlockWorkSpace = async (workspaceID) => {
    console.log(workspaceID)
    const response = await fetchData("/workspace/workspace-unblock", "PATCH", {workspaceID}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
      console.log("BlockWorkSpace ", response[2])
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      
    }
    DisplayWorkspaces();
  }

  useEffect(() => {
    DisplayWorkspaces();
    DisplayAvailableEmployees(); //could be better optimized if it was called after clicking workspace but w/e
  }, [])

  const pairedWorkspacesData = [];
  for (let i = 0; i < workspacesData.length; i+=4) {
    pairedWorkspacesData.push([workspacesData[i], workspacesData[i+1], workspacesData[i+2], workspacesData[i+3]]);
  }

  return (
    <>
      <Header
        logout={logout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
    <section className="w-full flex ">
    <div className="flex flex-row flex-wrap w-full h-100 pt-10 px-5 md:px-8 justify-center ">
      <p className="self-start text-2xl w-full mb-8">Stanowiska</p>
      {pairedWorkspacesData.map((pair, index) => (
        <div key={index} className="flex flex-col flex-wrap mx-5 my-5 ">
          <div className="flex flex-row flex-wrap ">
            <WorkspaceQubicle 
              workspace={pair[0]} 
              employeeData={employeeData} 
              addEmployeeToWorkspace = {AddEmployeeToWorkspace} 
              deleteEmployeeFromWorkspace={DeleteEmployeeFromWorkspace}
              displayAvailableEmployees = {DisplayAvailableEmployees}
              blockWorkSpace = {BlockWorkSpace}
              unBlockWorkSpace = {UnBlockWorkSpace}
            />

            {pair[1] && (
              <WorkspaceQubicle 
                workspace={pair[1]} 
                employeeData={employeeData} 
                addEmployeeToWorkspace = {AddEmployeeToWorkspace} 
                deleteEmployeeFromWorkspace={DeleteEmployeeFromWorkspace}
                displayAvailableEmployees = {DisplayAvailableEmployees}
                blockWorkSpace = {BlockWorkSpace}
                unBlockWorkSpace = {UnBlockWorkSpace}
              />
            )} 
          </div>
          <div className="flex flex-row flex-wrap">
            {pair[2] && (
              <WorkspaceQubicle 
                workspace={pair[2]} 
                employeeData={employeeData} 
                addEmployeeToWorkspace = {AddEmployeeToWorkspace} 
                deleteEmployeeFromWorkspace={DeleteEmployeeFromWorkspace}
                displayAvailableEmployees = {DisplayAvailableEmployees}
                blockWorkSpace = {BlockWorkSpace}
                unBlockWorkSpace = {UnBlockWorkSpace}
              />
            )}
            {pair[3] && (
              <WorkspaceQubicle 
                workspace={pair[3]} 
                employeeData={employeeData} 
                addEmployeeToWorkspace = {AddEmployeeToWorkspace} 
                deleteEmployeeFromWorkspace={DeleteEmployeeFromWorkspace}
                displayAvailableEmployees = {DisplayAvailableEmployees}
                blockWorkSpace = {BlockWorkSpace}
                unBlockWorkSpace = {UnBlockWorkSpace}
              />
            )}
        </div>
        </div>
      ))}
    </div>
  </section>
    </>
  );
}

export default WorkspaceManagmentPage