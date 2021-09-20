import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../redux/store';
import type { ChatSession } from '../@types/support';

export default function useActiveSession() {
  const [activeSession, setActiveSession] = useState<ChatSession | undefined>();
  const { activeSessionID, sessions } = useSelector(
    (state: RootState) => state.support
  );

  useEffect(() => {
    if (!activeSessionID) {
      setActiveSession(undefined);
      return;
    }

    const nextActiveSession = sessions.byId[activeSessionID];

    if (!nextActiveSession) {
      console.log(
        'Expected to find session for active session id: ',
        activeSessionID
      );
    }

    setActiveSession(nextActiveSession);
  }, [activeSessionID, sessions]);

  return { activeSession };
}
