import React, { useEffect, useState } from "react";
import FloatingIcon from "./FloatingIcon";
import { Badge } from "@/components/ui/badge";

interface IconConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  left: string;
  top: string;
  rotate: string;
  transitionDelay?: number;
  borderRadius?: string;
}

const iconConfigs: IconConfig[] = [
  {
    src: "/Images/Icons/docker.png",
    alt: "Docker Icon",
    width: 60,
    height: 60,
    left: "3%",
    top: "2%",
    rotate: "-20deg",
    transitionDelay: 0,
  },
  {
    src: "/Images/Icons/Server.gif",
    alt: "Server Icon",
    width: 60,
    height: 60,
    left: "3%",
    top: "15%",
    rotate: "-20deg",
    transitionDelay: 50,
  },
  {
    src: "/Images/Icons/devops.png",
    alt: "DevOps Icon",
    width: 60,
    height: 60,
    left: "90%",
    top: "1%",
    rotate: "-25deg",
    transitionDelay: 100,
  },
  {
    src: "/Images/Icons/Resume.gif",
    alt: "Resume Icon",
    width: 60,
    height: 60,
    left: "93%",
    top: "15%",
    rotate: "-25deg",
    transitionDelay: 150,
    borderRadius: "90%",
  },
  {
    src: "/Images/Icons/graduation-cap.gif",
    alt: "Graduation Icon",
    width: 50,
    height: 50,
    left: "87%",
    top: "28%",
    rotate: "10deg",
    transitionDelay: 200,
  },
  {
    src: "/Images/Icons/job-interview.gif",
    alt: "Interview Icon",
    width: 55,
    height: 55,
    left: "9%",
    top: "25%",
    rotate: "10deg",
    transitionDelay: 250,
  },
  {
    src: "/Images/Icons/resume.png",
    alt: "Resume Icon",
    width: 55,
    height: 55,
    left: "16%",
    top: "38%",
    rotate: "10deg",
    transitionDelay: 300,
  },
  {
    src: "/Images/Icons/java.gif",
    alt: "Resume Icon",
    width: 55,
    height: 55,
    left: "76%",
    top: "38%",
    rotate: "10deg",
    transitionDelay: 300,
  },
];

