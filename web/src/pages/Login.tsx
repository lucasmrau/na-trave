import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleNotch, Eye, EyeSlash } from "phosphor-react";
import { useFormik } from "formik";
import * as yup from 'yup'

import { Header } from "../components/Header";
import { IconBack } from "../components/IconBack";
import { AuthContext } from "../context/AuthContext";

const validationSchema = yup.object({
  email: yup.string().email('Valid email!').required('Required field'),
  password: yup.string().required('Required field'),
})

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { user, handleSignIn } = useContext(AuthContext)
  const navigate = useNavigate();

  const formik = useFormik({
    onSubmit: async values => {
      try {
        await handleSignIn(values)
      } catch (error) {
        formik.setStatus('User or password invalid!')
      }
    },
    validationSchema,
    validateOnMount: true,
    initialValues: {
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    if(user) {
      navigate('/dashboard')
    }
  }, [user])
  
  return (
    <div className="flex flex-col items-center w-full">
      <Header logo="/logo-login.svg" isLoginPage />

      <main className="py-8 px-5 gap-8 w-full max-w-[600px]">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-red-500">
            <IconBack />
          </Link>
          <h2 className="text-red-700 font-bold text-xl">Login</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 flex flex-col">
        {formik.status && <p className="text-red-500 text-sm text-center">{formik.status}</p>}
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="email"
              className="text-sm text-gray-500"
            >
              Email
            </label>
            <input 
              type="text" 
              id="email"
              placeholder="Type your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              className="border border-gray-500 p-3 rounded-2xl placeholder:text-gray-700 text-red-700 focus:outline-red-500"
            />
            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p> }
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label 
              htmlFor="password"
              className="text-sm text-gray-500"
            >
              Password
            </label>

            <div className="relative flex w-full rounded-md shadow-sm">
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Type your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                className="block w-full border border-gray-500 p-3 rounded-2xl placeholder:text-gray-700 text-red-700 focus:outline-red-500"
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeSlash className="text-red-300" weight="bold" size={20}/>
                  : 
                  <Eye className="text-red-300" weight="bold" size={20}/>
                }
                
              </button>
            </div>
              {formik.touched.password && formik.errors.password && <p className="text-red-500 text-sm">{formik.errors.password}</p> }
          </div>

          <button 
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="bg-red-500 rounded-2xl text-white px-5 py-3 md:px-6 md:py-4 mt-8 font-bold hover:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {
            formik.isSubmitting ? 
              <CircleNotch 
                size={24}
                weight="bold" 
                className="animate-spin text-white mx-auto" 
              /> 
              : 'Login'
            } 
          </button>
        </form>
      </main>
    </div>
  )
}