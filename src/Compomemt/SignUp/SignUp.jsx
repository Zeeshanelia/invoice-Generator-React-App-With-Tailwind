
import React, { useState } from "react";
import { useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

// import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// const auth = getAuth(appConfig);

export const SignUp = () => { 
    const [passwordType, setPasswordType] = useState('password');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const fileInputRef = useRef(null)


    const [signUp, setSignUp] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state
        setLoader(true); // Start loading
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUp.email, signUp.password);
            updateProfile(auth.currentUser, { displayName: signUp.fullname });
            // Handle successful signup
            if (userCredential.user) {
                navigate('/'); // Redirect to home page
            }
        } catch (err) {
            // Handle specific Firebase errors
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Email already registered. Please login.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                default:
                    setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoader(false); // Stop loading
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUp(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
       
            <div className="grid  md:grid-cols-2  justify-center items-center   ">
                <img src="/img/signup.webp" className="w-full mt-0 md:h-[398px]  max-w-md mx-auto " alt="Sign Up" />

                <div className="flex flex-col  sm:items-center">
                    <h1 className="font-bold text-2xl md:text-2xl">New User</h1>
                    <p className="text-gray-400 text-center md:text-left">Create Id To Start your Invoice Generator</p>

                    <form className="mt-4 space-y-4" onSubmit={handleSignUp}>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Full Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                required
                                name="fullname"
                                value={signUp.fullname}
                                placeholder="Enter your full name"
                                className="p-2 border border-gray-300   rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                required
                                name="email"
                                value={signUp.email}
                                placeholder="Enter your email"
                                className="p-2 border border-gray-300   rounded"
                            />
                        </div>

                         <div className="flex flex-col " 
                         style={{ display: 'none'}}>

                            <label className="font-semibold mb-1">  </label>
                            <input
                               
                                ref={fileInputRef}
                                type="file"
                                required
                                name="file"
                                placeholder="Enter your email"
                                className="p-2 border border-gray-300   rounded"
                            />
                        </div>

                         <div className="flex flex-col " >
                            <label className="font-semibold mb-1">File  </label>
                            <input
                                onChange={ ()=> {fileInputRef.current.click }}
                                type="file"
                                required
                                name="file"
                                // value={signUp.file}
                                placeholder="Select your File"
                                className="p-2 border border-gray-300   rounded"
                            />
                        </div>



                        <div className="flex flex-col relative">
                            <label className="font-semibold mb-2">Password</label>
                            <input
                                onChange={handleChange}
                                type={passwordType}
                                required
                                name="password"
                                value={signUp.password}
                                placeholder="********"
                                className="p-2 border border-gray-300 w-[40vw] rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordType(prev => prev === "password" ? "text" : "password")}
                                className="absolute bottom-2 right-4 md:right-8 text-xl text-gray-600"
                            >
                                {passwordType === "password" ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loader}
                            className={`w-full p-2 rounded font-semibold ${loader ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        >
                            {loader ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <span className="mt-4 ">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-600">
                            Login
                        </Link>
                    </span>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error} 
                        </div>
                    )}
                </div>
            </div>
       
    );
};

