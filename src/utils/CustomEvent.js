class CustomEvent {
  constructor(event, x, y) {
    this.event = event;
    this.x = x;
    this.y = y;
  }

  toJSON() {
    return {
      clientX: this.x,
      clientY: this.y,
      type: this.event.type,
      buttons: this.event.buttons,
    };
  }
}

export default CustomEvent;
