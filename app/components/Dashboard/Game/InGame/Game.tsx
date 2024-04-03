'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Plane } from './Plane';
import { Lighting, AmbientLighting } from './lighting';
import { Ball } from './Ball';
import { TableModule } from './Table';
import { PaddleModule } from './Paddle';
import { io } from 'socket.io-client';

const GameCanvas = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const socket = io('http://localhost:4000/');
        socket.on('connect', () => {
            socket.emit('join', 'lMa0J3z3');
        });
        socket.on('room', (data) => {
            if (data === 'Room is full!') {
                console.log('Room is full!');
                return;
            }
            console.log('You joined room: ' + data.id);
        });

        let ball = new Ball(1)
        scene.add(ball);
        // socket.on('game', (data) => {
        //   if (ball) {
        //     ball.position.set(data.x, data.y, data.z);
        //     ball.rotation.set(data.ball.rotation.x, data.ball.rotation.y, data.ball.rotation.z);
        //   } else {
        //     ball = new Ball(0.3, data, { x: 0, y: 0, z: 0 });
        //     scene.add(ball);
        //   }
        // });
        socket.on('disconnect', () => {
          scene.remove(ball);
          // ball = null;
          console.log('Disconnected from server');
        });

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

        const plane = new Plane(500, 500, { x: 0, y: 0, z: 0 }, -Math.PI / 2, 'textures/plane.jpg');
        scene.add(plane);

        const tableModule = new TableModule(scene);
        tableModule.loadTable();
        tableModule.createNet();

        const paddle = new PaddleModule(scene, { x: 13.0, y: 10.0, z: 0.0 });
        const paddle2 = new PaddleModule(scene, { x: -13.0, y: 10.0, z: 0.0 });
        const handleMouseMove = (event: MouseEvent) => {
            if (mountRef.current) {
              const { left, top, width, height } = mountRef.current.getBoundingClientRect();
              const mouseX = ((event.clientX - left) / width) * 2 - 1;
              const mouseY = -((event.clientY - top) / height) * 2 + 1;
        
              paddle.position.z = -(mouseX * 10);
              paddle.position.y = mouseY * 10 + 10;
              paddle.position.x = -(mouseY * 10) + 15;
        
              let data = {
                room: 'lMa0J3z3',
                paddle: { x: paddle.position.x, y: paddle.position.y, z: paddle.position.z },
              };
            //   socket.emit('paddle', data);
        
              camera.position.y = mouseY * 2 + 15;
              camera.position.z = -(mouseX * 2);
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
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            scene.clear();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '75vh', cursor: `none` }} />;
};

export default GameCanvas;
