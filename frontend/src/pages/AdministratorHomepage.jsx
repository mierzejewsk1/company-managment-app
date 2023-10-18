import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { EditEmployee } from "../../../backend/controllers/userController";

const AdministratorHomepage = () => {
  const { user } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [employeesData, setEmployeesData] = useState([]);
  const [isEmplyeesDataEmpty, setIsEmployeesDataEmpty] = useState(true);
  const [msg, setMsg] = useState("");
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);

  // to edit data
  const [employeeID, setEmployeeID] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // to add data
  const [userNameForAdd, setUserNameForAdd] = useState("");
  const [userEmailForAdd, setUserEmailForAdd] = useState("");
  const [userPasswordForAdd, setUserPasswordForAdd] = useState("");


  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 765) {
      setIsMenuOpen(true);
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
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
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
      DisplayEmployees();
    }
  }

  useEffect(() => {
    DisplayEmployees();
  }, [])

  return (
    <>
      <div className="">
        <header className={`w-full md:h-16 border-b-2 bg-gray-300  relative py-5 ${isMenuOpen === false ? "h-16" : ""}`}>
          {isMenuOpen === true ? (
            <nav className="flex justify-center">
              <ul className="flex flex-col gap-5 md:flex-row text-center">
                <li>Strona główna</li>
                <li>Pracownicy</li>
                <li>Stanowiska</li>
                <li>Wiadomości</li>
                <li>Harmonogram</li>
              </ul>
            </nav>
          ) : null}
          <div className="absolute top-0 right-5 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} >
            <button>menu</button>
          </div>
        </header>
        <section className="w-full flex flex-col lg:flex-row">
          <div className="flex flex-col lg:w-[40%] p-5 sm:p-10 gap-5 items-center ">
            <p className="self-start text-2xl md:ml-5">Dodaj pracownika</p>
            <div>
              <p className="sm:w-96 self-start">Imie i nazwisko </p>
              <input onChange={(e) => { setUserNameForAdd(e.target.value) }} className="w-72 sm:w-96 bg-gray-300 p-2 rounded-md" type="text"></input>
            </div>
            <div>
              <p>Adres email </p>
              <input onChange={(e) => { setUserEmailForAdd(e.target.value) }} className="w-72 sm:w-96  bg-gray-300 p-2 rounded-md" type="text"></input>
            </div>
            <div>
              <p>Hasło </p>
              <input onChange={(e) => { setUserPasswordForAdd(e.target.value) }} className="w-72 sm:w-96  bg-gray-300 p-2 rounded-md" type="password"></input>
            </div>
            <button onClick={() => { CreateEmployee() }}></button>

          </div>
          <div className="lg:w-[60%] w-full h-[300px] lg:h-[500px] pt-10 px-5 md:px-8" >
            <p className=" self-start text-2xl mb-8">Pracownicy</p>
            {employeesData && employeesData.map((item, index) => (
              <article key={index} className={`w-full flex flex-col md:flex-row md:justify-between border-2 border-gray-300 rounded-lg p-5 bg-gray-200`}>
                <div>
                  <div className="flex flex-row sm:flex-col">
                    <p>Imie i nazwisko:</p>
                    <p>{item.userName}</p>
                  </div>
                  <div className="flex flex-row md:flex-col">
                    <p>Email:</p>
                    <p>{item.userEmail}</p>
                  </div>
                  <div className="flex flex-row md:flex-col">
                    <p>Typ użytkownika:</p>
                    <p>{item.userTypeID}</p>
                  </div>
                  <div className="flex flex-row md:flex-col">
                    <p>Stanowisko:</p>
                    <p>Programista</p>
                  </div>
                  <div className="flex flex-row md:flex-col">
                    <p>Nr stanowiska:</p>
                    <p>103</p>
                  </div>
                  <div className="flex flex-row  gap-2">
                    <button onCick={() => { setEmployeeID(item.userID); setUserEmail(item.userEmail); setUserName(item.userName); setIsEditEmployeeOpen(true) }}>Edytuj</button>
                    <button onClick={() => DeleteEmployee(item.userID)}>Usuń</button>
                  </div>
                </div>
                {isEditEmployeeOpen === true ? (
                  <div>
                    <div>
                      <p className="sm:w-96 self-start">Imie i nazwisko </p>
                      <input onChange={(e) => setUserName(e.target.value)} value={userName} className="w-72 sm:w-96 bg-gray-300 p-2 rounded-md" type="text"></input>
                    </div>
                    <div>
                      <p>Email </p>
                      <input onChange={(e) => setUserEmail(e.target.value)} value={userEmail} className="w-72 sm:w-96  bg-gray-300 p-2 rounded-md" type="text"></input>
                    </div>
                    <button onClick={() => { EditEmployee() }}></button>
                  </div>
                ) : null}
              </article>
            ))}
            {/* <article className="w-full flex flex-col md:flex-row md:justify-between border-2 border-gray-300 rounded-lg p-5 bg-gray-200">

            </article> */}
          </div>
        </section>
      </div>
    </>
  )
}

export default AdministratorHomepage