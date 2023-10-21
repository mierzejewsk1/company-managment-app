import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";

const Header = (props) => {
  return (
    <header className={`w-full md:h-16 border-b-2 bg-gray-300  relative py-5 px-5  ${props.isMenuOpen === false ? "h-16" : ""} flex justify-between items-center`}>
      <div className="md:hidden self-start" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)} >
        {props.isMenuOpen ? (<AiOutlineClose className="w-7 h-7 hover:cursor-pointer" />) : (<RxHamburgerMenu className="w-7 h-7 hover:cursor-pointer" />)}
      </div>
      <nav className="flex">
        <ul className={`flex ${props.isMenuOpen === true ? "flex flex-col md:flex-row" : "hidden md:flex md:flex-row"} gap-5 text-center`}>
          <li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Strona główna</li>
          <li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Pracownicy</li>
          <li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Stanowiska</li>
          <li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Wiadomości</li>
          <li className="hover:bg-white p-2 rounded-md duration-200 cursor-pointer">Harmonogram</li>
        </ul>
      </nav>
      <IoIosLogOut className="w-7 h-7 self-start hover:cursor-pointer" onClick={props.logout} />
    </header>
  )
}

export default Header