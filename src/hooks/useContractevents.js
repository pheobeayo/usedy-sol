import { useEffect } from "react";

const useContractEvent = (contract, eventName, handler) => {
  useEffect(() => {
    if (!contract) return;

    contract.on(eventName, handler);

    return () => {
      contract.off(eventName, handler);
    };
  }, [contract, eventName, handler]);
};

export default useContractEvent;