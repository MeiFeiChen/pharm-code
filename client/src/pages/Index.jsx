import Navbar from "../components/Navbar/Navbar"
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"
import { useNavigate } from 'react-router-dom'

function Index() {
  const [ init, setInit ] = useState(false)
  
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/problems')
  }

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };
    
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="z-2">
        <Navbar style={{ zIndex: 2 }}/>
      </div>
      
      
      <div className="flex-grow w-full mx-auto relative bg-[#1A1A1A]">
      <div className="relative md:absolute md:right-10 md:top-1/3 md:transform md:-translate-y-1/3 z-10 mx-auto md:mx-0">
        <img src={`/logo-large.png`} className="opacity-30 transition-opacity  md:w-auto"/>
      </div>
        <div className="mx-auto max-w-7xl pt-16 lg:pt-32 sm:pb-24 px-2 relative">

          <div className='height-work  absolute z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-12 my-16'>
              <div className='col-span-7'>
                <h1 className="text-4xl lg:text-7xl font-bold mb-5 text-white md:4px md:text-start text-center">
                    Online Judge <br /> 
                    System
                </h1>
                <p className='text-white md:text-lg font-normal mb-6 md:text-start text-center'>
                  
                  A platform for beginners to practice and solve coding problems online. 
                  <br/>
                  <span className="text-gray-400">Supports Python, JavaScript, MySQL.</span>
                </p>
                
                <div className='flex align-middle justify-center md:justify-start'>
                    <button
                      className='bg-brand-orange text-white py-3 px-6 lg:px-8 rounded-md text-xl font-semibold
                        hover:text-brand-orange hover:bg-white hover-shadow placeholder:hover:border-2 hover:border-brand-orange border-2 border-transparent
                        transition duration-300 ease-in-out'
                      onClick={handleClick}
                    >Get Started</button>
                </div>
                <div className="flex flex-row items-center mt-20">
                <div className="mr-5">
                  <img src={`/python.png`} className="w-16 hover-shadow"/>
                </div>
                  <div className="mr-5">
                    <img src={`/js.png`} className="w-16 hover-shadow"/>
                  </div>
                  <div className="mr-5">
                    <img src={`/SQL.png`} className="w-16 hover-shadow"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   

        
 

        { init && <Particles
              width='100%'
              height='100%'
              className="z-0"
              id="tsparticles"
              particlesLoaded={particlesLoaded}
              style={{ pointerEvents: 'none' }}
              options={{
                  fullscreen: {
                    enable:false,
                    zIndex:-1
                  },
                  style: {
                    position: 'absolute'
                  },
                  background: {
                      color: {
                          value: "#1A1A1A",
                      },
                  },
                  fpsLimit: 100,
                  interactivity: {
                      events: {
                          onClick: {
                            enable: false
                          }, 
                          onHover: {
                              enable: true,
                              mode: "repulse",
                          },
                          resize: true,
                      },
                      modes: {
                          repulse: {
                              distance: 200,
                              duration: 0.4,
                          },
                      },
                  },
                  particles: {
                      color: {
                          value: ["#ffffff", "#3ad765", "#2b8be0", "#f99420"],
                      },
                      links: {
                          color: "#ffffff",
                          distance: 140,
                          enable: true,
                          opacity: 0.2,
                          width: 1,
                      },
                      move: {
                          direction: "none",
                          enable: true,
                          outModes: {
                              default: "bounce",
                          },
                          random: false,
                          speed: 1,
                          straight: false,
                      },
                      number: {
                          density: {
                              enable: true,
                              area: 800,
                          },
                          value: 80,
                      },
                      opacity: {
                          value: 0.3,
                      },
                      shape: {
                          type: "circle",
                      },
                      size: {
                          value: { min: 1, max: 5 },
                      },
                  },
                  detectRetina: true,
              }}
          />
      }



      </div>
    </div>
  )
}

export default Index