const IconLayer: React.FC = () => {
  const [stackIcons, setStackIcons] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    const handleScroll = () => {
      const triggerPoint = 170;
      setStackIcons(window.scrollY > triggerPoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Mobile Grid Layout */}
{/* //       <div className="absolute inset-0 z-0 sm:hidden mt-80 px-6 py-10">
//         <div className="grid grid-cols-3 gap-6 justify-items-center">
//           {iconConfigs.map((icon, index) => (
//             <img
//               key={index}
//               src={icon.src}
//               alt={icon.alt}
//               width={40}
//               height={40}
//               className="border border-gray-200 border-opacity-60 rounded-xl"
//               style={{
//                 transform: `rotate(${icon.rotate})`,
//                 transitionDelay: `${icon.transitionDelay || 0}ms`,
//               }}
//             />
//           ))}
//         </div>
//       </div> */}

      {/* Unified Floating Layout for all screens */}
      <div className="absolute inset-0 z-0">
        {iconConfigs.map((icon, index) => (
          <FloatingIcon
            key={index}
            {...icon}
            stacked={stackIcons}
            style={{
              transitionDelay: `${icon.transitionDelay || 0}ms`,
              width: isMobile ? icon.width * 0.6 : icon.width,
              height: isMobile ? icon.height * 0.6 : icon.height,
            }}
          />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-primary/20">
            <span className="text-sm font-medium">
              Professional Assessment Platform
            </span>
          </div> */}
          <Badge
          variant="outline"
          className="w-fit mx-auto mb-6 lg:mx-0 bg-gradient-to-r from-slate-50 to-slate-100 text-[#2D3253]"
          >
            {/* Trusted by 100+ businesses */}
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight text-[#2D3253]">
            Build the Skills that <br />
            power your{" "}
            <img
              src="/Images/Icons/794uUwps6bKmtOv9ahBBfUiCY.webp"
              alt="Career Icon"
              className="inline-block mx-2 align-middle border border-gray-200 border-opacity-60 rounded-xl rotate-[10deg] w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
            />{" "}
            Career
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Take the next step in your career with AInode
          </p>

          <div className="flex gap-4 justify-center relative mb-24 lg:mb-0">
            <button
              className="text-white cursor-pointer group justify-center flex items-center gap-3 px-8 py-3 pl-6 pr-6 text-xs lg:text-lg rounded-2xl bg-gradient-to-r from-gray-800 to-gray-600 border-2 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-500 hover:border-gray-900"
              onClick={() => {
                window.location.href = '/services/ai-assessment?tab=personalized';
              }}
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right size-4 group-hover:translate-x-1 transition-transform duration-300"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <div className="inline-flex items-center justify-center px-8 py-3 pl-6 pr-6 text-xs lg:text-lg border border-gray-600 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-2xl font-medium transition-colors cursor-pointer hover:scale-105">
              Learn More
            </div>
          </div>
        </div>

        <img
          src="/Images/Sttarkel_Student6.png"
          alt="Career Icon"
          width={600}
          height={600}
          // className="inline-block mr-10 mt-16 lg:mx-10 align-middle border-gray-200 border-opacity-60 rounded-xl"
          className="inline-block mr-10 mt-0 lg:mx-10 align-middle border-gray-200 border-opacity-60 rounded-xl"
          style={{
            verticalAlign: "middle",
            transform: "translateY(20%)",
          }}
        />
      </div>
    </div>
  );
};

export default IconLayer;

















// --- Hmm ok ok code

// import React, { useEffect, useState } from "react";
// import FloatingIcon from "./FloatingIcon";

// interface IconConfig {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   left: string;
//   top: string;
//   rotate: string;
//   transitionDelay?: number;
//   borderRadius?: string;
// }

// const iconConfigs: IconConfig[] = [
//   {
//     src: "/Images/Icons/docker.png",
//     alt: "Docker Icon",
//     width: 60,
//     height: 60,
//     left: "3%",
//     top: "2%",
//     rotate: "-20deg",
//     transitionDelay: 0,
//   },
//   {
//     src: "/Images/Icons/Server.gif",
//     alt: "Server Icon",
//     width: 60,
//     height: 60,
//     left: "3%",
//     top: "15%",
//     rotate: "-20deg",
//     transitionDelay: 0,
//   },
//   {
//     src: "/Images/Icons/devops.png",
//     alt: "DevOps Icon",
//     width: 60,
//     height: 60,
//     left: "90%",
//     top: "1%",
//     rotate: "-25deg",
//     transitionDelay: 100,
//   },
//   {
//     src: "/Images/Icons/Resume.gif",
//     alt: "Resume Icon",
//     width: 60,
//     height: 60,
//     left: "93%",
//     top: "15%",
//     rotate: "-25deg",
//     transitionDelay: 100,
//     borderRadius: "90%",
//   },
//   {
//     src: "/Images/Icons/graduation-cap.gif",
//     alt: "Graduation Icon",
//     width: 50,
//     height: 50,
//     left: "87%",
//     top: "28%",
//     rotate: "10deg",
//     transitionDelay: 200,
//   },
//   {
//     src: "/Images/Icons/job-interview.gif",
//     alt: "Interview Icon",
//     width: 55,
//     height: 55,
//     left: "9%",
//     top: "25%",
//     rotate: "10deg",
//     transitionDelay: 300,
//   },
//   {
//     src: "/Images/Icons/resume.png",
//     alt: "Resume Icon",
//     width: 55,
//     height: 55,
//     left: "16%",
//     top: "38%",
//     rotate: "10deg",
//     transitionDelay: 400,
//   },
// ];

// const IconLayer: React.FC = () => {
//   const [stackIcons, setStackIcons] = useState<boolean>(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const triggerPoint = 170;
//       setStackIcons(window.scrollY > triggerPoint);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="relative w-full flex items-center justify-center overflow-hidden">
//       {/* Mobile Grid Layout */}
//       <div className="absolute inset-0 z-0 sm:hidden mt-80 px-6 py-10">
//         <div className="grid grid-cols-3 gap-6 justify-items-center">
//           {iconConfigs.map((icon, index) => (
//             <img
//               key={index}
//               src={icon.src}
//               alt={icon.alt}
//               width={40}
//               height={40}
//               className="border border-gray-200 border-opacity-60 rounded-xl"
//               style={{
//                 transform: `rotate(${icon.rotate})`,
//                 transitionDelay: `${icon.transitionDelay || 0}ms`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Desktop Floating Layout */}
//       <div className="absolute inset-0 z-0 hidden sm:block">
//         {iconConfigs.map((icon, index) => (
//           <FloatingIcon
//             key={index}
//             {...icon}
//             stacked={stackIcons}
//             style={{
//               transitionDelay: `${icon.transitionDelay || 0}ms`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Foreground Content */}
//       <div className="relative z-10">
//         <div className="text-center max-w-4xl mx-auto">
//           <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-primary/20">
//             <span className="text-sm font-medium">
//               Professional Assessment Platform
//             </span>
//           </div>
//           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight text-[#2D3253]">
//             Build the Skills that <br />
//             power your{" "}
//             <img
//               src="/Images/Icons/794uUwps6bKmtOv9ahBBfUiCY.webp"
//               alt="Career Icon"
//               className="inline-block mx-2 align-middle border border-gray-200 border-opacity-60 rounded-xl rotate-[10deg] w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
//             />{" "}
//             Career
//           </h1>
//           <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
//             Take the next step in your career with AIspire
//           </p>

//           <div className="flex gap-4 justify-center relative mb-24 lg:mb-0">
//             <div>
//               <a
//                 href="#"
//                 className="text-white cursor-pointer group justify-center flex items-center gap-3 px-8 py-3 pl-6 pr-6 text-xs lg:text-lg rounded-2xl bg-gradient-to-r from-gray-800 to-gray-600 border-2 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-500 hover:border-gray-900"
//                 onClick={() => {
//                   console.log("Get Started clicked");
//                 }}
//               >
//                 Get Started
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width={24}
//                   height={24}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="lucide lucide-arrow-right size-4 group-hover:translate-x-1 transition-transform duration-300"
//                   aria-hidden="true"
//                 >
//                   <path d="M5 12h14" />
//                   <path d="m12 5 7 7-7 7" />
//                 </svg>
//               </a>
//             </div>
//             <div className="inline-flex items-center justify-center px-8 py-3 pl-6 pr-6 text-xs lg:text-lg border border-gray-600 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-2xl font-medium transition-colors cursor-pointer hover:scale-105">
//               Learn More
//             </div>
//           </div>
//         </div>

//         <img
//           src="/Images/Sttarkel_Student4.png"
//           alt="Career Icon"
//           width={600}
//           height={600}
//           className="inline-block mr-10 mt-16 lg:mx-10 align-middle border-gray-200 border-opacity-60 rounded-xl"
//           style={{
//             verticalAlign: "middle",
//             transform: "translateY(20%)",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default IconLayer;

























// --------- This is the original code ---------

// import React, { useEffect, useState } from "react";
// import FloatingIcon from "./FloatingIcon";

// interface IconConfig {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   left: string;
//   top: string;
//   rotate: string;
//   transitionDelay?: number;
//   borderRadius?: string;
// }

// const iconConfigs: IconConfig[] = [
//   {
//     src: "/Images/Icons/docker.png",
//     alt: "Docker Icon",
//     width: 60,
//     height: 60,
//     left: "3%",
//     top: "2%",
//     rotate: "-20deg",
//     transitionDelay: 0,
//   },
//   {
//     src: "/Images/Icons/Server.gif",
//     alt: "Docker Icon",
//     width: 60,
//     height: 60,
//     left: "3%",
//     top: "15%",
//     rotate: "-20deg",
//     transitionDelay: 0,
//   },
//   {
//     src: "/Images/Icons/devops.png",
//     alt: "DevOps Icon",
//     width: 60,
//     height: 60,
//     left: "90%",
//     top: "1%",
//     rotate: "-25deg",
//     transitionDelay: 100,
//   },
//   {
//     src: "/Images/Icons/Resume.gif",
//     alt: "DevOps Icon",
//     width: 60,
//     height: 60,
//     left: "93%",
//     top: "15%",
//     rotate: "-25deg",
//     transitionDelay: 100,
//     borderRadius: "90%",
//   },
//   {
//     src: "/Images/Icons/graduation-cap.gif",
//     alt: "AI Icon",
//     width: 50,
//     height: 50,
//     left: "87%",
//     top: "28%",
//     rotate: "10deg",
//     transitionDelay: 200,
//   },
//   {
//     src: "/Images/Icons/job-interview.gif",
//     alt: "Interview Icon",
//     width: 55,
//     height: 55,
//     left: "9%",
//     top: "25%",
//     rotate: "10deg",
//     transitionDelay: 300,
//   },
//   {
//     src: "/Images/Icons/resume.png",
//     alt: "Resume Icon",
//     width: 55,
//     height: 55,
//     left: "16%",
//     top: "38%",
//     rotate: "10deg",
//     transitionDelay: 400,
//   },
// ];

// const IconLayer: React.FC = () => {
//   const [stackIcons, setStackIcons] = useState<boolean>(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const triggerPoint = 170; // scroll distance where icons animate out
//       setStackIcons(window.scrollY > triggerPoint);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     // <div className="relative w-full lg:h-[100vh] h-[60vh] flex items-center justify-center overflow-hidden">
//     <div className="relative w-full flex items-center justify-center overflow-hidden">

//       {/* Icons behind laptop */}
//       <div className="absolute inset-0 z-0">
//         {iconConfigs.map((icon, index) => (
//           <FloatingIcon
//             key={index}
//             {...icon}
//             stacked={stackIcons}
//             style={{
//               transitionDelay: `${icon.transitionDelay || 0}ms`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Laptop image always above */}
//       <div className="relative z-10 ">
//         <div className="text-center max-w-4xl mx-auto">
//           <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-primary/20">
//             {/* <Sparkles className="h-4 w-4 text-primary animate-pulse" /> */}
//             <span className="text-sm font-medium">
//               Professional Assessment Platform
//             </span>
//           </div>
//           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight text-[#2D3253]">
//             Build the Skills that <br />
//             power your{" "}
//             <img
//               src="/Images/Icons/794uUwps6bKmtOv9ahBBfUiCY.webp"
//               alt="Career Icon"
//               className="inline-block mx-2 align-middle border border-gray-200 border-opacity-60 rounded-xl rotate-[10deg] w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
//             />{" "}
//             Career
//           </h1>
//           <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
//             Take the next step in your career with AIspire
//           </p>
//           {/* <div className="flex flex-col sm:flex-row gap-4 justify-center relative"> */}
//           <div className="flex gap-4 justify-center relative mb-24 lg:mb-0">
//             {/* <div
//               className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer hover:scale-105"
//               onClick={() => navigate("/services/ai-assessment")}
//             >
//               Get Started
//               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             </div> */}
//             <div>
//               <a
//                 href="#"
//                 className="text-white cursor-pointer group justify-center flex items-center gap-3 px-8 py-3 pl-6 pr-6 text-xs lg:text-lg rounded-2xl bg-gradient-to-r from-gray-800 to-gray-600 border-2 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-500 hover:border-gray-900" 
//                 onClick={() => {
//                   console.log('Get Started clicked');
//                   // navigate('/services/ai-assessment');
//                 }}
//               >
//                 Get Started
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width={24}
//                   height={24}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="lucide lucide-arrow-right size-4 group-hover:translate-x-1 transition-transform duration-300"
//                   aria-hidden="true"
//                 >
//                   <path d="M5 12h14" />
//                   <path d="m12 5 7 7-7 7" />
//                 </svg>
//               </a>
//             </div>
//             <div
//               className="inline-flex items-center justify-center px-8 py-3 pl-6 pr-6 text-xs lg:text-lg border border-gray-600 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-2xl font-medium transition-colors cursor-pointer hover:scale-105"
//               // onClick={() => navigate("/about")}
//             >
//               Learn More
//             </div>
//           </div>
//         </div>
//         <img
//           src="/Images/Sttarkel_Student4.png"
//           // src="/Images/AIspire_girl.webp"

//           alt="Career Icon"
//           width={600}
//           height={600}
//           className="inline-block mr-10 lg:mx-10 align-middle border-gray-200 border-opacity-60 rounded-xl"
//           style={{
//             verticalAlign: "middle",
//             transform: "translateY(20%)", // ⬅️ keep laptop slightly up
//           }}
//         />
//       </div>
//     </div>
//   );
  
// };

// export default IconLayer;
