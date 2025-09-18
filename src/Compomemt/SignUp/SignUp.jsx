import { useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";


export const SignUp = () => {
    const [passwordType, setPasswordType] = useState('password');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const fileInputRef = useRef(null) // Reference for file input


    const [signUp, setSignUp] = useState({
        fullname: "",
        email: "",
        password: "",
        photo: null // holds the file object,
    });

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state
        setLoader(true); // Start loading


        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUp.email, signUp.password);//Create user with email and password

            const photoBase64 = signUp.photo ? await convertToBase64(signUp.photo) : null

            updateProfile(auth.currentUser, { displayName: signUp.fullname }) // Update user profile with full name
                .then(() => {
                    console.log("Update user profile with SignUp successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });

            // Redirect to home page or dashboard after successful signup
            // console.log("User signed up successfully:", userCredential.user);



            if (userCredential.user) {
                navigate('/dashboard'); // Redirect to dashboard
            }



            localStorage.setItem(
                "CompanyN",
                JSON.stringify({
                    uid: auth.currentUser.uid,
                    fullname: signUp.fullname,
                    email: signUp.email,
                    photo: photoBase64,
                })); // Store user data in localStorage



            setDoc( //Assuming you have Firestore instance and a 'CompanyN' collection
                doc(db, "CompanyN", auth.currentUser.uid),
                {
                    fullname: signUp.fullname,
                    email: signUp.email,
                    password: signUp.password,
                    photo: photoBase64, // optional: store in Firestore too     
                },
                // { merge: true } // Merge to avoid overwriting existing data
            );




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
                // default:
                //     setError('Failed to create account. Please try again.');
            }

        } finally {
            setLoader(false); // Stop loading
        }


        onAuthStateChanged(auth, (user) => {
            if (user) {
                updateProfile(user, {
                    displayName: signUp.fullname
                });
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUp(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (

        <div className="grid  md:grid-cols-2 gap-2 justify-center items-center   ">
            <img src="/img/signup.webp" className="w-full mt-0 md:h-[428px]  max-w-md mx-auto " alt="Sign Up" />

            <div className="flex flex-col  sm:items-center mt-10">
                <h1 className="font-bold text-2xl md:text-2xl">New User</h1>
                <p className="text-gray-400 text-center md:text-left">Create Id To Start your Invoice Generator</p>

                <form className="mt-4 space-y-4" onSubmit={handleSignUp}>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Full Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            autoComplete="username"

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
                        style={{ display: 'none' }}>
                        <label className="font-semibold mb-1">  </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="file"
                            className="p-2 border border-gray-300 rounded"
                            accept="image/*"
                            name="photo"
                            onChange={(e) =>
                                setSignUp((prev) => ({
                                    ...prev,
                                    photo: e.target.files[0],
                                }))
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1"> </label>
                        <input
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            name="file"
                            // value={signUp.file}
                            value='Upload File'
                            className="p-2 text-gray-400  border border-gray-300 rounded"
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
                            autoComplete="current-password"
                            className="p-2 border border-gray-300 md:w-[40vw] rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordType(prev => prev === "password" ? "text" : "password")}
                            className="absolute bottom-2 right-4 md:right-8   rounded-full w-6 hover:bg-blue-200 hover:text-blue-900"
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
                    Already have an account ? {' '}
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



































// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Client, Account, Storage, ID } from "appwrite";

// // Initialize Appwrite client & services
// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1") //  Appwrite endpoint
//   .setProject("YOUR_PROJECT_ID");               //  project ID

// const account = new Account(client);
// const storage = new Storage(client);

// export const SignUp = () => {
//   const navigate = useNavigate();

//   const [signUp, setSignUp] = useState({
//     fullname: "",
//     email: "",
//     password: "",
//   });

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Handle form inputs change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSignUp((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   // Sign up & upload file
//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       let uploadedFile = null;

//       // Upload file if selected
//       if (selectedFile) {
//         uploadedFile = await storage.createFile(
//           "BUCKET_ID",  //  storage bucket ID
//           ID.unique(),
//           selectedFile
//         );
//         console.log("File uploaded:", uploadedFile);
//       }

//       // Create new user account in Appwrite
//       const user = await account.create(
//         ID.unique(),
//         signUp.email,
//         signUp.password,
//         signUp.fullname
//       );

//       console.log("User created:", user);

//       // Optionally: save uploadedFile.$id or info to your DB here

//       navigate("/login"); // Redirect after signup
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to create account.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid md:grid-cols-2 justify-center items-center">
//       <img
//         src="/img/signup.webp"
//         className="w-full mt-0 md:h-[398px] max-w-md mx-auto"
//         alt="Sign Up"
//       />

//       <div className="flex flex-col sm:items-center p-8 md:p-16">
//         <h1 className="font-bold text-2xl md:text-2xl">New User</h1>
//         <p className="text-gray-400 text-center md:text-left">
//           Create Id To Start your Invoice Generator
//         </p>

//         <form className="mt-4 space-y-4 w-full max-w-md" onSubmit={handleSignUp}>
//           <div className="flex flex-col">
//             <label className="font-semibold mb-1">Full Name</label>
//             <input
//               onChange={handleChange}
//               type="text"
//               autoComplete="name"
//               name="fullname"
//               value={signUp.fullname}
//               placeholder="Enter your full name"
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="font-semibold mb-1">Email</label>
//             <input
//               onChange={handleChange}
//               type="email"
//               name="email"
//               value={signUp.email}
//               placeholder="Enter your email"
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="font-semibold mb-1">Upload Profile Picture</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="p-2 border border-gray-300 rounded cursor-pointer"
//             />
//           </div>

//           <div className="flex flex-col relative">
//             <label className="font-semibold mb-1">Password</label>
//             <input
//               onChange={handleChange}
//               type="password"
//               name="password"
//               value={signUp.password}
//               placeholder="********"
//               autoComplete="new-password"
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full p-2 rounded font-semibold text-white ${
//               loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//             }`}
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         <span className="mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-500 hover:text-blue-600">
//             Login
//           </Link>
//         </span>

//         {error && (
//           <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
