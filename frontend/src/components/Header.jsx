import React from "react";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleSectionNavigate = (sectionId) => (event) => {
    event.preventDefault();

    if (!isHomePage) {
      navigate(`/#${sectionId}`);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  let authUser = null;
  try {
    authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    authUser = null;
  }

  const fullName = authUser?.fullName?.trim() || "";
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const normalizedRole = String(authUser?.role || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const isAdmin =
    normalizedRole === "super_admin" ||
    normalizedRole === "team" ||
    normalizedRole === "admin";
  const displayName = fullName || authUser?.phone || "User";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login", { replace: true });
  };

  // return (
  // 	<header className="bg-white sticky top-0 z-50 border-b border-gray-200">
  // 		<div className="max-w-7xl mx-auto px-4 lg:px-8">
  // 			<div className="flex items-center justify-between h-16 sm:h-20">

  // 				{/* LEFT - Logo */}
  // 				<Link to="/" className="flex items-center space-x-2">
  // 					<motion.div
  // 						initial={{ opacity: 0, x: -20 }}
  // 						animate={{ opacity: 1, x: 0 }}
  // 						transition={{ duration: 0.5 }}
  // 						className="flex items-center space-x-2"
  // 					>
  // 						<img
  // 							src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
  // 							alt="Stamp2Fly Brandmark"
  // 							className="h-8 w-auto"
  // 						/>
  // 						<span className="text-xl font-bold text-gray-800">
  // 							Stamp2Fly
  // 						</span>
  // 					</motion.div>
  // 				</Link>

  // 				{/* CENTER - Navigation (Desktop only) */}
  // 				{isHomePage && (
  // 					<div className="hidden md:flex items-center gap-8 font-medium">
  // 						<a href="#apply" className="text-gray-700 hover:text-blue-600 transition">
  // 							Apply Visa
  // 						</a>
  // 						<a href="#checklist" className="text-gray-700 hover:text-blue-600 transition">
  // 							Visa Checklist
  // 						</a>
  // 					</div>
  // 				)}

  // 				{/* RIGHT - Contact Button */}
  // 				<div className="flex items-center">
  // 					{isLoggedIn ? (
  // 						<div className="hidden md:flex items-center gap-2 mr-3">
  // 							{!isAdmin && (
  // 								<Button asChild variant="outline" className="rounded-lg px-3">
  // 									<Link to="/dashboard">My Applications</Link>
  // 								</Button>
  // 							)}
  // 							<div className="flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 bg-white">
  // 								<User className="h-4 w-4 mr-2 text-gray-500" />
  // 								{displayName}
  // 							</div>
  // 							<Button variant="outline" className="rounded-lg px-3" onClick={handleLogout}>
  // 								<LogOut className="h-4 w-4 mr-2" />
  // 								Logout
  // 							</Button>
  // 						</div>
  // 					) : (
  // 						<div className="hidden md:flex items-center gap-2 mr-2">
  // 							<Button asChild variant="outline" className="rounded-lg px-4">
  // 								<Link to="/login">Login</Link>
  // 							</Button>
  // 							<Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4">
  // 								<Link to="/signup">Sign Up</Link>
  // 							</Button>
  // 						</div>
  // 					)}

  // 					{isLoggedIn && (
  // 						<div className="md:hidden mr-2 flex items-center gap-1">
  // 							{!isAdmin && (
  // 								<Button asChild variant="outline" size="sm" className="px-2 text-xs">
  // 									<Link to="/dashboard">My Apps</Link>
  // 								</Button>
  // 							)}
  // 							<div className="flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 bg-white max-w-[120px] truncate">
  // 								<User className="h-3.5 w-3.5 mr-1 text-gray-500 shrink-0" />
  // 								<span className="truncate">{displayName}</span>
  // 							</div>
  // 							<Button variant="outline" size="sm" className="px-2" onClick={handleLogout}>
  // 								<LogOut className="h-3.5 w-3.5" />
  // 							</Button>
  // 						</div>
  // 					)}

  // 					{/* Desktop Button */}
  // 					<Button
  // 						asChild
  // 						className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
  // 					>
  // 						<Link to="/contact">Contact Us</Link>
  // 					</Button>

  // 					{/* Mobile Button */}
  // 					<button
  // 						onClick={() => navigate("/contact")}
  // 						className="md:hidden px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition"
  // 					>
  // 						Contact Us
  // 					</button>

  // 				</div>

  // 			</div>
  // 		</div>
  // 	</header>
  // );
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LEFT - Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ac7c5e33-833b-415b-87a1-38b5119ebfe9/1e7b9ac90d11a07facf22532137e65d6.png"
                alt="Stamp2Fly Brandmark"
                className="h-9 w-auto"
              />
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
                Stamp2Fly
              </span>
            </motion.div>
          </Link>

          {/* CENTER - Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {isHomePage && (
              <>
                <a
                  href="#apply"
                  onClick={handleSectionNavigate("apply")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Apply Visa
                </a>
                <a
                  href="#checklist"
                  onClick={handleSectionNavigate("checklist")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Visa Checklist
                </a>
                <a
                  href="#blog"
                  onClick={handleSectionNavigate("blog")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Blog
                </a>
                {!isAdmin && (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    My Applications
                  </Link>
                )}
              </>
            )}

            {/* <Link
              to="/blog"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Blog
            </Link> */}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* AUTH SECTION */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3">
                {/* {!isAdmin && (
                  <Button asChild variant="ghost" className="rounded-full px-4">
                    <Link to="/dashboard">My Applications</Link>
                  </Button>
                )} */}

                <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{displayName}</span>
                </div>

                <Button
                  variant="ghost"
                  className="rounded-full px-3 text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Button
                  asChild
                  className="rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* CONTACT BUTTON */}
            {!isLoggedIn ? (
              <Button
                asChild
                className="hidden md:inline-flex rounded-full px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Link to="/contact">Contact</Link>
              </Button>
            ) : null}

            {/* MOBILE */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/contact")}
                className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-full text-sm shadow"
              >
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
