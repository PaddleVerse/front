'use client';
import React, { useRef, useEffect } from 'react';

const Game: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let ctx: CanvasRenderingContext2D | null;

	let paddleHeight = 100;
	let paddleWidth = 10;
	let ballRadius = 10;

	let paddle1Y = 50;
	let paddle2Y = 50;
	let ballX = 50;
	let ballY = 50;
	let ballSpeedX = 10;
	let ballSpeedY = 10;

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
	};

	const moveAll = () => {
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		// Ball-Wall Collision
		if (ballX > window.innerWidth - ballRadius || ballX < ballRadius) {
			ballSpeedX = -ballSpeedX;
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
		if (ballX < paddleWidth + ballRadius && ballY + ballRadius > paddle1Top && ballY - ballRadius < paddle1Bottom) {
			ballSpeedX = -ballSpeedX;
			ballSpeedY += (ballY - (paddle1Y + paddleHeight / 2)) * 0.35; // Add some spin
			if (ballSpeedY > 10) ballSpeedY = 10;
		}

		// Check collision with paddle 2
		if (ballX > window.innerWidth - paddleWidth - ballRadius && ballY + ballRadius > paddle2Top && ballY - ballRadius < paddle2Bottom) {
			ballSpeedX = -ballSpeedX;
			ballSpeedY += (ballY - (paddle2Y + paddleHeight / 2)) * 0.35; // Add some spin
			if (ballSpeedY > 10) ballSpeedY = 10;

		}

		// Paddle 2 AI
		paddle2Y = ballY - paddleHeight / 2;

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
		paddle1Y = mouseY - paddleHeight / 2;
	};

	return (
		<canvas
			ref={canvasRef}
			width={window.innerWidth}
			height={window.innerHeight}
			style={{ border: '1px solid black', width: '100%', height: '100%' }}
			onMouseMove={handleMouseMove}
		/>
	);
};

export default Game;
