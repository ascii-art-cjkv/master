import 'vector'
import xx from 'xx'

class Dot {
  constructor({ canvas, ctx, pos }) {
    this.canvas = canvas
    this.ctx = ctx

    this.width = this.canvas.width
    this.height = this.canvas.height
    this.maxDistance = new Vector(0, 0).distance(new Vector(this.width, this.height))

    this.pos = pos || new Vector(
      Math.random() * this.width,
      Math.random() * this.height
    )

    this.isMouseHolded = false

    this.direction = this.getRandomDirection()
    this.speed = this.getRandomNum(2, 5)
    this.radius = this.getRandomNum(.5, 1.2)
    this.observe()
  }

  observe() {
    this.canvas.addEventListener('mousedown', () => this.isMouseHolded = true)
    this.canvas.addEventListener('mouseup', () => this.isMouseHolded = false)
  }

  getRandomNum(range) {
    if (arguments.length === 2) {
      const [min, max] = arguments
      return min + this.getRandomNum(max - min)
    }
    return Math.random() * range
  }

  getRandomDirection() {
    return new Vector(
      this.getRandomNum(-1, 1),
      this.getRandomNum(-1, 1)
    ).normalize()
  }

  move() {
    if (!!this.mouse && !this.isMouseHolded) {
      this.direction.normalize().mult(20)
      const directionToMouse = this.mouse.clone().sub(this.pos).normalize()
      this.direction.add(directionToMouse)
    }

    this.direction.add(this.getRandomDirection().mult(.5))

    if (this.pos.x <= 0 || this.pos.x >= this.width) {
      this.direction.x *= -1
    }
    if (this.pos.y <= 0 || this.pos.y >= this.height) {
      this.direction.y *= -1
    }

    const movement = this.direction.clone().normalize().mult(this.speed)
    this.pos.add(movement)
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.closePath()
  }

  update() {
    this.move()
    this.draw()
  }

  setMouse(mouse) {
    this.mouse = mouse
  }
}


class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.fullScreen()

    this.ctx.fillStyle = 'rgba(0, 0, 0, .3)'

    this.addDots(100)
    this.update()

    this.observe()
  }

  fullScreen() {
    this.width = this.canvas.width = window.innerWidth * 2
    this.height = this.canvas.height = window.innerHeight * 2
  }

  addDots(length) {
    this.dots = []
    for (let i = 0; i < length; i++) {
      this.dots.push(
        new Dot({
          canvas: this.canvas,
          ctx: this.ctx,
        })
      )
    }
  }

  clear() {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(255, 255, 255, .3)'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.restore()
  }

  update() {
    // this.clear()

    this.dots.forEach((dot) => dot.update())
    window.requestAnimationFrame(this.update.bind(this))
  }

  observe() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.mouse) {
        this.mouse = new Vector()
        this.dots.forEach((dot) => dot.setMouse(this.mouse))
      }
      this.mouse.x = e.clientX * 2
      this.mouse.y = e.clientY * 2
    })
  }
}

new Canvas()
