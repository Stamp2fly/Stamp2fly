// import React, { useEffect, useMemo, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, Phone, ShieldCheck, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/components/ui/use-toast";
// import BackToHomeButton from "@/components/BackHomePage";
// import apiClient from "@/api/axios";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth";
// import { auth } from "@/firebase";

// const normalizeRole = (role) => {
//   if (!role || typeof role !== "string") {
//     return "";
//   }

//   return role.toLowerCase().replace(/[\s-]+/g, "_");
// };

// const hasAdminAccess = (role) => {
//   const normalized = normalizeRole(role);
//   return (
//     normalized === "super_admin" ||
//     normalized === "team" ||
//     normalized === "admin"
//   );
// };

// const getRoleFromToken = (token) => {
//   try {
//     if (!token || token.split(".").length < 2) {
//       return "";
//     }
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.role || "";
//   } catch {
//     return "";
//   }
// };

// const AuthPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const initialMode = useMemo(
//     () => (location.pathname === "/signup" ? "signup" : "login"),
//     [location.pathname]
//   );
//   const [activeTab, setActiveTab] = useState(initialMode);

//   const [signupData, setSignupData] = useState({
//     fullName: "",
//     phone: "",
//     otp: "",
//   });
//   const [loginData, setLoginData] = useState({
//     phone: "",
//     otp: "",
//   });

//   const [signupOtpSent, setSignupOtpSent] = useState(false);
//   const [loginOtpSent, setLoginOtpSent] = useState(false);
//   const [pendingLoginIsAdmin, setPendingLoginIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setActiveTab(initialMode);
//   }, [initialMode]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     navigate(tab === "signup" ? "/signup" : "/login", { replace: true });
//   };

//   const clearRecaptcha = () => {
//     if (window.recaptchaVerifier) {
//       try {
//         window.recaptchaVerifier.clear();
//       } catch {
//         // ignore
//       }
//       window.recaptchaVerifier = null;
//     }
//   };

//   const completeFirebaseAuth = async (firebaseToken, message) => {
//     const response = await apiClient.post("/auth/firebase", {
//       token: firebaseToken,
//     });
//     localStorage.setItem("authToken", response.data.token);
//     if (response.data.user) {
//       localStorage.setItem("authUser", JSON.stringify(response.data.user));
//     }

//     const role =
//       response.data.user?.role || getRoleFromToken(response.data.token);
//     const redirectPath = hasAdminAccess(role) ? "/admin" : "/";

//     toast({ title: message });
//     window.location.replace(redirectPath);
//   };

//   const sendPhoneOtp = async (phone) => {
//     clearRecaptcha();
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       {
//         size: "invisible",
//       }
//     );

//     const confirmationResult = await signInWithPhoneNumber(
//       auth,
//       "+91" + phone,
//       window.recaptchaVerifier
//     );

//     console.log("OTP SENT, confirmationResult =", confirmationResult);

//     window.confirmationResult = confirmationResult;
//   };

//   const provider = new GoogleAuthProvider();
  
//   const handleGoogleAuthClick = async () => {
//     try {
//     const result = await signInWithPopup(auth, provider);

//     const token = await result.user.getIdToken();

//     console.log("GOOGLE TOKEN:", token);

//     await completeFirebaseAuth(token, "Google login successful");

//   } catch (error) {
//     console.error("GOOGLE LOGIN ERROR:", error);
//   }
//   };

//   const handleSignupSendOtp = async (e) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);
//       await sendPhoneOtp(signupData.phone);
//       setSignupOtpSent(true);

//       toast({
//         title: "OTP sent",
//         description: "Enter OTP from Firebase",
//       });
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLoginSendOtp = async (e) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);
//       await sendPhoneOtp(loginData.phone);
//       setLoginOtpSent(true);

//       toast({
//         title: "OTP sent",
//         description: "Enter OTP from Firebase",
//       });
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignupVerify = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);

//       const result = await window.confirmationResult.confirm(signupData.otp);

//       if (signupData.fullName) {
//         await updateProfile(result.user, { displayName: signupData.fullName });
//         await result.user.reload();
//       }

//       const token = await result.user.getIdToken(true);

