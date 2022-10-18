import { Link } from "react-router-dom";

export function PageNotFound() {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-8">
      <img src="/logo-login.svg" alt="" className="w-32 md:w-40" />
      <div className="flex flex-col md:flex-row w-full items-center justify-between max-w-4xl px-2 md:px-4">
        <img src="/goal-page-not-found.svg" alt="" className="w-full max-w-xs md:max-w-md lg:max-w-[600px]" />
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-[64px] font-bold">404</h1>
            <p className="text-xl">Page not found</p>
          </div>
          <Link to="/" className="bg-red-500 rounded-xl w-full text-center text-white px-5 py-3 md:px-6 md:py-4 mt-8 font-bold hover:bg-red-300">
            Back to main page
          </Link>
        </div>
      </div>
    </div>
  )
}