class CPU {
  constructor() {
    this.registers = [...Array(8).fill(0)];
    this.pc = 0;
    this.ir = null;
    this.mar = null;
    this.mdr = null;
    this.fl = null;
    this.ram = [...Array(255).fill(0)];
    this.spl = 8 - 1;
    this.registers[this.spl] = 244;
    this.OPCODES = {
      0b10000010: "LDI",
      0b01000111: "PRN",
      0b00000001: "HLT",
      0b10100010: "MUL",
      0b01000110: "POP",
      0b01000101: "PUSH",
      0b10000100: "ST",
      0b01001000: "PRA"
    };
    this.message = [];
  }

  load(message) {
    try {
      let address = 0;
      let lines = message.split("\n");
      lines = lines.filter(line => line.match(/^[01]{8}$/));
      for (let i = 0; i < lines.length; i++) {
        this.ram[address] = parseInt(lines[i], 2);
        address += 1;
      }
    } catch (err) {
      console.log(err);
      process.exit();
    }
  }

  alu(op, regA, regB) {
    if (op === "ADD") {
      this.registers[regA] += this.registers[regB];
    } else if (op == "MUL") {
      this.registers[regA] *= this.registers[regB];
    } else {
      throw Error("Unsupported ALU operation");
    }
  }

  run() {
    let running = true;
    while (running) {
      this.ir = this.ram[this.pc];
      try {
        let op = this.OPCODES[this.ir];
        if (op === "LDI") {
          const reg = this.ram[this.pc + 1];
          const value = this.ram[this.pc + 2];
          this.registers[reg] = value;
          this.pc += 3;
        } else if (op === "PRN") {
          const reg = this.ram[this.pc + 1];
          const value = this.registers[reg];
          console.log(`Dec value: ${value}`);
          this.pc += 2;
        } else if (op === "ADD" || op === "MUL") {
          const regA = this.ram[this.pc + 1];
          const regB = this.ram[this.pc + 2];
          this.alu(op, regA, regB);
          this.pc += 3;
        } else if (op === "PUSH") {
          const reg = this.ram[this.pc + 1];
          const value = this.registers[reg];
          this.registers[this.spl] -= 1;
          this.ram[this.registers[this.spl]] = value;
          this.pc += 2;
        } else if (op === "POP") {
          const reg = this.ram[this.pc + 1];
          const value = this.ram[this.registers[this.spl]];
          this.registers[reg] = value;
          this.registers[this.spl] += 1;
          this.pc += 2;
        } else if (op === "ST") {
          const regA = this.ram[this.pc + 1];
          const regB = this.ram[this.pc + 2];
          const addressA = this.registers[regA];
          const addressB = this.registers[regB];
          this.ram[addressA] = addressB;
          this.pc += 2;
        } else if (op === "PRA") {
          const reg = this.ram[this.pc + 1];
          const value = this.registers[reg];
          console.log(String.fromCharCode(value));
          this.message.push(String.fromCharCode(value));
          this.pc += 2;
        } else if (op === "HLT") {
          running = false;
        }
      } catch (err) {
        console.log(`Unknown command ${this.ir}`);
        console.log(err);
        this.pc += 1;
      }
    }
  }

  getMessage() {
    return this.message.join("");
  }
}

module.exports = CPU;
