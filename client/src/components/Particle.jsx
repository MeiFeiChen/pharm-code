import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from '@tsparticles/slim';


const Particle = React.memo(() => {
  const [init, setInit] = useState(false); // State to track if particles are initialized


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
    // Render Particles component only if init is true
    init && (
      <Particles
        id="tsparticles"
        className="z-0"
        width="100%"
        height="100%"
        style={{ pointerEvents: 'none' }}
        particlesLoaded={ particlesLoaded }
        options={{
          fullscreen: { enable: false, zIndex: -1 },
          style: { position: 'absolute' },
          background: { color: { value: '#1A1A1A' } },
          fpsLimit: 100,
          interactivity: {
            events: {
              onClick: { enable: false },
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
            modes: {
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: ['#ffffff', '#3ad765', '#2b8be0', '#f99420'] },
            links: {
              color: '#ffffff',
              distance: 140,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />
    )
  );

})
Particle.displayName = 'Particle'

export default Particle