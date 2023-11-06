import { useState, useEffect } from "react";
import { LOCAL_STORAGE, SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Header from "../components/Header";

const NewsPage = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [newsData, setNewsData] = useState([]);
  const [isNewssDataEmpty, setIsNewsDataEmpty] = useState(true);
  const [msg, setMsg] = useState("");

  // state to add data
  const [newsDescription, setNewsDescription] = useState("");
  const [targetGroupID, setTargetGroupID] = useState(1);


  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 765) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleChange = (event) => {
    setTargetGroupID(parseInt(event.target.value));
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const DisplayNews = async () => {
    const response = await fetchData("/news/news", "GET", {}, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);  // error message is here in response[2]
      console.log("DisplayNews ", response[2])
    } else {
      const data = await response[0].json();  // response[0] contain data returned from server
      await setNewsData(data.newsData);
      if (data.newsData.length === 0) {
        setIsNewsDataEmpty(true);
      } else setIsNewsDataEmpty(false);
    }
  }

  const DeleteNews = async (newsID) => {
    const response = await fetchData("/news/news", "DELETE", { newsID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg)
      DisplayNews();
    }
  }

  const PublishNews = async () => {
    const response = await fetchData("/news/news", "POST", { newsDescription, targetGroupID }, user.token, true);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
      console.log("PublishNews ", response[2]);
    } else {
      const data = await response[0].json();
      setMsg(data.msg);
      setNewsDescription("");
      DisplayNews();
    }
  }

  useEffect(() => {
    DisplayNews();
    console.log(user.userTypeName)
  }, [])

  return (
    <>
      <Header logout={logout} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <section className="w-full flex flex-col lg:flex-row">
        {user.userTypeName === LOCAL_STORAGE.ADMIN ? (
          <div className="flex flex-col w-full lg:w-[40%] p-5 sm:p-10 gap-5 items-center">
            <p className="self-start text-2xl md:ml-5">Opublikuj ogłoszenie</p>
            <div className="w-full sm:w-96">
              <p className="">Opis </p>
              <input onChange={(e) => { setNewsDescription(e.target.value) }} value={newsDescription} className="w-full bg-gray-300 p-2 rounded-md" type="text"></input>
            </div>
            <div className="w-full sm:w-96">
              <p>Widoczność wiadomości</p>
              <select
                id="visibility"
                value={targetGroupID}
                onChange={handleChange}
                className="block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value={1}>Wszyscy</option>
                {user.userTypeName === "Admin" ?
                  <option value={2}>Tylko Administratorzy</option>
                  : null}
              </select>
            </div>
            <div className="flex flex-row gap-2 w-full w-72 sm:w-96 ">
              <button className="font-semibold bg-green-600 text-gray-100 hover:bg-green-500 duration-200 w-full rounded-md py-2" onClick={() => { PublishNews() }}>Opublikuj</button>
            </div>
          </div>) : null}
        <div className={` h-[300px] lg:h-[500px] ${user.userTypeName === LOCAL_STORAGE.WORKER ? "w-full flex flex-col items-center px-5 pt-10" : "lg:w-[60%] w-full  pt-10 px-5 md:px-8"}`} >
          <p className={` text-2xl mb-8 ${user.userTypeName === LOCAL_STORAGE.WORKER ? "lg:w-[70%] w-full" : "w-full"}`}>Ogłoszenia</p>
          {newsData && newsData.map((item, index) => (
            <article key={index} className={` flex flex-col md:justify-between border-2 border-gray-300 rounded-lg p-5 bg-gray-200 mb-2 ${user.userTypeName === LOCAL_STORAGE.WORKER ? "lg:w-[70%] w-full" : "w-full"}`}>
              <div className="flex flex-col 2xl:flex-row justify-between">
                <div className="flex flex-col">
                  <p className="mr-2 text-gray-500">Opis</p>
                  <p>{item.newsDescription}</p>
                </div>
                {user.userTypeName === "Admin" ?
                  <div className="flex flex-row  gap-2">
                    <button className="font-semibold text-red-500 hover:text-red-600 duration-200" onClick={() => { DeleteNews(item.newsID) }}>Usuń</button>
                  </div>
                  : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default NewsPage