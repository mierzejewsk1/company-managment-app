import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { LOCAL_STORAGE } from "../config/Enum";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = (props) => {
  const { user } = useAuthContext();

  return (
    <header className={`w-full md:h-16 border-b-2 bg-gray-300  relative py-5 px-5  ${props.isMenuOpen === false ? "h-16" : ""} flex justify-between items-center`}>
      <div className="md:hidden self-start" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)} >
        {props.isMenuOpen ? (<AiOutlineClose className="w-7 h-7 hover:cursor-pointer" />) : (<RxHamburgerMenu className="w-7 h-7 hover:cursor-pointer" />)}
      </div>
      <nav className="flex">
        <ul className={`flex ${props.isMenuOpen === true ? "flex flex-col md:flex-row" : "hidden md:flex md:flex-row"} gap-5 text-center`}>
          <Link to="/news"><li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Strona główna</li></Link>
          {user.userTypeName === LOCAL_STORAGE.ADMIN ? <Link to="/employees"><li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Pracownicy</li></Link> : null}
          {user.userTypeName === LOCAL_STORAGE.ADMIN ? <Link to="/workspaces"><li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Stanowiska</li></Link> : null}
          <Link to="/"><li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Wiadomości</li></Link>
          <Link to="/tasks"><li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Harmonogram</li></Link>
        </ul>
      </nav>
      <IoIosLogOut className="w-7 h-7 self-start hover:cursor-pointer" onClick={props.logout} />
    </header>
  )
}

export default Header