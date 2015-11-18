/**
 * Flocking by <a href="http://www.shiffman.net">Daniel Shiffman</a>
 * created for The Nature of Code class, ITP, Spring 2009.
 * 
 * Ported to toxiclibs by Karsten Schmidt
 * Revised by James Musgrave
 */

/* 
 * Copyright (c) 2009 Daniel Shiffman
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */
 
import toxi.geom.*;
import toxi.math.*;

Flock flock;

int width = window.innerWidth;
int height = window.innerHeight;

void setup() {

  size(width, height);
  flock = new Flock();

  for (int i = 0; i < 500; i++) {
    flock.addBoid(new Boid(new Vec2D(random(0, width),random(0,height)),5.0,0.05));
  }
  smooth();
}

void draw() {
  background(#111111);
  flock.run();
}

void mousePressed() {
flock.killBoids();
for (int i = 0; i < 50; i++) {
  flock.addBoid(new Boid(new Vec2D(mouseX,mouseY),5.0,0.05));
  }
}


// Flock class
// Does very little, simply manages the ArrayList of all the boids

class Flock {
  ArrayList boids; // An arraylist for all the boids

    Flock() {
    boids = new ArrayList(); // Initialize the arraylist
  }

  void run() {
    for (int i = 0; i < boids.size(); i++) {
      Boid b = (Boid) boids.get(i);  
      b.run(boids);  // Passing the entire list of boids to each boid individually
    }
  }

  void addBoid(Boid b) {
    boids.add(b);
  }
  void killBoids(){
  }
}

