"use client";

import { useEffect, useRef } from 'react';

interface BackgroundGradientProps {
  className?: string;
}

export default function BackgroundGradient({ className = '' }: BackgroundGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');  // primary-500 with low opacity
    gradient.addColorStop(0.5, 'rgba(217, 70, 239, 0.15)'); // secondary-500 with low opacity
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.2)');  // primary-500 with low opacity
    
    // Circles for gradient interest points
    const circles = Array.from({length: 8}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 200 + 100,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      color: Math.random() > 0.5 ? 
        'rgba(14, 165, 233, 0.08)' : 
        'rgba(217, 70, 239, 0.05)'
    }));
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Fill with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw and update circles
      circles.forEach(circle => {
        // Move
        circle.x += circle.vx;
        circle.y += circle.vy;
        
        // Bounce off edges
        if (circle.x < 0 || circle.x > width) circle.vx *= -1;
        if (circle.y < 0 || circle.y > height) circle.vy *= -1;
        
        // Draw
        ctx.beginPath();
        const grd = ctx.createRadialGradient(
          circle.x, circle.y, 0, 
          circle.x, circle.y, circle.radius
        );
        grd.addColorStop(0, circle.color);
        grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grd;
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 opacity-70 ${className}`}
    />
  );
} 