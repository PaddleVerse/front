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
  const paddleRef = useRef<Paddle | null>(null);
  const paddle2Ref = useRef<Paddle | null>(null);
  const ballRef = useRef<Ball | null>(null);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;


  useEffect(() => {
    let userID: string | null = null;
    let cameraPosition: { x: number, y: number, z: number };

    if (socket && user) {
      // Emit the joinGame event when the component mounts
      socket.emit('joinGame', { senderId: user.id, room: 'lMa0J3z3' });
      socket.on('role', (id: string) => {
        userID = id;
        console.log(id);
        if (id === 'player1') {
          // camera.position.set(20.11, 14, 0);
          cameraPosition = { x: 20.11, y: 14, z: 0 };
        } else if (id === 'player2') {
          // camera.position.set(-20.11, 14, 0);
          cameraPosition = { x: -20.11, y: 14, z: 0 };
        }
        else {
          // camera.position.set(0, 14, 20.11);
          cameraPosition = { x: 0, y: 14, z: 20.11 };
        }
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      });
      // Listen for paddle position updates from the server
      socket.on('paddlePositionUpdate', (paddlePosition: any) => {
        if (paddle2Ref.current && paddleRef.current && userID) {
          if (userID === 'player1') {
            paddle2Ref.current.position.x = paddlePosition.paddle.x;
            paddle2Ref.current.position.y = paddlePosition.paddle.y;
            paddle2Ref.current.position.z = paddlePosition.paddle.z;
          }
          else if (userID === 'player2') {
            paddleRef.current.position.x = paddlePosition.paddle.x;
            paddleRef.current.position.y = paddlePosition.paddle.y;
            paddleRef.current.position.z = paddlePosition.paddle.z;
          }
        }
      });
      socket.on("moveBall", (ball: any) => {
        // console.log(ball);
        if (ballRef.current) {
          // const ballPosition = { x: ball.position.x, y: ball.position.y, z: ball.position.z };
          // const ballVelocity = { x: ball.velocity.x, y: ball.velocity.y, z: ball.velocity.z };
          // ballRef.current.velocity = new THREE.Vector3(ballVelocity.x, ballVelocity.y, ballVelocity.z);
          // ballRef.current.moveToPosition(ballPosition);
          ballRef.current.position.set(ball.position.x, ball.position.y, ball.position.z);
          ballRef.current.rotation.set(ball.rotation.x, ball.rotation.y, ball.rotation.z);
        }
      }
      );
    }
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    let ball = new Ball(0.3, { x: 0, y: 15, z: 0 });
    scene.add(ball);
    ballRef.current = ball;
    const plane = new Plane(500, 500, { x: 0, y: 0, z: 0 }, -Math.PI / 2);
    scene.add(plane);

    const tableModule = new TableModule(scene);
    tableModule.loadTable();
    tableModule.createNet();
    let paddle: Paddle;
    let paddle2: Paddle;
    paddle = new Paddle(scene, { x: 13.0, y: 10.0, z: 0.0 });
    paddle2 = new Paddle(scene, { x: -13.0, y: 10.0, z: 0.0 });
    paddleRef.current = paddle;
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
    }, 1000 / 20);
    const handleMouseMove = (event: MouseEvent) => {
      if (mountRef.current && userID !== 'spec') {
        const { left, top, width, height } = mountRef.current.getBoundingClientRect();
        const mouseX = ((event.clientX - left) / width) * 2 - 1;
        const mouseY = -((event.clientY - top) / height) * 2 + 1;
        if (userID === 'player1') {
          paddle.position.z = -(mouseX * 10);
          paddle.position.y = mouseY * 10 + 10;
          paddle.position.x = -(mouseY * 10) + 15;
          paddlePositionRef.current = { x: paddle.position.x, y: paddle.position.y, z: paddle.position.z };
        }
        else if (userID === 'player2') {
          paddle2.position.z = (mouseX * 10);
          paddle2.position.y = mouseY * 10 + 10;
          paddle2.position.x = (mouseY * 10) - 15;
          paddlePositionRef.current = { x: paddle2.position.x, y: paddle2.position.y, z: paddle2.position.z };
        }

        camera.position.y = mouseY * 2 + 15;
        camera.position.z = -(mouseX * 2);
      }
    };
    // if the key h is pressed, the ball will move
    window.addEventListener('keydown', (e) => {
      if (e.key === 'h') {
        console.log('h')
        if(socket) socket.emit("resetBall", { room: 'lMa0J3z3' });
      }
      if (e.key === 'g') {
        ball.position.y = 0;
      }
    });
    mountRef.current?.addEventListener('mousemove', handleMouseMove);

    function animate() {

      paddle.update();
      paddle2.update();
      ball.update();
      renderer.render(scene, camera);

      camera.lookAt(new THREE.Vector3(0, 10, 0));
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (socket) {
        socket.off('paddlePositionUpdate');
        socket.off('movePaddle');
        socket.off('role');
        socket.off('moveBall');
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
