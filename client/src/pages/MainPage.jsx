import Navbar from "../components/Navbar/Navbar"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Particle from "../components/Particle";


const word = 'A platform for beginners to practice coding. '

function MainPage() {
  const [ typeWord, setTypeWord ] = useState('')
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/problems')
  }

  useEffect(() => {
    if (typeWord === word) {
      const timeout = setTimeout(() => {
        setTypeWord("");
      }, 9000);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setTypeWord(word.slice(0, typeWord.length + 1));
    }, 70);
    return () => clearTimeout(timeout);
  }, [typeWord])
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="z-2">
        <Navbar style={{ zIndex: 2 }}/>
      </div>
      <div className="flex-grow w-full mx-auto relative bg-[#1A1A1A]">
        <div className="relative md:absolute md:right-20 md:top-1/2 md:transform md:-translate-y-1/2 z-10 mx-auto ">
          <img src={`/logo-large.png`} className="opacity-30 transition-opacity  md:w-auto "/>
        </div>
        <div className="p-20 h-full flex flex-col justify-center xl:ml-44 relative z-30">
          <h1 className="text-4xl font-bold mb-5 text-white md:text-start md:text-7xl text-center">
                  Online Judge <br /> 
                  System
          </h1>
          <p className={`text-white font-normal mb-6 md:text-start text-center blink-cursor`}>
            { typeWord }
          </p>
          <div className='flex align-middle justify-center md:justify-start'>
            <button
              className='bg-brand-orange text-white py-3 px-6 lg:px-8 rounded-md text-xl font-semibold
                hover:bg-brand-orange-s 
                transition duration-300 ease-in-out'
              onClick={handleClick}
            >
              Get Started
            </button>
          </div>
          {/* support language */}
          <div className="mt-24 text-gray-300">
            <div>
              <h1>Supported Languages: </h1>
            </div>
            <div className="flex flex-row items-center mt-5">
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
      <Particle />
      </div>
    </div>
  )
}

export default MainPage