import { useLogout } from "../hooks/useLogout";

const Home = () => {
  const { logout } = useLogout();
  return (
    <div>Home
      <button onClick={logout} className=" p-2 w-18 h-10 rounded-md">
        wyloguj
      </button>
    </div>
  )
}

export default Home