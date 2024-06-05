import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

/**
 * The `ChatContextProvider` function creates a context provider in React for managing chat-related
 * state and actions.
 * @returns The `ChatContextProvider` component is being returned. It utilizes the `useContext` hook to
 * access the `currentUser` from `AuthContext`, defines an initial state with `chatId` set to "null"
 * and an empty `user` object, implements a `chatReducer` function to handle state updates based on
 * different actions (in this case, only handling "CHANGE_USER" action),
 */
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  /* The `const INITIAL_STATE` declaration is setting up the initial state for the chat context. It
  defines an object with two properties: `chatId` initialized to the string "null" and `user`
  initialized as an empty object `{}`. This initial state will be used as the starting point for
  managing chat-related state within the `ChatContextProvider` component. */
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  /**
   * The chatReducer function updates the user and chatId based on the action type "CHANGE_USER".
   * @param state - The `state` parameter in the `chatReducer` function represents the current state of
   * the chat application. It contains the user information and the chat ID.
   * @param action - The `action` parameter in the `chatReducer` function is an object that represents
   * the action being dispatched. It typically has a `type` property that describes the type of action
   * being performed and a `payload` property that contains any data associated with the action.
   * @returns In the `chatReducer` function, when the action type is "CHANGE_USER", it returns an
   * object with the updated user and chatId properties based on the action payload and the
   * currentUser. The user property is set to the action payload, and the chatId property is determined
   * by concatenating the UIDs of the currentUser and the action payload user. If the currentUser's UID
   * is greater than the action
   */
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    /* The `<ChatContext.Provider value={{ data: state, dispatch }}> {children}
    </ChatContext.Provider>` code snippet is creating a provider component for the `ChatContext`
    context in React. */
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