//       console.log("FIREBASE TOKEN:", token);

//       await completeFirebaseAuth(token, "Signup successful");
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLoginVerify = async (e) => {
//     e.preventDefault();

//     try {
//       setIsLoading(true);

//       console.log("STEP 1: confirmationResult =", window.confirmationResult);

//       const result = await window.confirmationResult.confirm(loginData.otp);

//       console.log("STEP 2: OTP VERIFIED");

//       const token = await result.user.getIdToken(true);

//       console.log("🔥 FIREBASE TOKEN:", token);

//       await completeFirebaseAuth(token, "Login successful");
//     } catch (error) {
//       console.log("❌ LOGIN ERROR:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>
//           {activeTab === "signup" ? "Sign Up" : "Login"} - Stamp2Fly
//         </title>
//         <meta
//           name="description"
//           content="Sign up or login to Stamp2Fly using phone OTP or Google."
//         />
//       </Helmet>

//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4">
//         <div className="w-full max-w-md">
//           <div className="mb-6 flex justify-center">
//             <Link to="/" className="flex items-center gap-2">
//               <img
//                 src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
//                 alt="Stamp2Fly"
//                 className="h-20"
//               />
//               <span className="text-2xl font-semibold text-gray-900">
//                 Stamp2Fly
//               </span>
//             </Link>
//           </div>
//           {/* BACK */}
//           <div>
//             <BackToHomeButton />
//           </div>

//           {/* CARD */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
//             {/* TITLE */}
//             <div className="mb-6 text-center">
//               <h1 className="text-2xl font-semibold text-gray-900">
//                 {activeTab === "signup" ? "Create account" : "Welcome back"}
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 {activeTab === "signup"
//                   ? "Sign up to get started"
//                   : "Login with your phone number"}
//               </p>
//             </div>

//             <Tabs value={activeTab} onValueChange={handleTabChange}>
//               {/* TABS */}
//               <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
//                 <TabsTrigger value="login" className="rounded-lg">
//                   Login
//                 </TabsTrigger>
//                 <TabsTrigger value="signup" className="rounded-lg">
//                   Sign Up
//                 </TabsTrigger>
//               </TabsList>

//               {/* SIGNUP */}
//               <TabsContent value="signup" className="mt-6">
//                 <form
//                   onSubmit={
//                     signupOtpSent ? handleSignupVerify : handleSignupSendOtp
//                   }
//                   className="space-y-4"
//                 >
//                   <div>
//                     <label className="text-sm font-medium text-gray-700">
//                       Full Name
//                     </label>
//                     <Input
//                       className="mt-1 rounded-xl h-11"
//                       type="text"
//                       value={signupData.fullName}
//                       onChange={(e) =>
//                         setSignupData((prev) => ({
//                           ...prev,
//                           fullName: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter your name"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-gray-700">
//                       Phone
//                     </label>
//                     <Input
//                       className="mt-1 rounded-xl h-11"
//                       type="tel"
//                       value={signupData.phone}
//                       onChange={(e) =>
//                         setSignupData((prev) => ({
//                           ...prev,
//                           phone: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter phone number"
//                       required
//                     />
//                   </div>

//                   {signupOtpSent && (
//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         OTP
//                       </label>
//                       <Input
//                         className="mt-1 rounded-xl h-11 tracking-widest"
//                         type="text"
//                         value={signupData.otp}
//                         onChange={(e) =>
//                           setSignupData((prev) => ({
//                             ...prev,
//                             otp: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter OTP"
//                         required
//                       />
//                     </div>
//                   )}

//                   <Button
//                     type="submit"
//                     className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
//                     disabled={isLoading}
//                   >
//                     {isLoading
//                       ? "Please wait..."
//                       : signupOtpSent
//                         ? "Create Account"
//                         : "Send OTP"}
//                   </Button>

//                   {/* GOOGLE BUTTON */}
//                   <button
//                     type="button"
//                     onClick={handleGoogleAuthClick}
//                     className="w-full flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
//                   >
//                     <img
//                       src="https://www.svgrepo.com/show/475656/google-color.svg"
//                       alt="Google"
//                       className="h-5 w-5"
//                     />
//                     <span className="text-sm font-medium text-gray-700">
//                       Continue with Google
//                     </span>
//                   </button>
//                 </form>
//               </TabsContent>

//               {/* LOGIN */}
//               <TabsContent value="login" className="mt-6">
//                 <form
//                   onSubmit={
//                     loginOtpSent ? handleLoginVerify : handleLoginSendOtp
//                   }
//                   className="space-y-4"
//                 >
//                   <div>
//                     <label className="text-sm font-medium text-gray-700">
//                       Phone
//                     </label>
//                     <Input
//                       className="mt-1 rounded-xl h-11"
//                       type="tel"
//                       value={loginData.phone}
//                       onChange={(e) =>
//                         setLoginData((prev) => ({
//                           ...prev,
//                           phone: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter phone number"
//                       required
//                     />
//                   </div>

//                   {loginOtpSent && (
//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         OTP
//                       </label>
//                       <Input
//                         className="mt-1 rounded-xl h-11 tracking-widest"
//                         type="text"
//                         value={loginData.otp}
//                         onChange={(e) =>
//                           setLoginData((prev) => ({
//                             ...prev,
//                             otp: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter OTP"
//                         required
//                       />
//                     </div>
//                   )}

//                   <Button
//                     type="submit"
//                     className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
//                     disabled={isLoading}
//                   >
//                     {isLoading
//                       ? "Please wait..."
//                       : loginOtpSent
//                         ? "Login"
//                         : "Send OTP"}
//                   </Button>

//                   {/* GOOGLE BUTTON */}
//                   <button
//                     type="button"
//                     onClick={handleGoogleAuthClick}
//                     className="w-full flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
//                   >
//                     <img
//                       src="https://www.svgrepo.com/show/475656/google-color.svg"
//                       alt="Google"
//                       className="h-5 w-5"
//                     />
//                     <span className="text-sm font-medium text-gray-700">
//                       Continue with Google
//                     </span>
//                   </button>
//                 </form>
//               </TabsContent>
//               <div id="recaptcha-container"></div>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//       <div id="recaptcha-container"></div>
//     </>
//   );
// };

// export default AuthPage;




import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import BackToHomeButton from "@/components/BackHomePage";
import apiClient from "@/api/axios";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase";

// ── helpers ────────────────────────────────────────────────────────────────
const normalizeRole = (role) => {
  if (!role || typeof role !== "string") return "";
  return role.toLowerCase().replace(/[\s-]+/g, "_");
};

const hasAdminAccess = (role) => {
  const n = normalizeRole(role);
  return n === "super_admin" || n === "team" || n === "admin";
};

const getRoleFromToken = (token) => {
  try {
    if (!token || token.split(".").length < 2) return "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || "";
  } catch {
    return "";
  }
};

// ── component ──────────────────────────────────────────────────────────────
const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialMode = useMemo(
    () => (location.pathname === "/signup" ? "signup" : "login"),
    [location.pathname]
  );

  const [activeTab, setActiveTab] = useState(initialMode);
  const [signupData, setSignupData] = useState({ fullName: "", phone: "", otp: "" });
  const [loginData, setLoginData] = useState({ phone: "", otp: "" });
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === "signup" ? "/signup" : "/login", { replace: true });
  };

  // ── recaptcha ──────────────────────────────────────────────────────────
  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch { /* ignore */ }
      window.recaptchaVerifier = null;
    }
  };

  // ── complete auth (backend call) ───────────────────────────────────────
  const completeFirebaseAuth = async (firebaseToken, message) => {
    try {
      const response = await apiClient.post("/auth/firebase", { token: firebaseToken });
      localStorage.setItem("authToken", response.data.token);
      if (response.data.user) {
        localStorage.setItem("authUser", JSON.stringify(response.data.user));
      }
      const role = response.data.user?.role || getRoleFromToken(response.data.token);
      const redirectPath = hasAdminAccess(role) ? "/admin" : "/";
      toast({ title: message });
      window.location.replace(redirectPath);
    } catch (error) {
      console.error("AUTH ERROR STATUS:", error.response?.status);
      console.error("AUTH ERROR DATA:", error.response?.data);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  // ── OTP ────────────────────────────────────────────────────────────────
  const sendPhoneOtp = async (phone) => {
    clearRecaptcha();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      "+91" + phone,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
  };

  const handleSignupSendOtp = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await sendPhoneOtp(signupData.phone);
      setSignupOtpSent(true);
      toast({ title: "OTP sent", description: "Check your phone" });
    } catch (error) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSendOtp = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await sendPhoneOtp(loginData.phone);
      setLoginOtpSent(true);
      toast({ title: "OTP sent", description: "Check your phone" });
    } catch (error) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await window.confirmationResult.confirm(signupData.otp);
      if (signupData.fullName) {
        await updateProfile(result.user, { displayName: signupData.fullName });
        await result.user.reload();
      }
      const token = await result.user.getIdToken(true);
      await completeFirebaseAuth(token, "Signup successful");
    } catch (error) {
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await window.confirmationResult.confirm(loginData.otp);
      const token = await result.user.getIdToken(true);
      await completeFirebaseAuth(token, "Login successful");
    } catch (error) {
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google ─────────────────────────────────────────────────────────────
  const handleGoogleAuthClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await completeFirebaseAuth(token, "Google login successful");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") return;
      toast({ title: "Google login failed", description: error.message, variant: "destructive" });
    }
  };

  // ── render ─────────────────────────────────────────────────────────────
  const isSignup = activeTab === "signup";

  return (
    <>
      <Helmet>
        <title>{isSignup ? "Sign Up" : "Login"} — Stamp2Fly</title>
        <meta name="description" content="Sign up or login to Stamp2Fly using phone OTP or Google." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --ink: #0d1117;
            --ink-2: #3d4350;
            --ink-3: #8a909e;
            --surface: #ffffff;
            --surface-2: #f5f6f8;
            --border: #e8eaed;
            --accent: #1a56db;
            --accent-hover: #1447c0;
            --accent-light: #eff4ff;
            --success: #0d9488;
            --danger: #dc2626;
            --stamp-blue: #1a56db;
          }

          .auth-root {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            font-family: 'DM Sans', sans-serif;
            background: var(--surface);
          }

          @media (max-width: 768px) {
            .auth-root { grid-template-columns: 1fr; }
            .auth-panel-left { display: none; }
          }

          /* ── Left decorative panel ── */
          .auth-panel-left {
            background: var(--ink);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 48px;
            position: relative;
            overflow: hidden;
          }

          .auth-panel-left::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(26,86,219,0.35) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 20%, rgba(13,148,136,0.2) 0%, transparent 70%);
          }

          .panel-stamp {
            position: absolute;
            width: 340px;
            height: 340px;
            border: 2px dashed rgba(255,255,255,0.08);
            border-radius: 12px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-8deg);
          }

          .panel-stamp::before {
            content: '';
            position: absolute;
            inset: 16px;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
          }

          .panel-stamp-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          }

          .panel-stamp-icon {
            font-size: 72px;
            display: block;
            margin-bottom: 12px;
            filter: drop-shadow(0 0 24px rgba(26,86,219,0.5));
          }

          .panel-stamp-text {
            font-family: 'DM Serif Display', serif;
            font-size: 28px;
            color: rgba(255,255,255,0.9);
            letter-spacing: -0.5px;
            line-height: 1.2;
          }

          .panel-stamp-sub {
            font-size: 13px;
            color: rgba(255,255,255,0.4);
            margin-top: 8px;
            letter-spacing: 0.5px;
          }

          .panel-tagline {
            position: relative;
            z-index: 1;
          }

          .panel-tagline-heading {
            font-family: 'DM Serif Display', serif;
            font-size: 38px;
            color: #fff;
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin: 0 0 12px;
          }

          .panel-tagline-sub {
            font-size: 15px;
            color: rgba(255,255,255,0.45);
            line-height: 1.6;
            max-width: 280px;
          }

          .panel-dots {
            display: flex;
            gap: 8px;
            position: relative;
            z-index: 1;
          }

          .panel-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
          }

          .panel-dot.active {
            background: var(--stamp-blue);
            width: 22px;
            border-radius: 3px;
          }

          /* ── Right form panel ── */
          .auth-panel-right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 40px;
            position: relative;
          }

          .auth-back {
            position: absolute;
            top: 24px;
            left: 24px;
          }

          .auth-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            margin-bottom: 40px;
          }

          .auth-logo img { height: 36px; }

          .auth-logo-name {
            font-family: 'DM Serif Display', serif;
            font-size: 22px;
            color: var(--ink);
            letter-spacing: -0.3px;
          }

          .auth-card {
            width: 100%;
            max-width: 400px;
          }

          .auth-heading {
            font-family: 'DM Serif Display', serif;
            font-size: 32px;
            color: var(--ink);
            letter-spacing: -0.5px;
            margin: 0 0 6px;
          }

          .auth-subheading {
            font-size: 14px;
            color: var(--ink-3);
            margin: 0 0 32px;
          }

          /* ── Tabs ── */
          .auth-tabs {
            display: flex;
            background: var(--surface-2);
            border-radius: 10px;
            padding: 4px;
            margin-bottom: 28px;
            gap: 4px;
          }

          .auth-tab {
            flex: 1;
            padding: 9px 0;
            border: none;
            background: transparent;
            border-radius: 7px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--ink-3);
            cursor: pointer;
            transition: all 0.18s ease;
          }

          .auth-tab.active {
            background: var(--surface);
            color: var(--ink);
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          }

          /* ── Form fields ── */
          .auth-field {
            margin-bottom: 16px;
          }

          .auth-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: var(--ink-2);
            margin-bottom: 6px;
          }

          .auth-input-wrap {
            position: relative;
          }

          .auth-input-prefix {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            color: var(--ink-3);
            pointer-events: none;
            border-right: 1px solid var(--border);
            padding-right: 10px;
            height: 20px;
            display: flex;
            align-items: center;
          }

          .auth-input {
            width: 100%;
            height: 46px;
            border: 1.5px solid var(--border);
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            color: var(--ink);
            background: var(--surface);
            outline: none;
            transition: border-color 0.15s;
            box-sizing: border-box;
            padding: 0 14px;
          }

          .auth-input.with-prefix {
            padding-left: 56px;
          }

          .auth-input.otp {
            letter-spacing: 6px;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
          }

          .auth-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px var(--accent-light);
          }

          .auth-input::placeholder {
            color: var(--ink-3);
            letter-spacing: 0;
            font-weight: 400;
            font-size: 14px;
          }

          /* ── OTP hint ── */
          .otp-hint {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--accent-light);
            border: 1px solid rgba(26,86,219,0.15);
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 16px;
          }

          .otp-hint-icon { font-size: 16px; }

          .otp-hint-text {
            font-size: 13px;
            color: var(--accent);
            font-weight: 500;
          }

          /* ── Buttons ── */
          .auth-btn-primary {
            width: 100%;
            height: 46px;
            background: var(--accent);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s, transform 0.1s;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .auth-btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
          .auth-btn-primary:active:not(:disabled) { transform: scale(0.99); }
          .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

          .auth-btn-google {
            width: 100%;
            height: 46px;
            background: var(--surface);
            color: var(--ink);
            border: 1.5px solid var(--border);
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: background 0.15s, border-color 0.15s;
          }

          .auth-btn-google:hover {
            background: var(--surface-2);
            border-color: #c8ccd4;
          }

          .auth-btn-google img { height: 18px; width: 18px; }

          /* ── Divider ── */
          .auth-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 16px 0;
          }

          .auth-divider-line {
            flex: 1;
            height: 1px;
            background: var(--border);
          }

          .auth-divider-text {
            font-size: 12px;
            color: var(--ink-3);
            font-weight: 500;
          }

          /* ── Loader spinner ── */
          @keyframes spin { to { transform: rotate(360deg); } }

          .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            flex-shrink: 0;
          }

          /* ── Slide animation ── */
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .slide-up { animation: slideUp 0.25s ease forwards; }
        `}</style>
      </Helmet>

      <div className="auth-root">
        {/* ── Left decorative panel ── */}
        <div className="auth-panel-left">
          <div className="panel-stamp">
            <div className="panel-stamp-inner">
              <span className="panel-stamp-icon">✈️</span>
              <div className="panel-stamp-text">Stamp2Fly</div>
              <div className="panel-stamp-sub">BOARDING PASS</div>
            </div>
          </div>

          <div className="panel-tagline">
            <h2 className="panel-tagline-heading">
              Your journey<br />starts here.
            </h2>
            <p className="panel-tagline-sub">
              Manage your stamps, track your trips, and fly smarter with Stamp2Fly.
            </p>
          </div>

          <div className="panel-dots">
            <div className={`panel-dot ${isSignup ? "" : "active"}`} />
            <div className={`panel-dot ${isSignup ? "active" : ""}`} />
            <div className="panel-dot" />
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-panel-right">
          <div className="auth-back">
            <BackToHomeButton />
          </div>

          <div className="auth-card">
            <Link to="/" className="auth-logo">
              <img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
                alt="Stamp2Fly"
              />
              <span className="auth-logo-name">Stamp2Fly</span>
            </Link>

            <h1 className="auth-heading">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>
            <p className="auth-subheading">
              {isSignup
                ? "Sign up with your phone number"
                : "Login with your phone number"}
            </p>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${!isSignup ? "active" : ""}`}
                onClick={() => handleTabChange("login")}
              >
                Login
              </button>
              <button
                className={`auth-tab ${isSignup ? "active" : ""}`}
                onClick={() => handleTabChange("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* ── SIGNUP FORM ── */}
            {isSignup && (
              <form
                onSubmit={signupOtpSent ? handleSignupVerify : handleSignupSendOtp}
                className="slide-up"
              >
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <input
                    className="auth-input"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Phone Number</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-prefix">+91</span>
                    <input
                      className="auth-input with-prefix"
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="98765 43210"
                      required
                      disabled={signupOtpSent}
                    />
                  </div>
                </div>

                {signupOtpSent && (
                  <div className="slide-up">
                    <div className="otp-hint">
                      <span className="otp-hint-icon">📱</span>
                      <span className="otp-hint-text">OTP sent to +91 {signupData.phone}</span>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Enter OTP</label>
                      <input
                        className="auth-input otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={signupData.otp}
                        onChange={(e) =>
                          setSignupData((p) => ({ ...p, otp: e.target.value }))
                        }
                        placeholder="· · · · · ·"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="spinner" /> Please wait…</>
                  ) : signupOtpSent ? (
                    "Create Account →"
                  ) : (
                    "Send OTP"
                  )}
                </button>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">or</span>
                  <div className="auth-divider-line" />
                </div>

                <button type="button" className="auth-btn-google" onClick={handleGoogleAuthClick}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                  Continue with Google
                </button>
              </form>
            )}

            {/* ── LOGIN FORM ── */}
            {!isSignup && (
              <form
                onSubmit={loginOtpSent ? handleLoginVerify : handleLoginSendOtp}
                className="slide-up"
              >
                <div className="auth-field">
                  <label className="auth-label">Phone Number</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-prefix">+91</span>
                    <input
                      className="auth-input with-prefix"
                      type="tel"
                      value={loginData.phone}
                      onChange={(e) =>
                        setLoginData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="98765 43210"
                      required
                      disabled={loginOtpSent}
                    />
                  </div>
                </div>

                {loginOtpSent && (
                  <div className="slide-up">
                    <div className="otp-hint">
                      <span className="otp-hint-icon">📱</span>
                      <span className="otp-hint-text">OTP sent to +91 {loginData.phone}</span>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Enter OTP</label>
                      <input
                        className="auth-input otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={loginData.otp}
                        onChange={(e) =>
                          setLoginData((p) => ({ ...p, otp: e.target.value }))
                        }
                        placeholder="· · · · · ·"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="spinner" /> Please wait…</>
                  ) : loginOtpSent ? (
                    "Login →"
                  ) : (
                    "Send OTP"
                  )}
                </button>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">or</span>
                  <div className="auth-divider-line" />
                </div>

                <button type="button" className="auth-btn-google" onClick={handleGoogleAuthClick}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                  Continue with Google
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Single recaptcha container — outside the form, inside the page */}
      <div id="recaptcha-container" />
    </>
  );
};

export default AuthPage;