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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [workspacesData, setWorkspacesData] = useState([]);
  const [isWorkspacesDataEmpty, setIsWorkspacesDataEmpty] = useState(true);
  const [msg, setMsg] = useState("");
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isDeleteEmployeeOpen, setIsDeleteEmployeeOpen] = useState(false);
  // state to edit data
  const [employeeID, setEmployeeID] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  // state to add data
  const [userNameForAdd, setUserNameForAdd] = useState("");
  const [userEmailForAdd, setUserEmailForAdd] = useState("");
  const [userPasswordForAdd, setUserPasswordForAdd] = useState("");

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

  // const DeleteEmployee = async (employeeID) => {
  //   const response = await fetchData("/user/employee", "DELETE", { employeeID }, user.token, true);
  //   if (response[1] !== SERVER_CODE.OK) {
  //     setMsg(response[2]);
  //   } else {
  //     const data = await response[0].json();
  //     setMsg(data.msg)
  //     DisplayEmployees();
  //   }
  // }

  // const EditEmployee = async () => {
  //   const response = await fetchData("/user/employee", "PATCH", { employeeID, userName, userEmail }, user.token, true);
  //   if (response[1] !== SERVER_CODE.OK) {
  //     setMsg(response[2]);
  //   } else {
  //     const data = await response[0].json();
  //     setMsg(data.msg);
  //     DisplayEmployees();
  //   }
  // }

  // const CreateEmployee = async () => {
  //   let userName = userNameForAdd;
  //   let email = userEmailForAdd;
  //   let password = userPasswordForAdd;
  //   const response = await fetchData("/user/employee", "POST", { email, userName, password }, user.token, true);
  //   if (response[1] !== SERVER_CODE.OK) {
  //     setMsg(response[2]);
  //   } else {
  //     const data = await response[0].json();
  //     setMsg(data.msg);
  //     setUserEmailForAdd("")
  //     setUserNameForAdd("");
  //     setUserPasswordForAdd("");
  //     DisplayEmployees();
  //   }
  // }

  useEffect(() => {
    DisplayWorkspaces();
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
    <div className="flex flex-row flex-wrap w-full h-100 pt-10 px-5 md:px-8 bg-red-200 ">
      <p className="self-start text-2xl w-full mb-8">Stanowiska</p>
      {pairedWorkspacesData.map((pair, index) => (
        <div key={index} className="flex flex-col flex-wrap mx-5 my-5">
          <div className="flex flex-row flex-wrap">
            <WorkspaceQubicle workspace={pair[0]} />

            {pair[1] && (
              <WorkspaceQubicle workspace={pair[1]} /> 
            )} 
          </div>
          <div className="flex flex-row flex-wrap">
            {pair[2] && (
              <WorkspaceQubicle workspace={pair[2]} />
            )}
            {pair[3] && (
              <WorkspaceQubicle workspace={pair[3]} />
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