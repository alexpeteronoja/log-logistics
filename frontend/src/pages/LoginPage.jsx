import { Eye, EyeOff, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError } from "../utils/toast";
import { useUserLogin } from "../datahooks/authentication/authenticationHook";
import axios from "axios";
import withAuth from "../api/withAuth";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = withAuth();
    const navigate = useNavigate();
    const Icon = showPassword ? Eye : EyeOff;
    const { signinMutateAsync, signinPending } = useUserLogin();
    // navagation to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
        else {
            navigate("/admin");
        }
    }, [navigate, isAuthenticated]);
    // Handle Signin
    const handleSignin = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            notifyError("Please enter a valid email address.");
            return;
        }
        else if (!email || !password) {
            notifyError("Please Enter Both Email and Password");
            return;
        }
        try {
            await signinMutateAsync({
                email: email,
                password: password,
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                console.log("my error", err.response);
                notifyError(err.response?.data?.message);
            }
            else {
                console.log(err);
            }
        }
    };
    return (<>
      <div className="bg-[#F5F7FA] min-h-screen flex md:items-center md:justify-center pt-16 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md ">
          <div>
            <div className="flex items-center justify-center gap-2 ">
              <span className="bg-[#0c5aa6] text-white p-2 rounded-lg">
                <Package className="w-8 h-8 text-white font-bold"/>
              </span>
              <span className="text-xl font-bold text-textcol">
                <Link to="/">FastLink Courier</Link>
              </span>
            </div>

            <div className="text-center text-textcol text-2xl mb-7 mt-5">
              Admin Login
            </div>
          </div>

          <div className="bg-[#20186D] text-white rounded-lg shadow-sm p-9">
            <p className="text-xl font-bold font-nunito mb-1.5 text-center">
              Sign in
            </p>

            <p className="text-sm mb-6 text-center">
              Enter your credentials to login.
            </p>

            <form action="" onSubmit={handleSignin}>
              <div>
                <label className="font-medium text-sm">Email Address</label>
                <input type="text" value={email} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"/>
              </div>

              <div className="mt-4.5">
                <label className="font-medium text-sm">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"/>

                  <Icon onClick={() => setShowPassword(!showPassword)} className="w-6 absolute top-4.5 right-4 cursor-pointer text-primary"/>
                </div>
              </div>

              <div className="mt-4.5">
                Forgot Password{" "}
                <span className="text-accent cursor-pointer">Click Here</span>
              </div>

              <div className="mt-6">
                <button type="submit" className="w-full flex justify-center items-center cursor-pointer rounded-[10px] bg-accent py-3">
                  {signinPending ? (<Loader2 className="animate-spin duration-300"/>) : ("Sign in")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>);
}
export default Login;
