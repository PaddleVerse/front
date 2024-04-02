'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useGlobalState } from "@/app/components/Sign/GlobalState";

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let ctx: CanvasRenderingContext2D | null;
	let globalState = useGlobalState();
	let socket = globalState.state.socket;
    let paddleHeight = 100;
    let paddleWidth = 10;
    let ballRadius = 10;

    let paddle1Y = 50;
    let paddle2Y = 50;
    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 10;
    let ballSpeedY = 10;

    let player1Score = 0;
    let player2Score = 0;

    const [botDifficulty, setBotDifficulty] = useState<number>(0.5); // Adjust bot difficulty here (0.1 to 1)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            ctx = canvas.getContext('2d');
            setInterval(updateAll, 1000 / 60);
        }
    }, []);

    const updateAll = () => {
        moveAll();
        drawAll();
    };

    const drawRect = (leftX: number, topY: number, width: number, height: number, color: string) => {
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.fillRect(leftX, topY, width, height);
    };

    const drawCircle = (centerX: number, centerY: number, radius: number, color: string) => {
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fill();
    };

    const drawNet = () => {
        for (let i = 0; i < canvasRef.current!.height; i += 40) {
            drawRect(canvasRef.current!.width / 2 - 1, i, 2, 20, 'white');
        }
    };

    const drawScore = () => {
        if (!ctx) return;
        ctx.fillStyle = 'white';
        ctx.font = '120px Arial';
        const player1ScoreTextWidth = ctx.measureText(`${player1Score}`).width;
        const player2ScoreTextWidth = ctx.measureText(`${player2Score}`).width;
        ctx.fillText(`${player1Score}`, (canvasRef.current!.width / 2 - 1) - 50 - player1ScoreTextWidth, 125);
        ctx.fillText(`${player2Score}`, (canvasRef.current!.width / 2 - 1) + 50, 125);
    };

    const drawAll = () => {
        drawRect(0, 0, window.innerWidth, window.innerHeight, 'black');
        drawNet();
        drawRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
        drawRect(
            window.innerWidth - paddleWidth,
            paddle2Y,
            paddleWidth,
            paddleHeight,
            'white'
        );
        drawCircle(ballX, ballY, ballRadius, 'white');
        drawScore();
    };

    const resetBall = () => {
        ballX = window.innerWidth / 2;
        ballY = window.innerHeight / 2;
        ballSpeedX = -ballSpeedX; // Shoot the ball towards the player who got scored against
        ballSpeedY = 10;
    };

    const moveAll = () => {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball-Wall Collision
        if (ballX > window.innerWidth - ballRadius || ballX < ballRadius) {
            ballSpeedX = -ballSpeedX;
            if (ballX > window.innerWidth - ballRadius) {
                // Player 1 scores
                player1Score++;
                resetBall();
            } else {
                // Player 2 scores
                player2Score++;
                resetBall();
            }
        }

        if (ballY > window.innerHeight - ballRadius || ballY < ballRadius) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball-Paddle Collision
        const paddle1Top = paddle1Y;
        const paddle1Bottom = paddle1Y + paddleHeight;
        const paddle2Top = paddle2Y;
        const paddle2Bottom = paddle2Y + paddleHeight;

        // Check collision with paddle 1
        if (
            ballX < paddleWidth + ballRadius &&
            ballY + ballRadius > paddle1Top &&
            ballY - ballRadius < paddle1Bottom
        ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = (ballY - (paddle1Y + paddleHeight / 2)) * 0.35; // Add some spin
        }

        // Check collision with paddle 2
        if (
            ballX > window.innerWidth - paddleWidth - ballRadius &&
            ballY + ballRadius > paddle2Top &&
            ballY - ballRadius < paddle2Bottom
        ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = (ballY - (paddle2Y + paddleHeight / 2)) * 0.35; // Add some spin
        }

        // Paddle 2 AI
        if (Math.random() < botDifficulty) {
            // Predict the ball's position and adjust paddle2Y accordingly
            const predictedBallY = ballY + (ballSpeedY / ballSpeedX) * (window.innerWidth - paddleWidth - ballX);
            const paddle2YCenter = paddle2Y + paddleHeight / 2;
            if (paddle2YCenter < predictedBallY - 35) {
                paddle2Y += 8;
            } else if (paddle2YCenter > predictedBallY + 35) {
                paddle2Y -= 8;
            }
        }

        // Ensure paddle 2 stays within the canvas
        if (paddle2Y < 0) {
            paddle2Y = 0;
        } else if (paddle2Y > window.innerHeight - paddleHeight) {
            paddle2Y = window.innerHeight - paddleHeight;
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const mouseY = event.clientY - rect.top - root.scrollTop;
        paddle1Y = mouseY * 2 - paddleHeight / 2;
		socket.emit("testing");
    };

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ border: '1px solid black', width: '80%', height: '80%' }}
            onMouseMove={handleMouseMove}
        />
    );
};

export default Game;
