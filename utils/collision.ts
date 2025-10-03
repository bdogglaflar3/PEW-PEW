import type { Barricade } from '../types';

interface Circle {
    x: number;
    y: number;
    radius: number;
}

interface Point {
    x: number;
    y: number;
}

// Simple Axis-Aligned Bounding Box (AABB) collision check for circles
export function checkCollision(circle: Circle, rect: Barricade): boolean {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared < (circle.radius * circle.radius);
}

// Helper function to check if two line segments intersect
function lineIntersectsLine(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
    const den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (den === 0) return false; // Parallel

    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / den;
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / den;

    return t > 0 && t < 1 && u > 0 && u < 1;
}

// Function to check if a line segment (e.g., line of sight) intersects with a rectangle
export function lineIntersectsRect(p1: Point, p2: Point, rect: Barricade): boolean {
    const topLeft = { x: rect.x, y: rect.y };
    const topRight = { x: rect.x + rect.width, y: rect.y };
    const bottomLeft = { x: rect.x, y: rect.y + rect.height };
    const bottomRight = { x: rect.x + rect.width, y: rect.y + rect.height };

    // Check against all 4 sides of the rectangle
    if (lineIntersectsLine(p1, p2, topLeft, topRight)) return true;
    if (lineIntersectsLine(p1, p2, topRight, bottomRight)) return true;
    if (lineIntersectsLine(p1, p2, bottomRight, bottomLeft)) return true;
    if (lineIntersectsLine(p1, p2, bottomLeft, topLeft)) return true;

    return false;
}
