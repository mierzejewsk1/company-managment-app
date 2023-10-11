import { useState } from "react";
import { SERVER_CODE } from "../config/Enum";
import { fetchData } from "../config/Api";
import { useLocation } from 'react-router-dom';

const GetNewPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const resetToken = query.get('token');
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const ResetPassword = async (e) => {
    e.preventDefault();
    const response = await fetchData("/user/reset-password", "PATCH", { resetToken, password, password2 }, null, false);
    if (response[1] !== SERVER_CODE.OK) {
      console.log(response[2]);
    } else {
      window.location.href = '/';
    }
    setPassword("");
    setPassword2("");

  };
  return (
    <div className="bg-gradient-to-r from-sky-300 to-sky-900 h-screen flex justify-center items-center w-screen">
      <div className="flex-col items-center justify-center h-fit max-h-full px-5 py-12 border rounded-xl w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/5">
        <h2 className="mb-10 text-4xl">Zmiana hasła</h2>
        <form className="w-full" onSubmit={ResetPassword}>
          <label className="w-full my-2 text-white" htmlFor="password">Nowe hasło: </label>
          <br />
          <input
            className="w-full my-2 mb-2 p-1 bg-cyan-700 outline-none text-white placeholder:text-slate-400"
            type="password"
            id="password"
            name="password"
            placeholder="hasło"
            onChange={(e) => { setPassword(e.target.value); }}
            required />
          <br />
          <label className="w-full my-2 text-white" htmlFor="password2">Powtórz hasło: </label>
          <br />
          <input
            className="w-full my-2 mb-10 p-1  bg-cyan-700 outline-none text-white placeholder:text-slate-400"
            type="password"
            id="password"
            name="password2"
            placeholder="hasło"
            onChange={(e) => { setPassword2(e.target.value); }}
            required />
          <br />
          <input className="w-full mx-auto border px-2 py-1 cursor-pointer" type="submit" value="Zmień" />
        </form>
      </div>
    </div>
  )
}

export default GetNewPassword