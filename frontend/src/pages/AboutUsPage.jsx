import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, BookOpen } from "lucide-react";

const AboutUsPage = () => {
	return (
		<>
			<Helmet>
				<title>About Us - Stamp2Fly</title>
				<meta
					name="description"
					content="Learn about Stamp2Fly's mission to simplify visa applications and make international travel more accessible for everyone."
				/>
			</Helmet>
			<Header />
			{/* <main>
        <div className="bg-gradient-to-b from-emerald-50 to-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl lg:text-center"
            >
              <h1 className="text-base font-semibold leading-7 text-emerald-600">Our Story</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Making Travel Simple, One Visa at a Time
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We started Stamp2Fly with a simple goal: to eliminate the confusion and stress from the visa application process, making global travel accessible for everyone.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:pr-8 lg:pt-4"
              >
                <div className="lg:max-w-lg">
                  <h2 className="text-base font-semibold leading-7 text-blue-600">Our Mission & Values</h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Trusted Partner in Global Travel</p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    <div className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <Target className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                        Our Mission.
                      </dt>
                      <dd className="inline"> To make international travel accessible to everyone by simplifying the visa application process through technology and expert support.</dd>
                    </div>
                    <div className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <BookOpen className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                        Our Story.
                      </dt>
                      <dd className="inline"> Founded in 2020, Stamp2Fly was born out of the frustration with complicated and opaque visa procedures. We decided to build a platform that is user-friendly, transparent, and supportive every step of the way.</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <img 
                  alt="Team members collaborating in a modern office."
                  className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
                  width="2432"
                  height="1442"
                 src="https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd" />
              </motion.div>
            </div>
          </div>
        </div>
      </main> */}
			<main className="bg-white">
				{/* HERO SECTION */}
				<section className="bg-gradient-to-b from-emerald-50 via-blue-50 to-white py-20 sm:py-24">
					<div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="max-w-3xl mx-auto"
						>
							<h1 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
								Our Story
							</h1>

							<h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
								Making Travel Simple, One Visa at a Time
							</h2>

							<p className="mt-6 text-lg text-gray-600 leading-relaxed">
								We started Stamp2Fly with a simple goal: to eliminate confusion
								and stress from the visa application process, making global
								travel accessible for everyone.
							</p>
						</motion.div>
					</div>
				</section>

				{/* MISSION SECTION */}
				<section className="py-20 sm:py-24">
					<div className="mx-auto max-w-6xl px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							{/* LEFT TEXT */}
							<motion.div
								initial={{ opacity: 0, x: -40 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.7 }}
							>
								<h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
									Our Mission & Values
								</h3>

								<p className="mt-3 text-3xl font-bold text-gray-900 leading-snug">
									Your Trusted Partner in Global Travel
								</p>

								<div className="mt-8 space-y-8 text-gray-600">
									<div className="flex items-start gap-4">
										<Target className="w-6 h-6 text-blue-600 mt-1" />
										<p>
											<span className="font-semibold text-gray-900">
												Our Mission:
											</span>
											To make international travel accessible by simplifying
											visa applications through technology and expert support.
										</p>
									</div>

									<div className="flex items-start gap-4">
										<BookOpen className="w-6 h-6 text-blue-600 mt-1" />
										<p>
											<span className="font-semibold text-gray-900">
												Our Story:
											</span>
											Founded in 2020, Stamp2Fly was built to remove the
											complexity of opaque visa procedures and replace them with
											clarity and support.
										</p>
									</div>
								</div>
							</motion.div>

							{/* RIGHT IMAGE */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.7 }}
								className="flex justify-center"
							>
								<img
									alt="Team collaborating"
									className="w-full max-w-lg rounded-2xl shadow-xl"
									src="https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd"
								/>
							</motion.div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
};

export default AboutUsPage;
