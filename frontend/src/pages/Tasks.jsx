import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Header from "../components/Header";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import pl from "date-fns/locale/pl";

const Tasks = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [msg, setMsg] = useState("");

  const [tasksData, setTasksData] = useState([]);
  const [isTasksDataEmpty, setIsTasksDataEmpty] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [employeesData, setEmployeesData] = useState([]);
  const [isEmployeesDataEmpty, setIsEmployeesDataEmpty] = useState(true);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskEndDateForAdd, setTaskEndDateForAdd] = useState("");
  const [currentUserId, setCurrentUserId] = useState();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 765) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleChange = (event) => {
    setSelectedOption(parseInt(event.target.value));
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });


  const DisplayTasks = async () => {
    const response = await fetchData("/tasks/tasks", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      await setTasksData(data.taskData);
      if (data.taskData.length === 0) {
        setIsTasksDataEmpty(true);
      } else setIsTasksDataEmpty(false);
    }
  }

  const DisplayEmployees = async () => {
    const response = await fetchData("/user/employees", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      await setEmployeesData(data.employeesData);
      if (data.employeesData.length === 0) {
        setIsEmployeesDataEmpty(true);
      } else setIsEmployeesDataEmpty(false);
    }
  }

  const DisplayCurrentUserId = async () => {
    const response = await fetchData("/user/display-current-user-id", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      setCurrentUserId(data.userID);
    }
  }

  const ToggleTask = async (taskID) => {
    const response = await fetchData("/tasks/tasks", "PATCH", { taskID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      DisplayTasks();
    }
  }

  const AddTasks = async () => {
    let userID = selectedOption;
    let taskEndDate = new Date(taskEndDateForAdd).getDate().toString().padStart(2, '0') + "." + (new Date(taskEndDateForAdd).getMonth() + 1).toString().padStart(2, '0') + "." + new Date(taskEndDateForAdd).getFullYear()
    const response = await fetchData("/tasks/tasks", "POST", { taskDescription, taskEndDate, userID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      setTaskDescription("");
      setTaskEndDateForAdd("");
      DisplayTasks();
    }
  }

  useEffect(() => {
    DisplayTasks();
    DisplayEmployees();
    DisplayCurrentUserId();
  }, [])

  useEffect(() => {// useEffect is to prevent to many rerenders
    if (employeesData.length > 0) {
      setSelectedOption(employeesData[0].userID); //default value for select list 
    }
  }, [employeesData]);

  return (
    <>
      <Header logout={logout} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <section className="w-full flex flex-col lg:flex-row justify-center">
        {user.userTypeName === LOCAL_STORAGE.ADMIN ? (
          <div className="flex flex-col w-full lg:w-[40%] p-5 sm:p-10 gap-5 items-center">
            <p className="self-start text-2xl md:ml-5">Dodaj zadanie</p>
            <div className="w-full sm:w-96">
              <p className="">Opis </p>
              <input onChange={(e) => { setTaskDescription(e.target.value) }} value={taskDescription} className="w-full bg-gray-300 p-2 rounded-md border border-gray-500 focus:border-gray-500 text-gray-700" type="text"></input>
            </div>
            <div className="relative w-64 h-10">
              <div className="absolute">
                <DatePicker dateFormat="dd/MM/yyyy" locale={pl} minDate={new Date()} selected={taskEndDateForAdd} placeholderText="Wybierz datę końcową" onChange={(date) => { setTaskEndDateForAdd(date) }} className="text-gray-700 placeholder:text-gray-700 rounded-md shadow-sm  bg-gray-300 py-2 px-2 pl-10 w-full border border-gray-500 focus:border-gray-500" />
              </div>
              <svg className="w-4 text-gray-500 dark:text-gray-400 absolute top-[12px] left-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <div className="w-full sm:w-96">
              <p>Wyznacz osobę</p>
              <select
                id="person"
                value={selectedOption}
                onChange={handleChange}
                className="block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none  border-gray-500 bg-gray-300"
              >
                {employeesData && employeesData.map((item, index) => (
                  <option key={index} value={item.userID}>{item.userName}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-2 w-full w-72 sm:w-96 ">
              <button className="font-semibold bg-green-600 text-gray-100 hover:bg-green-500 duration-200 w-full rounded-md py-2" onClick={() => { AddTasks() }}>Dodaj zadanie</button>
            </div>
          </div>) : null}
        <div className={` ${user.userTypeName === LOCAL_STORAGE.WORKER ? "w-full lg:w-[70%] flex flex-col items-center px-5 pt-10" : "lg:w-[60%] w-full  pt-10 px-5 md:px-8"}`} >
          <p className={` text-2xl mb-8 ${user.userTypeName === LOCAL_STORAGE.WORKER ? "self-start lg:w-[70%] w-full" : "w-full"}`}>Harmonogram</p>
          {tasksData && tasksData.map((item, index) => (
            <article key={index} className={`w-full flex flex-col md:justify-between border-2 border-gray-300 rounded-lg p-5 bg-gray-200 mb-2`}>
              <div className="flex flex-col 2xl:flex-row justify-between">
                <div className="flex flex-col">
                  <p className=" text-gray-500">ID:</p>
                  <p>{item.taskID}</p>
                </div>
                <div className="flex flex-col">
                  <p className=" text-gray-500">Dla osoby:</p>
                  <p>{item.userName}</p>
                </div>
                <div className="flex flex-col xl:w-80">
                  <p className="mr-2 text-gray-500">Opis:</p>
                  <p>{item.taskDescription}</p>
                </div>
                <div className="flex flex-col ">
                  <p className=" text-gray-500">Deadline:</p>
                  <p>{item.taskEndDate}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500">Stan zadania</p>
                  <p className={`${item.taskState === 1 ? "text-green-600" : "text-red-700"}`}>{item.taskState === 1 ? "wykonano" : "niewykonano"}</p>
                </div>
              </div>
              <div className="self-end flex flex-row mt-5">
                {item.taskState === 0 && item.userID === currentUserId ? (
                  <button className=" mx-auto border px-2 py-2 cursor-pointer bg-green-600 hover:bg-green-700 duration-200 rounded-md text-gray-200" onClick={() => { ToggleTask(item.taskID) }}>oznacz jako wykonane</button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Tasks