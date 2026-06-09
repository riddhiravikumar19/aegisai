export const initialMachines = [
    {
      id: "MCH-017",
      type: 0,
      airTemp: 304.2,
      processTemp: 315.6,
      rpm: 1280,
      torque: 68.5,
      toolWear: 218,
    },
    {
      id: "MCH-042",
      type: 1,
      airTemp: 301.4,
      processTemp: 312.2,
      rpm: 1420,
      torque: 55.3,
      toolWear: 164,
    },
    {
      id: "MCH-091",
      type: 1,
      airTemp: 299.8,
      processTemp: 309.7,
      rpm: 1510,
      torque: 44.1,
      toolWear: 96,
    },
    {
      id: "MCH-008",
      type: 2,
      airTemp: 298.4,
      processTemp: 308.8,
      rpm: 1602,
      torque: 36.7,
      toolWear: 42,
    },
  ];
  
  export function simulateMachine(machine) {
    const rpmChange = Math.floor(Math.random() * 80 - 40);
    const torqueChange = Number((Math.random() * 4 - 2).toFixed(1));
    const airChange = Number((Math.random() * 1.2 - 0.6).toFixed(1));
    const processChange = Number((Math.random() * 1.4 - 0.7).toFixed(1));
  
    return {
      ...machine,
      rpm: Math.max(1000, Math.min(3000, machine.rpm + rpmChange)),
      torque: Math.max(0, Math.min(100, Number((machine.torque + torqueChange).toFixed(1)))),
      airTemp: Math.max(250, Math.min(350, Number((machine.airTemp + airChange).toFixed(1)))),
      processTemp: Math.max(250, Math.min(400, Number((machine.processTemp + processChange).toFixed(1)))),
      toolWear: Math.max(0, Math.min(300, machine.toolWear + 1)),
    };
  }
  
  export function calculateRisk(machine) {
    let risk = 0;
  
    if (machine.torque > 60) risk += 30;
    if (machine.torque > 70) risk += 20;
  
    if (machine.rpm < 1400) risk += 25;
    if (machine.rpm < 1200) risk += 20;
  
    if (machine.toolWear > 160) risk += 20;
    if (machine.toolWear > 220) risk += 20;
  
    if (machine.airTemp > 303) risk += 10;
    if (machine.processTemp > 315) risk += 10;
  
    return Math.min(100, risk);
  }
  
  export function getRiskLevel(risk) {
    if (risk >= 80) return "Critical";
    if (risk >= 60) return "High";
    if (risk >= 35) return "Medium";
    return "Low";
  }
  
  export function getHealthScore(risk) {
    return Math.max(0, 100 - risk);
  }