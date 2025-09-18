import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, } from 'firebase/auth'
import { auth } from "../../firebase";


export const Login = () => {
    const [passwordType, setPasswordType] = useState('password');
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const [formInputType, setFormInputType] = useState({
        email: "",
        password: ""
    });

    const logIn = async (e) => {
        e.preventDefault(); // prevent default first

        try {
            await signInWithEmailAndPassword(auth, formInputType.email, formInputType.password);
            console.log("Login successfully");
            navigate('/dashboard'); // Navigate to dashboard on successful login
        } catch (error) {
            if (error.code === 'auth/network-request-failed') {
                setErrors("Network error. Please disable ad blockers or try a different browser.");
            } else {
                setErrors(error.message);
            }
            return; // prevent continuing to reset form on failed login
        }

        // Reset form and state only if login is successful
        setFormInputType({
            email: "",
            password: ""
        });
        setPasswordType('password');
        setErrors(null);
    };

    const HandleOnChange = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        setFormInputType({
            ...formInputType,
            [name]: value,
        });
    };

    return (

        <div className="grid     md:grid-cols-2  md:overflow-hidden">
            <img src="/img/Login2.jpg" className="w-full md:h-auto object-cover md:w-3/4 mx-auto " alt="Login Image" />


            <div className="w-full flex flex-col  p-8 md:p-16  justify-center   ">
                <p className="text-gray-500 font-semibold text-lg md:text-xl   ">Now Log-In Here</p>

                <form className="mt-8 space-y-2" onSubmit={logIn}>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            onChange={HandleOnChange}
                            required
                            name="email"
                            placeholder="Enter your email"
                            className="p-3 border border-gray-300 rounded w-full md:w-70"
                        />
                    </div>

                    <div className="flex flex-col relative">
                        <label className="font-semibold mb-2">Password</label>
                        <input
                            type={passwordType}
                            onChange={HandleOnChange}
                            autoComplete="current-password"
                            required
                            name="password"
                            placeholder="********"
                            className="p-3 border border-gray-300 rounded w-full md:w-70"
                        />

                        <button
                            type="button"
                            onClick={() => setPasswordType(passwordType === "password" ? 'text' : "password")}
                            className="absolute top-11 right-4 w-8 h-8 rounded-full hover:bg-blue-200 hover:text-blue-600"
                        >
                            {passwordType === "password" ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-8 rounded bg-purple-600 text-white font-semibold hover:bg-rose-600 transition duration-500 ease-in-out"
                    >
                        Login
                    </button>


                </form>

                <span className="mt-2 text-center md:text-left">
                    Don't have an account ? {' '}
                    <span>
                        <Link to="/signup" className="text-blue-400 hover:text-blue-500 space-x-1">
                            Register Now
                        </Link>
                    </span>

                </span>

                {errors && (
                    <div className="bg-red-700 py-2 px-4 rounded text-white font-semibold mt-4 animate__animated animate__bounce">
                        {errors}
                    </div>
                )}
            </div>
        </div>
    );
};






 