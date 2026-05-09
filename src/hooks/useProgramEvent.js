

import { useEffect } from "react";


const useProgramEvent = (program, eventName, handler) => {
  useEffect(() => {
    if (!program || !eventName || !handler) return;

    // addEventListener returns a numeric listener id
    const listenerId = program.addEventListener(eventName, handler);

    return () => {
      // Must be async-removed; anchor handles internally
      program.removeEventListener(listenerId).catch((err) => {
        console.warn(`Failed to remove event listener for "${eventName}":`, err);
      });
    };
  }, [program, eventName, handler]);
};

export default useProgramEvent;