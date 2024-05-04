"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

import { Plane } from "./Plane";
import { Lighting, AmbientLighting } from "./lighting";
import { Ball } from "./Ball";
import { TableModule } from "./Table";
import { Paddle } from "./Paddle";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

interface GameCanvasProps {
  roomId: string; // Adding a roomId prop
}

const GameCanvas: React.FC<GameCanvasProps> = ({ roomId }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const paddlePositionRef = useRef<{ x: number; y: number; z: number } | null>(
    null
  );
  const lastEmittedPositionRef = useRef<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const paddleRef = useRef<Paddle | null>(null);
  const paddle2Ref = useRef<Paddle | null>(null);
  const ballRef = useRef<Ball | null>(null);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [winnerText, setWinnerText] = useState("");
  const router = useRouter();
  const [end, setEnd] = useState(false);

  useEffect(() => {
    let userID: string | null = null;
    let cameraPosition: { x: number; y: number; z: number };
    if (socket && user) {
      // Use the dynamic roomId for joining the game
      socket.emit("joinGame", { senderId: user.id, room: roomId });
      socket.on("role", (id: string) => {
        userID = id;
        if (id === "player1") {
          cameraPosition = { x: 24.11, y: 14, z: 0 };
        } else if (id === "player2") {
          cameraPosition = { x: -24.11, y: 14, z: 0 };
        } else {
          cameraPosition = { x: 0, y: 14, z: 20.11 };
        }
        camera.position.set(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
      });
      socket.on("updateScore", (newScore: any) => {
        setScore({
          player1: newScore.score[0].score,
          player2: newScore.score[1].score,
        });
      });
      socket.on("endGame", (winner: any) => {
        setEnd(true);
        setWinnerText(winner.winner === userID ? "win" : "lost");
        dispatch({type: "UPDATE_GAMESTATUS", payload: winner.winner === userID ? "win" : "lose"});
        router.push("/Dashboard");
      });
      socket.on("paddlePositionUpdate", (paddlePosition: any) => {
        if (paddle2Ref.current && paddleRef.current && userID) {
          if (userID === "player1") {
            paddle2Ref.current.position = {
              x: paddlePosition.paddle.x,
              y: paddlePosition.paddle.y,
              z: paddlePosition.paddle.z,
            };
          } else if (userID === "player2") {
            paddleRef.current.position = {
              x: paddlePosition.paddle.x,
              y: paddlePosition.paddle.y,
              z: paddlePosition.paddle.z,
            };
          }
        }
      });

      socket.on("moveBall", (ball: any) => {
        if (!ballRef.current || !ball) return;
        if (ballRef.current) {
          ballRef.current.position.set(
            ball.position.x,
            ball.position.y,
            ball.position.z
          );
          ballRef.current.velocity.set(
            ball.velocity.x,
            ball.velocity.y,
            ball.velocity.z
          );
        }
      });
    }
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    scene.fog = new THREE.Fog(0x0, 0.015, 100); // color, near, far
    scene.add(new Lighting(0xffffff, 0.8, { x: 20, y: 20, z: 0 }));
    scene.add(new Lighting(0xffffff, 0.8, { x: -20, y: 20, z: 0 }));
    scene.add(new AmbientLighting(0xffffff, 0.1));
    let ball = new Ball(0.3, { x: 0, y: 15, z: 0 }, { x: 0, y: 0, z: 0 }, "/Game/textures/default.jpg");
    scene.add(ball);
    ballRef.current = ball;
    const plane = new Plane(500, 500, { x: 0, y: 0, z: 0 }, -Math.PI / 2);
    scene.add(plane);

    const tableModule = new TableModule(scene);
    tableModule.loadTable();
    tableModule.createNet();
    let paddle: Paddle;
    let paddle2: Paddle;
    paddle = new Paddle(scene, { x: 16.0, y: 10.0, z: 0.0 }, (3 * Math.PI) / 2);
    paddle2 = new Paddle(scene, { x: -16.0, y: 10.0, z: 0.0 });
    paddleRef.current = paddle;
    paddle2Ref.current = paddle2;
    // Update the interval function
    const intervalId = setInterval(() => {
      if (paddlePositionRef.current && socket) {
        // Check if the paddle position has changed since the last emit
        const currentPosition = paddlePositionRef.current;
        const lastPosition = lastEmittedPositionRef.current;

        if (
          !lastPosition ||
          currentPosition.x !== lastPosition.x ||
          currentPosition.y !== lastPosition.y ||
          currentPosition.z !== lastPosition.z
        ) {
          // Calculate velocity
          let velocity = {
            x: currentPosition.x - (lastPosition?.x || 0),
            y: currentPosition.y - (lastPosition?.y || 0),
            z: currentPosition.z - (lastPosition?.z || 0),
          };

          // If the position has changed, emit the new position and update the last emitted position
          socket.emit("movePaddleGame", {
            room: roomId,
            paddle: currentPosition,
            velocity: velocity, // optionally emit velocity if needed
          });
          lastEmittedPositionRef.current = { ...currentPosition };
        }
      }
    }, 1000 / 60);

    const handleMouseMove = (event: MouseEvent) => {
      if (mountRef.current && userID !== "spec") {
        const { left, top, width, height } =
          mountRef.current.getBoundingClientRect();
        const mouseX = ((event.clientX - left) / width) * 2 - 1;
        const mouseY = -((event.clientY - top) / height) * 2 + 1;
        if (userID === "player1") {
          paddle.position.z = -(mouseX * 10);
          paddle.position.y = mouseY * 10 + 10;
          paddlePositionRef.current = {
            x: paddle.position.x,
            y: paddle.position.y,
            z: paddle.position.z,
          };
        } else if (userID === "player2") {
          paddle2.position.z = mouseX * 10;
          paddle2.position.y = mouseY * 10 + 10;
          paddlePositionRef.current = {
            x: paddle2.position.x,
            y: paddle2.position.y,
            z: paddle2.position.z,
          };
        }

        camera.position.y = mouseY * 2 + 15;
        camera.position.z = -(mouseX * 2);
      }
    };
    // if the key h is pressed, the ball will move
    window.addEventListener("keydown", (e) => {
      if (e.key === "h") {
        if (socket) socket.emit("resetBall", { room: roomId });
      }
      if (e.key === "g") {
        ball.position.y = 0;
      }
    });
    mountRef.current?.addEventListener("mousemove", handleMouseMove);
    // add orbit controls
    // const controls = new OrbitControls(camera, renderer.domElement);

    function animate() {
      paddle.update();
      paddle2.update();
      ball.update();
      renderer.render(scene, camera);

      camera.lookAt(new THREE.Vector3(0, 10, 0));
      requestAnimationFrame(animate);
    }

    const emitLeaveRoom = () => {
      if (socket) {
        socket.emit("leftRoom", { room: roomId });
      }
    };

    window.addEventListener("beforeunload", emitLeaveRoom);

    animate();

    const currentMountRef = mountRef.current;
    return () => {
      if (socket) {
        socket.emit("leftRoom", { id: user.id, room: roomId });
        socket.off("paddlePositionUpdate");
        socket.off("movePaddle");
        socket.off("role");
        socket.off("moveBall");
      }
      window.removeEventListener("beforeunload", emitLeaveRoom);
      if (currentMountRef) {
        currentMountRef.removeChild(renderer.domElement);
        currentMountRef.removeEventListener("mousemove", handleMouseMove);
        clearInterval(intervalId);
      }
      scene.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  return (
    <>
      {/* make a white text on top in the middle of the game that displays the score */}

      {!end && (
        <div
          ref={mountRef}
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: `none`,
          }}
          className="flex "
        >
          <div
            style={{
              transform: "translateX(-50%)",
            }}
            className={cn(
              "bg-red-600 px-4 py-2 rounded-br-lg rounded-bl-lg absolute text-white text-xl mx-auto top-[55px] ml-[118px] font-[500]",
              rajdhani.className
            )}
          >
            {score.player1} - {score.player2}
          </div>
        </div>
      )}
    </>
  );
};

export default GameCanvas;
