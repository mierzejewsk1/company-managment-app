// login page

import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="bg-gradient-to-r from-sky-300 to-sky-900 h-screen flex justify-center items-center w-screen">
    <div className="flex-col items-center justify-center h-fit max-h-full px-5 py-12 border rounded-xl w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/5">
      <h2 className="mb-10 text-4xl">Logowanie</h2>
      <form className="w-full" onSubmit={Login}>
        <label className="w-full my-2 text-white" htmlFor="username">E-mail:</label>
        <br />
        <input className="w-full my-2 mb-10 p-1 bg-cyan-700 text-white placeholder:text-slate-400 outline-none" type="text" id="username" name="username" pattern="^.+@.+$" placeholder="e-mail" required/>
        <br />

        <label className="w-full my-2 text-white" htmlFor="password">Hasło:</label>
        <br />
        <input className="w-full my-2 mb-2 p-1 bg-cyan-700 outline-none text-white placeholder:text-slate-400" type="password" id="password" name="password" placeholder="hasło" required/>
        <br />
        <Link to="/reset-password" className="block text-xs underline text-right mb-16 text-white hover:text-white">
            Zapomniałeś hasła?
        </Link>
        <input className="w-full mx-auto border px-2 py-1 cursor-pointer" type="submit" value="Zaloguj"/>
      </form>
    </div>
    </div>
  )
}

export default Login