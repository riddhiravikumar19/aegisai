import { createContext, useContext, useState } from "react";

const MachineContext = createContext(null);

export function MachineProvider({ children }) {
  const [selectedMachine, setSelectedMachine] = useState(null);

  return (
    <MachineContext.Provider value={{ selectedMachine, setSelectedMachine }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachine() {
  const context = useContext(MachineContext);

  if (!context) {
    throw new Error("useMachine must be used inside MachineProvider");
  }

  return context;
}