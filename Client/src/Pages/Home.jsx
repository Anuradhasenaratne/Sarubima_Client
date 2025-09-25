import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

const Home = () => {
  const { user: contextUser, setUser, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();
  const [isHoveredLogin, setIsHoveredLogin] = useState(false);
  const [isHoveredRegister, setIsHoveredRegister] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get user data from localStorage if context doesn't have it
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const token = localStorage.getItem("token");

    if (userInfo && token) {
      setUserData(JSON.parse(userInfo));
    } else if (contextUser) {
      setUserData(contextUser);
    } else {
      setUserData(null);
    }
  }, [contextUser]);

  return (
    <div className="w-full bg-white pt-2 md:pt-6 lg:pt-2">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-700 to-green-400 text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">
          <div className="max-w-2xl">
            <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
              <img src={assets.logo} alt="Climate Ace Logo" className="w-40 h-40" />
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-white">SARUBIMA</span> <span className="text-yellow-300">.LK</span>
              </h1>
            </div>
            <p className="text-xl mb-8 text-green-100">
              Your personal guide to understanding and reducing your environmental impact through data-driven insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {userData ? (
                <NavLink
                  onClick={() => window.scrollTo(0, 0)}
                  to="/FR"
                  className="bg-yellow-300 hover:bg-yellow-400 text-green-800 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Calculate Your Footprint
                </NavLink>
              ) : (
                <>
                  <NavLink
                    onClick={() => window.scrollTo(0, 0)}
                    to="/login"
                    className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 font-bold py-4 px-8 rounded-full text-lg 
                               transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                               flex items-center justify-center overflow-hidden group"
                    onMouseEnter={() => setIsHoveredLogin(true)}
                    onMouseLeave={() => setIsHoveredLogin(false)}
                    style={{ minWidth: '200px' }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center justify-center">
                      <div className={`transition-transform duration-300 ${isHoveredLogin ? 'translate-x-2' : ''}`}>
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-3" />
                      </div>
                      <span>Login</span>
                      <div className={`ml-3 transition-all duration-300 ${isHoveredLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </NavLink>

                  <NavLink
                    onClick={() => window.scrollTo(0, 0)}
                    to="/Register"
                    className="relative bg-white text-green-800 font-bold py-4 px-8 rounded-full text-lg 
                               transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                               border-2 border-yellow-400 flex items-center justify-center overflow-hidden group"
                    onMouseEnter={() => setIsHoveredRegister(true)}
                    onMouseLeave={() => setIsHoveredRegister(false)}
                    style={{ minWidth: '200px' }}
                  >
                    <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center justify-center">
                      <div className={`transition-transform duration-300 ${isHoveredRegister ? 'translate-x-2' : ''}`}>
                        <FontAwesomeIcon icon={faUserPlus} className="mr-3" />
                      </div>
                      <span>Register</span>
                      <div className={`ml-3 transition-all duration-300 ${isHoveredRegister ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <FontAwesomeIcon icon={faArrowDown} />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

       <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-3">
              WHY IT MATTERS
            </span>
            <h2 className="text-4xl font-bold text-green-800">The Climate Challenge By Numbers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { value: "420 ppm", label: "Atmospheric CO₂ Concentration", description: "Highest level in human history", icon: "🌍" },
              { value: "1.1°C", label: "Global Temperature Rise", description: "Since pre-industrial times", icon: "🔥" },
              { value: "50%", label: "Species at Risk", description: "Projected by 2100 at current rates", icon: "🐾" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-green-200">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-5xl font-bold text-green-600 mb-2">{stat.value}</h3>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</h4>
                <p className="text-gray-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
        <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-3">
              OUR SOLUTION
            </span>
            <h2 className="text-4xl font-bold text-green-800">Powerful Tools For Climate Action</h2>
          </div>
          
          <div className="space-y-28">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Carbon calculator dashboard" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-green-700/20 mix-blend-multiply"></div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  FEATURE 01
                </div>
                <h3 className="text-3xl font-bold text-green-800 mb-4">Precision Carbon Calculator</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our AI-powered calculator analyzes your lifestyle across 12 different categories to give you the most accurate carbon footprint assessment available.
                </p>
                <ul className="space-y-3 mb-6">
                  {["Home energy analysis", "Transportation impact", "Diet carbon scoring", "Shopping footprint"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <NavLink 
                  to="/carbon-calculator" 
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors"
                >
                  Try the calculator
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </NavLink>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Personalized action plan" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply"></div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  FEATURE 02
                </div>
                <h3 className="text-3xl font-bold text-green-800 mb-4">Tailored Action Plan</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Get personalized recommendations based on your unique footprint. We prioritize actions that will make the biggest impact for your specific situation.
                </p>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 mb-6">
                  <p className="italic text-gray-700 mb-3">"By following Climate Ace's recommendations, I reduced my carbon footprint by 35% in just 6 months!"</p>
                  <p className="font-semibold text-green-700">— Michael T., Climate Ace Pro User</p>
                </div>
                <NavLink 
                  to="/solutions" 
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors"
                >
                  See action plans
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </NavLink>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Progress tracking" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-purple-700/20 mix-blend-multiply"></div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                  FEATURE 03
                </div>
                <h3 className="text-3xl font-bold text-green-800 mb-4">Progress Tracking & Rewards</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Visualize your impact over time with beautiful dashboards and earn achievements as you reach sustainability milestones.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: "85%", label: "User retention" },
                    { value: "4.8★", label: "Average rating" },
                    { value: "10k+", label: "CO₂ tons reduced" },
                    { value: "24/7", label: "Support" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <NavLink 
                  to="/signup" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Start Tracking Now
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
    <section className="py-20 bg-green-900 text-white">
  <div className="container mx-auto px-6 text-center">
    <div className="mb-12">
      <span className="inline-block px-4 py-1 bg-yellow-400 text-green-900 rounded-full text-sm font-semibold mb-3">
        COMMUNITY VOICES
      </span>
      <h2 className="text-4xl font-bold text-yellow-300">What Our Users Say</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        {
          quote: "Climate Ace made me realize how much impact small changes can make. I've reduced my footprint by 40%!",
          name: "Sarah J.",
          role: "Homeowner",
          avatar: "👩"
        },
        {
          quote: "As a business owner, the detailed reports helped me make sustainable choices that also saved money.",
          name: "David R.",
          role: "Small Business Owner",
          avatar: "👨‍💼"
        },
        {
          quote: "The educational content is superb. My whole family uses Climate Ace to learn about sustainability.",
          name: "Maria K.",
          role: "Teacher & Parent",
          avatar: "👩‍🏫"
        }
      ].map((testimonial, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-green-700 to-green-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-green-600"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 text-3xl flex items-center justify-center bg-yellow-300 text-green-900 rounded-full shadow-md">
              {testimonial.avatar}
            </div>
          </div>
          <p className="text-lg italic mb-4 text-green-100">"{testimonial.quote}"</p>
          <div className="text-center">
            <p className="font-bold text-yellow-300">{testimonial.name}</p>
            <p className="text-green-200 text-sm">{testimonial.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r text-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Become a Climate Leader?</h2>
          <p className="text-xl mb-8">Join our community of 50,000+ people taking meaningful action against climate change every day.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink to="/signup" className="bg-yellow-300 hover:bg-yellow-400 text-green-800 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Free
            </NavLink>
            <NavLink to="/demo" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300">
              Watch Product Tour
            </NavLink>
          </div>
          <p className="mt-6 text-green-700 text-sm">No credit card required • 7-day free trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

export default Home;