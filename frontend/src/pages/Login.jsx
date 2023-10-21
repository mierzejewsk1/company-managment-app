import { useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_CODE } from "../config/Enum";
import { useAuthContext } from "../hooks/useAuthContext";
import { fetchData } from "../config/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authActions } = useAuthContext();
  const [msg, setMsg] = useState("");

  const Login = async (e) => {
    e.preventDefault();
    const response = await fetchData("/user/login", "POST", { email, password }, null, false);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      const data = await response[0].json();
      await authActions.login(data);
    }
    setPassword("");
  };

  return (
    <div className="bg-gray-400 h-screen flex justify-center items-center w-screen">
      <div className="flex-col items-center justify-center h-fit max-h-full px-5 py-12 border rounded-md w-4/5 md:w-3/5 lg:w-2/5 xl:w-[400px] bg-gray-200 border border-gray-400">
        <h2 className="mb-10 text-4xl text-center">Logowanie</h2>
        <form className="w-full" onSubmit={Login}>
          {msg && (
            <div className="w-full p-3 bg-red-700 rounded-md text-sm mb-5 text-gray-100 border-2 border-red-800">
              <p>{msg}</p>
            </div>
          )}
          <label className="w-full my-2" htmlFor="username">E-mail:</label>
          <br />
          <input
            className="w-full my-2 mb-5 p-1 bg-gray-300 rounded-md p-2 border border-gray-400"
            type="text"
            id="username"
            name="username"
            pattern="^.+@.+$"
            onChange={(e) => { setEmail(e.target.value) }}
            required />
          <br />
          <label className="w-full my-2" htmlFor="password">Hasło:</label>
          <br />
          <input
            className="w-full my-2 mb-2 p-1 bg-gray-300 rounded-md p-2 border border-gray-400"
            type="password"
            id="password"
            name="password"
            onChange={(e) => { setPassword(e.target.value); }}
            required />
          <br />
          <Link to="/reset-password" className="block text-xs underline text-right mb-8">
            Zapomniałeś hasła?
          </Link>
          <input className="w-full mx-auto border px-2 py-2 cursor-pointer bg-green-600 hover:bg-green-700 duration-200 rounded-md text-gray-200" type="submit" value="Zaloguj" />
        </form>
      </div>
    </div>
  )
}

export default Login