import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { sendOtp, verifyOtp } from "@/api/authApi";
import BackToHomeButton from "@/components/BackHomePage";

const normalizeRole = (role) => {
  if (!role || typeof role !== "string") {
    return "";
  }

  return role.toLowerCase().replace(/[\s-]+/g, "_");
};

const hasAdminAccess = (role) => {
  const normalized = normalizeRole(role);
  return (
    normalized === "super_admin" ||
    normalized === "team" ||
    normalized === "admin"
  );
};

const getRoleFromToken = (token) => {
  try {
    if (!token || token.split(".").length < 2) {
      return "";
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || "";
  } catch {
    return "";
  }
};

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialMode = useMemo(
    () => (location.pathname === "/signup" ? "signup" : "login"),
    [location.pathname]
  );
  const [activeTab, setActiveTab] = useState(initialMode);

  const [signupData, setSignupData] = useState({
    fullName: "",
    phone: "",
    otp: "",
  });
  const [loginData, setLoginData] = useState({
    phone: "",
    otp: "",
  });

  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [pendingLoginIsAdmin, setPendingLoginIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === "signup" ? "/signup" : "/login", { replace: true });
  };

  const handleGoogleAuthClick = () => {
    toast({
      title: "Google Sign-In",
      description:
        "Google auth UI is ready. Backend OAuth endpoint can be plugged in next.",
    });
  };

  const handleSignupSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendOtp({
        phone: signupData.phone,
        fullName: signupData.fullName,
        mode: "signup",
      });

      setSignupOtpSent(true);
      toast({
        title: "OTP sent",
        description: "Enter the OTP sent to your phone to complete signup.",
        className: "bg-emerald-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOtp({
        phone: signupData.phone,
        otp: signupData.otp,
      });

      const token = response?.token || "";
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (response?.user) {
        localStorage.setItem("authUser", JSON.stringify(response.user));
      }

      const role = response?.user?.role || getRoleFromToken(token);
      const isAdminRole = Boolean(response?.isAdmin) || hasAdminAccess(role);

      toast({
        title: "Signup successful",
        description: "Your account has been created and verified.",
        className: "bg-emerald-600 text-white",
      });
      window.location.replace(isAdminRole ? "/admin" : "/");
    } catch (error) {
      toast({
        title: "OTP verification failed",
        description:
          error?.response?.data?.message || "Invalid or expired OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendOtp({
        phone: loginData.phone,
        mode: "login",
      });

      setPendingLoginIsAdmin(Boolean(response?.isAdmin));

      setLoginOtpSent(true);
      toast({
        title: "OTP sent",
        description: "Enter the OTP sent to your phone to login.",
        className: "bg-emerald-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOtp({
        phone: loginData.phone,
        otp: loginData.otp,
      });

      const token = response?.token || "";
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (response?.user) {
        localStorage.setItem("authUser", JSON.stringify(response.user));
      }

      const role = response?.user?.role || getRoleFromToken(token);
      const isAdminRole =
        Boolean(response?.isAdmin) ||
        pendingLoginIsAdmin ||
        hasAdminAccess(role);

      toast({
        title: "Login successful",
        description: "You are now signed in.",
        className: "bg-emerald-600 text-white",
      });
      window.location.replace(isAdminRole ? "/admin" : "/");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error?.response?.data?.message || "Invalid or expired OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <>
    //   <Helmet>
    //     <title>{activeTab === 'signup' ? 'Sign Up' : 'Login'} - Stamp2Fly</title>
    //     <meta name="description" content="Sign up or login to Stamp2Fly using phone OTP or Google." />
    //   </Helmet>

    //   <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10 sm:px-6 lg:px-8">
    //     <div className="mx-auto w-full max-w-5xl">
    //       <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
    //         <ArrowLeft className="h-4 w-4" /> Back to home
    //       </Link>

    //       <div className="grid gap-8 lg:grid-cols-2">
    //         <motion.div
    //           initial={{ opacity: 0, x: -20 }}
    //           animate={{ opacity: 1, x: 0 }}
    //           transition={{ duration: 0.4 }}
    //           className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl"
    //         >
    //           <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">
    //             <ShieldCheck className="h-4 w-4" /> Secure OTP Access
    //           </div>
    //           <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Access your Stamp2Fly account</h1>
    //           <p className="mt-4 text-slate-200">
    //             Create an account with your full name, phone, and OTP, or login instantly with phone OTP.
    //           </p>
    //           <div className="mt-8 space-y-3 text-sm text-slate-200">
    //             <p className="flex items-center gap-2"><User className="h-4 w-4" /> Signup: Fullname + Phone + OTP</p>
    //             <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> Login: Phone + OTP</p>
    //           </div>
    //         </motion.div>

    //         <motion.div
    //           initial={{ opacity: 0, x: 20 }}
    //           animate={{ opacity: 1, x: 0 }}
    //           transition={{ duration: 0.4 }}
    //           className="rounded-3xl bg-white p-6 shadow-xl sm:p-8"
    //         >
    //           <Tabs value={activeTab} onValueChange={handleTabChange}>
    //             <TabsList className="grid w-full grid-cols-2">
    //               <TabsTrigger value="login">Login</TabsTrigger>
    //               <TabsTrigger value="signup">Sign Up</TabsTrigger>
    //             </TabsList>

    //             <TabsContent value="signup" className="mt-6">
    //               <form onSubmit={signupOtpSent ? handleSignupVerify : handleSignupSendOtp} className="space-y-4">
    //                 <div>
    //                   <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
    //                   <Input
    //                     type="text"
    //                     value={signupData.fullName}
    //                     onChange={(e) => setSignupData((prev) => ({ ...prev, fullName: e.target.value }))}
    //                     placeholder="Enter your full name"
    //                     required
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
    //                   <Input
    //                     type="tel"
    //                     value={signupData.phone}
    //                     onChange={(e) => setSignupData((prev) => ({ ...prev, phone: e.target.value }))}
    //                     placeholder="Enter your phone number"
    //                     required
    //                   />
    //                 </div>

    //                 {signupOtpSent && (
    //                   <div>
    //                     <label className="mb-1 block text-sm font-medium text-slate-700">OTP</label>
    //                     <Input
    //                       type="text"
    //                       value={signupData.otp}
    //                       onChange={(e) => setSignupData((prev) => ({ ...prev, otp: e.target.value }))}
    //                       placeholder="Enter OTP"
    //                       required
    //                     />
    //                   </div>
    //                 )}

    //                 <Button
    //                   type="submit"
    //                   className="w-full bg-slate-900 text-white hover:bg-slate-800"
    //                   disabled={isLoading}
    //                 >
    //                   {isLoading ? 'Please wait...' : signupOtpSent ? 'Sign Up' : 'Send OTP'}
    //                 </Button>

    //                 <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuthClick}>
    //                   Sign up with Google
    //                 </Button>
    //               </form>
    //             </TabsContent>

    //             <TabsContent value="login" className="mt-6">
    //               <form onSubmit={loginOtpSent ? handleLoginVerify : handleLoginSendOtp} className="space-y-4">
    //                 <div>
    //                   <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
    //                   <Input
    //                     type="tel"
    //                     value={loginData.phone}
    //                     onChange={(e) => setLoginData((prev) => ({ ...prev, phone: e.target.value }))}
    //                     placeholder="Enter your phone number"
    //                     required
    //                   />
    //                 </div>

    //                 {loginOtpSent && (
    //                   <div>
    //                     <label className="mb-1 block text-sm font-medium text-slate-700">OTP</label>
    //                     <Input
    //                       type="text"
    //                       value={loginData.otp}
    //                       onChange={(e) => setLoginData((prev) => ({ ...prev, otp: e.target.value }))}
    //                       placeholder="Enter OTP"
    //                       required
    //                     />
    //                   </div>
    //                 )}

    //                 <Button
    //                   type="submit"
    //                   className="w-full bg-slate-900 text-white hover:bg-slate-800"
    //                   disabled={isLoading}
    //                 >
    //                   {isLoading ? 'Please wait...' : loginOtpSent ? 'Login' : 'Send OTP'}
    //                 </Button>

    //                 <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuthClick}>
    //                   Login with Google
    //                 </Button>
    //               </form>
    //             </TabsContent>
    //           </Tabs>
    //         </motion.div>
    //       </div>
    //     </div>
    //   </div>
    // </>

    <>
      <Helmet>
        <title>
          {activeTab === "signup" ? "Sign Up" : "Login"} - Stamp2Fly
        </title>
        <meta
          name="description"
          content="Sign up or login to Stamp2Fly using phone OTP or Google."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
                alt="Stamp2Fly"
                className="h-20"
              />
              <span className="text-2xl font-semibold text-gray-900">
                Stamp2Fly
              </span>
            </Link>
          </div>
          {/* BACK */}
          <div>
            <BackToHomeButton />
          </div>

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            {/* TITLE */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeTab === "signup" ? "Create account" : "Welcome back"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "signup"
                  ? "Sign up to get started"
                  : "Login with your phone number"}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {/* TABS */}
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* SIGNUP */}
              <TabsContent value="signup" className="mt-6">
                <form
                  onSubmit={
                    signupOtpSent ? handleSignupVerify : handleSignupSendOtp
                  }
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      className="mt-1 rounded-xl h-11"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input
                      className="mt-1 rounded-xl h-11"
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  {signupOtpSent && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        OTP
                      </label>
                      <Input
                        className="mt-1 rounded-xl h-11 tracking-widest"
                        type="text"
                        value={signupData.otp}
                        onChange={(e) =>
                          setSignupData((prev) => ({
                            ...prev,
                            otp: e.target.value,
                          }))
                        }
                        placeholder="Enter OTP"
                        required
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Please wait..."
                      : signupOtpSent
                        ? "Create Account"
                        : "Send OTP"}
                  </Button>

                  {/* GOOGLE BUTTON */}
                  <button
                    type="button"
                    onClick={handleGoogleAuthClick}
                    className="w-full flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </button>
                </form>
              </TabsContent>

              {/* LOGIN */}
              <TabsContent value="login" className="mt-6">
                <form
                  onSubmit={
                    loginOtpSent ? handleLoginVerify : handleLoginSendOtp
                  }
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input
                      className="mt-1 rounded-xl h-11"
                      type="tel"
                      value={loginData.phone}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  {loginOtpSent && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        OTP
                      </label>
                      <Input
                        className="mt-1 rounded-xl h-11 tracking-widest"
                        type="text"
                        value={loginData.otp}
                        onChange={(e) =>
                          setLoginData((prev) => ({
                            ...prev,
                            otp: e.target.value,
                          }))
                        }
                        placeholder="Enter OTP"
                        required
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Please wait..."
                      : loginOtpSent
                        ? "Login"
                        : "Send OTP"}
                  </Button>

                  {/* GOOGLE BUTTON */}
                  <button
                    type="button"
                    onClick={handleGoogleAuthClick}
                    className="w-full flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
