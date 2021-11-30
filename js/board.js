window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("c");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth * 0.85;
  canvas.height = window.innerHeight * 0.75;
  let keysPressed = {};

  document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    // delete keysPressed[event.key];
    keysPressed = {};
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
      context.lineWidth = 1;
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
      if (keysPressed["w"] || keysPressed["W"]) {
        this.body.y -= this.grid.height;
      }
      if (keysPressed["a"] || keysPressed["A"]) {
        this.body.x -= this.grid.width;
      }
      if (keysPressed["s"] || keysPressed["S"]) {
        this.body.y += this.grid.height;
      }
      if (keysPressed["d"] || keysPressed["D"]) {
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

  class Glyph {
    constructor(x, y, character) {
      (this.x = x), (this.y = y), (this.character = character);
    }
  }

  class GlyphHistory {
    constructor(cursor) {
      this.cursor = cursor;
      this.glyphLoc = new Array();
    }
    draw() {
      this.control();
      console.log(this.glyphLoc.length);
      if (this.glyphLoc.length > 0) {
        for (let i = 0; i < this.glyphLoc.length; i++) {
          context.font = "12px aerial";
          context.fillText(
            this.glyphLoc[i].character,
            this.glyphLoc[i].x - 3,
            this.glyphLoc[i].y + 2
          );
        }
      }
    }
    control() {
      if (keysPressed["="]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "=")
        );
      }

      if (keysPressed["]"]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "]")
        );
      }

      if (keysPressed["["]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "[")
        );
      }

      if (keysPressed["v"]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "v")
        );
      }
      if (keysPressed["^"]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "^")
        );
      }
      if (keysPressed[">"]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, ">")
        );
      }
      if (keysPressed["<"]) {
        this.glyphLoc.push(
          new Glyph(this.cursor.body.x, this.cursor.body.y, "<")
        );
      }
    }
  }

  let board = new Grid(15, 15, "#222020");
  let cursor = new Cursor(board, "pink");
  let glyphs = new GlyphHistory(cursor);

  window.setInterval(function () {
    board.draw();
    cursor.draw();
    glyphs.draw();
  }, 120);
});
