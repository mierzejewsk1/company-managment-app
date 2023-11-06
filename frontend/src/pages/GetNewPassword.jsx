import { useState } from "react";
import { SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useLocation } from 'react-router-dom';

const GetNewPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const resetToken = query.get('token');
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState("");

  const ResetPassword = async (e) => {
    e.preventDefault();
    const response = await fetchData("/user/reset-password", "PATCH", { resetToken, password, password2 }, null, false);
    if (response[1] !== SERVER_CODE.OK) {
      setMsg(response[2]);
    } else {
      window.location.href = '/';
    }
    setPassword("");
    setPassword2("");

  };
  return (
    <div className="bg-gray-400 h-screen flex justify-center items-center w-screen">
      <div className="flex-col items-center justify-center h-fit max-h-full px-5 py-12 border rounded-xl w-4/5 md:w-3/5 lg:w-2/5 xl:w-[400px] bg-gray-200 border border-gray-400">
        <h2 className="mb-10 text-3xl text-center">Zmiana hasła</h2>
        <form className="w-full" onSubmit={ResetPassword}>
          {msg && (
            <div className="w-full p-3 bg-red-700 rounded-md text-sm mb-5 text-gray-100 border-2 border-red-800">
              <p>{msg}</p>
            </div>
          )}
          <label className="w-full my-2 " htmlFor="password">Nowe hasło: </label>
          <br />
          <input
            className="ww-full my-2 mb-5 p-1 bg-gray-300 rounded-md p-2 border border-gray-400"
            type="password"
            id="password"
            name="password"
            placeholder="hasło"
            onChange={(e) => { setPassword(e.target.value); }}
            required />
          <br />
          <label className="w-full my-2" htmlFor="password2">Powtórz hasło: </label>
          <br />
          <input
            className="w-full my-2 mb-5 p-1 bg-gray-300 rounded-md p-2 border border-gray-400"
            type="password"
            id="password"
            name="password2"
            placeholder="hasło"
            onChange={(e) => { setPassword2(e.target.value); }}
            required />
          <br />
          <input className="w-full mx-auto border px-2 py-2 cursor-pointer bg-green-600 hover:bg-green-700 duration-200 rounded-md text-gray-200" type="submit" value="Zmień" />
        </form>
      </div>
    </div>
  )
}

export default GetNewPassword