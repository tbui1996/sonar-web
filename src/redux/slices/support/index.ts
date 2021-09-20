import slice from './slice';

export * from './thunks';
export const {
  addMessage,
  activateSession,
  addPendingSession,
  readMessages,
  checkUnreadMessages
} = slice.actions;
export default slice.reducer;
