class NitouheReplier {

  constructor() {
    this.status = false;
  }
  
  on() {
    this.status = true;
  }
  
  off() {
    this.status = false;
  }
  
  isAvailable() {
    return this.status;
  }
  
  async onMessage(msg) {
    if (!this.isAvailable())
      return;
    
  }

}

export default NitouheReplier;
