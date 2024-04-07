'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Plane } from './Plane';
import { Lighting, AmbientLighting } from './lighting';
import { Ball } from './Ball';
import { TableModule } from './Table';
import { Paddle } from './Paddle';
import { useGlobalState } from '@/app/components/Sign/GlobalState';

const GameCanvas = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const paddlePositionRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastEmittedPositionRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const paddle2Ref = useRef<Paddle | null>(null);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  
  
  useEffect(() => {
    if (socket && user) {
      // Emit the joinGame event when the component mounts
      socket.emit('joinGame', { senderId: user.id, room: 'lMa0J3z3' });
  
      // Listen for paddle position updates from the server
      socket.on('paddlePositionUpdate', (paddlePosition: any) => {
        if (paddle2Ref.current) {
          paddle2Ref.current.position.x = -paddlePosition.paddle.x;
          paddle2Ref.current.position.y = paddlePosition.paddle.y;
          paddle2Ref.current.position.z = paddlePosition.paddle.z;
        }
      });
      
    }
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20.11, 14, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);


    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene.add(new Lighting(0xffffff, 0.8, { x: 20, y: 20, z: 0 }));
    scene.add(new Lighting(0xffffff, 0.8, { x: -20, y: 20, z: 0 }));
    scene.add(new AmbientLighting(0xffffff, 0.1));

    const plane = new Plane(500, 500, { x: 0, y: 0, z: 0 }, -Math.PI / 2);
    scene.add(plane);

    const tableModule = new TableModule(scene);
    tableModule.loadTable();
    tableModule.createNet();

    const paddle = new Paddle(scene, { x: 13.0, y: 10.0, z: 0.0 });
    const paddle2 = new Paddle(scene, { x: -13.0, y: 10.0, z: 0.0 });
    paddle2Ref.current = paddle2;
    const intervalId = setInterval(() => {
      if (paddlePositionRef.current && socket) {
        // Check if the paddle position has changed since the last emit
        const currentPosition = paddlePositionRef.current;
        const lastPosition = lastEmittedPositionRef.current;
        
        if (!lastPosition || currentPosition.x !== lastPosition.x || currentPosition.y !== lastPosition.y || currentPosition.z !== lastPosition.z) {
          // If the position has changed, emit the new position and update the last emitted position
          socket.emit('movePaddleGame', {
            room: 'lMa0J3z3',
            paddle: currentPosition,
          });

          lastEmittedPositionRef.current = { ...currentPosition };
        }
      }
    }, 1000 / 30);
    const handleMouseMove = (event: MouseEvent) => {
      if (mountRef.current) {
        const { left, top, width, height } = mountRef.current.getBoundingClientRect();
        const mouseX = ((event.clientX - left) / width) * 2 - 1;
        const mouseY = -((event.clientY - top) / height) * 2 + 1;

        paddle.position.z = -(mouseX * 10);
        paddle.position.y = mouseY * 10 + 10;
        paddle.position.x = -(mouseY * 10) + 15;

        paddlePositionRef.current = { x: paddle.position.x, y: paddle.position.y, z: paddle.position.z };

        camera.position.y = mouseY * 2 + 15;
        camera.position.z = -(mouseX * 2);

        // socket.emit('paddle',data);

      }
    };
    mountRef.current?.addEventListener('mousemove', handleMouseMove);

    function animate() {

      paddle.update();
      paddle2.update();

      renderer.render(scene, camera);

      camera.lookAt(new THREE.Vector3(0, 10, 0));
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (socket) {
        socket.off('paddlePositionUpdate');
        socket.off('movePaddle');
  
      };
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        clearInterval(intervalId);
      }
      scene.clear();
    };
  }, [socket, user]);


  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: `none` }} />
  );

};

export default GameCanvas;
