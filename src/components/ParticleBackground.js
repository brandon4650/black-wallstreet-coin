import React, { useEffect } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleBackground = () => {
  useEffect(() => {
    console.log("ParticleBackground mounted"); // Debug log
  }, []);

  const particlesInit = async (engine) => {
    console.log("Particles initializing"); // Debug log
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: 'transparent',
        },
        fpsLimit: 60,
        particles: {
          color: { value: '#f59e0b' },
          links: {
            color: '#f59e0b',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce"
            },
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 30
          },
          opacity: {
            value: 0.3
          },
          size: {
            value: 2
          }
        },
        detectRetina: true
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default ParticleBackground;