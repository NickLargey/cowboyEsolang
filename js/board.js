window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("c");
  const context = canvas.getContext("2d");

  let keysPressed = {};

  document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
  });

  class Rectangle {
    constructor(x, y, height, width, color) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.color = color;
      this.xmom = 0;
      this.ymom = 0;
    }
    draw() {
      context.lineWidth = 0.5;
      context.fillStyle = this.color;
      context.strokeStyle = "black";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    move() {
      this.x += this.xmom;
      this.y += this.ymom;
    }
  }

  class Circle {
    constructor(x, y, radius, color, xmom = 0, ymom = 0) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.xmom = xmom;
      this.ymom = ymom;
      this.lens = 0;
    }
    draw() {
      context.lineWidth = 0;
      context.strokeStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      context.fillStyle = this.color;
      context.fill();
      context.stroke();
    }
    move() {
      this.x += this.xmom;
      this.y += this.ymom;
    }
  }

  class Grid {
    constructor(width, height, color) {
      this.width = width;
      this.height = height;
      this.x = 0;
      this.y = 0;
      this.blocks = [];
      this.glyph = new Glyph();
      for (let q = 0; this.y < canvas.height; q++) {
        for (let q = 0; this.x < canvas.width; q++) {
          let block;

          block = new Rectangle(this.x, this.y, this.height, this.width, color);

          this.blocks.push(block);
          this.x += this.width;
        }
        this.y += this.height;
        this.x = 0;
      }
    }

    draw() {
      for (let b = 0; b < this.blocks.length; b++) {
        this.blocks[b].draw();
      }
    }
  }

  class Glyph {
    constructor() {
      this.glyphLoc = {};
    }

    draw() {
      this.control();
      for(let glyph in this.glyphLoc){
        glyph.draw();
      }
    }
    control() {
      if (keysPressed["="]) {
        glyphLoc[(this.body.x, this.body.y)] = "=";
        context.font = "5px serif";
        context.fillText("=", this.body.x, this.body.y);
        for (let glyph in glyphLoc) console.log(glyph); // debug
      }
    }
  }

  class Cursor {
    constructor(grid, color) {
      this.grid = grid;
      this.body = new Circle(
        1,
        1,
        Math.min(canvas.width / 120, canvas.height / 120),
        color
      );
      this.location =
        this.grid.blocks[Math.floor(Math.random() * this.grid.blocks.length)];
    }
    draw() {
      this.control();
      this.body.x = this.location.x + this.location.width / 2;
      this.body.y = this.location.y + this.location.height / 2;
      this.body.draw();
    }
    control() {
      if (keysPressed["w"]) {
        this.body.y -= this.grid.height;
      }
      if (keysPressed["a"]) {
        this.body.x -= this.grid.width;
      }
      if (keysPressed["s"]) {
        this.body.y += this.grid.height;
      }
      if (keysPressed["d"]) {
        this.body.x += this.grid.width;
      }

      for (let g = 0; g < this.grid.blocks.length; g++) {
        if (this.body.x > this.grid.blocks[g].x) {
          if (this.body.y > this.grid.blocks[g].y) {
            if (
              this.body.x <
              this.grid.blocks[g].x + this.grid.blocks[g].width
            ) {
              if (
                this.body.y <
                this.grid.blocks[g].y + this.grid.blocks[g].height
              ) {
                if (this.grid.blocks[g].color != "red") {
                  this.location = this.grid.blocks[g];
                }
              }
            }
          }
        }
      }
    }
  }

  let board = new Grid(5, 5, "#222020");
  let cursor = new Cursor(board, "pink");
  window.setInterval(function () {
    board.draw();
    cursor.draw();
  }, 120);
});
