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

  const demoAccounts = [
    { role: "Admin", email: "admin@swiftex.local" },
    { role: "Coordinator", email: "coordinator@swiftex.local" },
    { role: "Operator", email: "operator@swiftex.local" },
  ];

  const fillDemoCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("SecurePassword123!");
  };

  // navigation to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
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
    } else if (!email || !password) {
      notifyError("Please Enter Both Email and Password");
      return;
    }
    try {
      await signinMutateAsync({
        email: email,
        password: password,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("my error", err.response);
        notifyError(err.response?.data?.message);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="bg-[#F5F7FA] min-h-screen flex md:items-center md:justify-center pt-16 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md ">
          <div>
            <div className="flex items-center justify-center gap-2 ">
              <span className="bg-[#0c5aa6] text-white p-2 rounded-lg">
                <Package className="w-8 h-8 text-white font-bold" />
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
                <input
                  type="text"
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"
                />
              </div>

              <div className="mt-4.5">
                <label className="font-medium text-sm">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"
                  />

                  <Icon
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-6 absolute top-4.5 right-4 cursor-pointer text-primary"
                  />
                </div>
              </div>

              <div className="mt-4.5">
                Forgot Password{" "}
                <span className="text-accent cursor-pointer">Click Here</span>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center cursor-pointer rounded-[10px] bg-accent py-3"
                >
                  {signinPending ? (
                    <Loader2 className="animate-spin duration-300" />
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Demo Accounts for Testing */}
            <div className="mt-6 pt-5 border-t border-white/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Demo Accounts for Testing
                </p>
                <span className="text-[11px] text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                  Click to autofill
                </span>
              </div>

              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => fillDemoCredentials(account.email)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-md transition text-left cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {account.role}
                      </span>
                      <span className="text-gray-300 text-[11px]">
                        {account.email}
                      </span>
                    </div>
                    <span className="text-accent text-[11px] font-medium">
                      Use &rarr;
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-center text-gray-300 font-mono bg-white/5 py-1.5 px-2 rounded border border-white/10">
                Password:{" "}
                <span className="text-white font-semibold select-all">
                  SecurePassword123!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
