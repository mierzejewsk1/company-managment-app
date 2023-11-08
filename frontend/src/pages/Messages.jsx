import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Header from "../components/Header";
import { MdOutlineCancel } from "react-icons/md";


const Messages = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [employeesData, setEmployeesData] = useState([]);
  const [isEmployeesDataEmpty, setIsEmployeesDataEmpty] = useState(true);
  const [msg, setMsg] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipientID, setRecipientID] = useState(0);
  const [messagesData, setMessagesData] = useState();
  const [isMessagesDataEmpty, setIsMessagesDataEmpty] = useState(true);
  const [messageRecipientName, setMessageRecipientName] = useState();
  const [messageDescription, setMessageDescription] = useState("");


  const DisplayMessages = async () => {
    const response = await fetchData("/message/messages", "POST", { recipientID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      setMessagesData(data.messagesData);
      console.log(data.messagesData);
      if (data.messagesData.length === 0) {
        setIsMessagesDataEmpty(true);
      } else setIsMessagesDataEmpty(false);
    }
  }

  const SendMessage = async () => {
    const response = await fetchData("/message/message", "POST", { recipientID, messageDescription }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      setMsg(data.msg)
      setMessageDescription("");
      DisplayMessages();

    }
  }

  const DeleteMessage = async (messageID) => {
    const response = await fetchData("/message/delete-message", "DELETE", { messageID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      setMsg(data.msg)
      DisplayMessages();

    }
  }

  useEffect(() => {
    if (recipientID !== 0) {
      DisplayMessages();
    }
  }, [recipientID]);


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

  useEffect(() => {
    DisplayEmployees();
  }, [])

  return (
    <>
      <Header logout={logout} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <section className="w-full flex flex-col lg:flex-row">
        <div className="flex flex-col w-full lg:w-[20%] px-5 py-4 items-center h-[550px] overflow-y-scroll">
          <p className="self-start mb-5 text-2xl ">Adresaci</p>
          {employeesData && employeesData.map((item, index) => (
            <article key={index} className={`w-full flex flex-col md:justify-between rounded-lg p-2 bg-gray-200 mb-2 ${recipientID === item.userID ? "border-2 border-green-500" : " border-2 border-gray-300"}`}>
              <div onClick={() => { setRecipientID(item.userID); setMessageRecipientName(item.userName) }} className="flex flex-col 2xl:flex-row justify-between cursor-pointer">
                <div className="flex flex-col">
                  <p className="mr-2 text-gray-500">Imie i nazwisko:</p>
                  <p>{item.userName}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="lg:w-[80%] 2xl:w-[1500px] w-full h-[300px] lg:h-[300px] mr-5">
          {messageRecipientName && <p className=" self-start text-2xl my-2 shadow-md py-2 pl-10">Wiadomości z {messageRecipientName}</p>}
          {messagesData && (
            <div className="w-full h-[500px] pt-10 px-5 md:px-8 flex flex-col relative overflow-y-scroll py-5" >
              {messagesData && messagesData.map((item, index) => (
                <article key={index} className={`w-[60%] sm:w-[500px] flex flex-col border-2 border-gray-300 rounded-lg p-5 bg-gray-200 mb-2 ${recipientID === item.recipientID ? "self-start" : "self-end"} bg-green-100`}>
                  <div className="flex flex-col 2xl:flex-row justify-between">
                    <div className="flex flex-col">
                      <p className="mr-2 text-gray-500">{recipientID === item.recipientID ? "Ty" : `${messageRecipientName}`}</p>
                      <p>{item.messageDescription}</p>
                    </div>
                    {item.userID !== recipientID ? (<button onClick={() => { DeleteMessage(parseInt(item.messageID)) }}><MdOutlineCancel className="w-5 h-5" /></button>) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
          {recipientID && (
            <div className="mx-2 mb-2 lg:mx-0 lg:mb-0 flex gap-2 items-center ">
              <textarea id="description" name="description" placeholder="Wyślij wiadomość" required="required" value={messageDescription} onChange={(e) => { setMessageDescription(e.target.value) }}
                className="w-full  text-black rounded-md py-1.5  border-2 border-[#30363d] bg-inputColors-100 ring-inset ring-gray-300 placeholder:text-gray-400 
                focus:ring-basic-100 outline-none px-2 resize-none mt-2 text-md"></textarea>
              <button onClick={() => { messageDescription !== "" ? SendMessage() : setMsg("Wiadomość jest pusta") }} className="w-[30%] bg-green-500 rounded-md py-3">Wyślij</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Messages