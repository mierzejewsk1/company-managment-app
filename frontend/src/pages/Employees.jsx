import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Header from "../components/Header";

const Employees = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [employeesData, setEmployeesData] = useState([]);
  const [isEmployeesDataEmpty, setIsEmployeesDataEmpty] = useState(true);
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

  const DeleteEmployee = async (employeeID) => {
    const response = await fetchData("/user/employee", "DELETE", { employeeID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg)
      DisplayEmployees();
    }
  }

  const EditEmployee = async () => {
    const response = await fetchData("/user/employee", "PATCH", { employeeID, userName, userEmail }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      DisplayEmployees();
    }
  }

  const CreateEmployee = async () => {
    let userName = userNameForAdd;
    let email = userEmailForAdd;
    let password = userPasswordForAdd;
    const response = await fetchData("/user/employee", "POST", { email, userName, password }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      setUserEmailForAdd("")
      setUserNameForAdd("");
      setUserPasswordForAdd("");
      DisplayEmployees();
    }
  }

  useEffect(() => {
    DisplayEmployees();
  }, [])

  return (
    <>
      <Header logout={logout} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <section className="w-full flex flex-col lg:flex-row">
        <div className="flex flex-col w-full lg:w-[40%] p-5 sm:p-10 gap-5 items-center">
          <p className="self-start text-2xl md:ml-5">Dodaj pracownika</p>
          <div className="w-full sm:w-96">
            <p className="">Imię i nazwisko: </p>
            <input onChange={(e) => { setUserNameForAdd(e.target.value) }} value={userNameForAdd} className="w-full bg-gray-300 p-2 rounded-md" type="text"></input>
          </div>
          <div className="w-full sm:w-96">
            <p>Adres email: </p>
            <input onChange={(e) => { setUserEmailForAdd(e.target.value) }} value={userEmailForAdd} className="w-full bg-gray-300 p-2 rounded-md" type="text"></input>
          </div>
          <div className="w-full sm:w-96">
            <p>Hasło: </p>
            <input onChange={(e) => { setUserPasswordForAdd(e.target.value) }} value={userPasswordForAdd} className="w-full bg-gray-300 p-2 rounded-md" type="password"></input>
          </div>
          <div className="flex flex-row gap-2 w-full w-72 sm:w-96 ">
            <button className="font-semibold bg-green-600 text-gray-100 hover:bg-green-500 duration-200 w-full rounded-md py-2" onClick={() => { CreateEmployee() }}>Dodaj</button>
          </div>
        </div>
        <div className="lg:w-[60%] w-full h-[300px] lg:h-[500px] pt-10 px-5 md:px-8" >
          <p className=" self-start text-2xl mb-8">Pracownicy</p>
          {employeesData && employeesData.map((item, index) => (
            <article key={index} className={`w-full flex flex-col md:justify-between border-2 border-gray-300 rounded-lg p-5 bg-gray-200 mb-2`}>
              <div className="flex flex-col 2xl:flex-row justify-between">
                <div className="flex flex-col">
                  <p className="mr-2 text-gray-500">Imie i nazwisko:</p>
                  <p>{item.userName}</p>
                </div>
                <div className="flex flex-col ">
                  <p className="mr-2 text-gray-500">Email:</p>
                  <p>{item.userEmail}</p>
                </div>
                <div className="flex flex-col ">
                  <p className="mr-2 text-gray-500">Typ użytkownika:</p>
                  <p>{item.userTypeID}</p>
                </div>
                <div className="flex flex-col ">
                  <p className="mr-2 text-gray-500">Stanowisko:</p>
                  <p>Programista</p>
                </div>
                <div className="flex flex-col">
                  <p className="mr-2 text-gray-500">Nr stanowiska:</p>
                  <p>103</p>
                </div>
                {employeeID !== item.userID ? (
                  <div className="flex flex-row  gap-2">
                    <button className="font-semibold text-green-500 hover:text-green-600 duration-200" onClick={() => { setEmployeeID(item.userID); setUserEmail(item.userEmail); setUserName(item.userName); setIsEditEmployeeOpen(true) }}>Edytuj</button>
                    <button className="font-semibold text-red-500 hover:text-red-600 duration-200" onClick={() => { setIsEditEmployeeOpen(false); setIsDeleteEmployeeOpen(true); setEmployeeID(item.userID) }}>Usuń</button>
                  </div>
                ) : (null
                )}
              </div>
              {isEditEmployeeOpen === true && employeeID === item.userID ? (
                <div className="mt-12 flex flex-col gap-3">
                  <p className="text-2xl mb-5">Edytuj dane użytkownika</p>
                  <div>
                    <p className="sm:w-96 self-start">Imie i nazwisko </p>
                    <input onChange={(e) => setUserName(e.target.value)} value={userName} className="w-72 sm:w-96 bg-gray-300 p-2 rounded-md" type="text"></input>
                  </div>
                  <div>
                    <p>Email </p>
                    <input onChange={(e) => setUserEmail(e.target.value)} value={userEmail} className="w-72 sm:w-96  bg-gray-300 p-2 rounded-md" type="text"></input>
                  </div>
                  <div>
                    <button className="font-semibold text-green-500 hover:text-green-600 duration-200 mr-5" onClick={() => { EditEmployee(); setIsEditEmployeeOpen(false); setEmployeeID(); }}>Zapisz</button>
                    <button className="font-semibold text-red-500 hover:text-red-600 duration-200" onClick={() => { setIsEditEmployeeOpen(false); setEmployeeID(); }}>Anuluj</button>
                  </div>
                </div>
              ) : null}
              {isDeleteEmployeeOpen === true && employeeID === item.userID ? (
                <div className="mt-12 flex flex-col gap-2">
                  <p className="text-xl">Czy na pewno chcesz usunąć tego użytkownika?</p>
                  <div>
                    <button className="font-semibold text-green-500 hover:text-green-600 duration-200 mr-5" onClick={() => { DeleteEmployee(item.userID); setIsDeleteEmployeeOpen(false); setEmployeeID(); }}>Tak</button>
                    <button className="font-semibold text-red-500 hover:text-red-600 duration-200" onClick={() => { setIsDeleteEmployeeOpen(false); setEmployeeID(); }}>Nie</button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Employees