import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [balance, setBalance] = useState(1000);
  const [bets, setBets] = useState([]);

  const placeBet = (bet) => {
    setBalance(prev => prev - bet.amount);
    setBets(prev => [...prev, bet]);
  };

  return (
    <UserContext.Provider value={{
      balance,
      bets,
      placeBet
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
