import { createContext, Dispatch, ReactNode, Reducer, useEffect, useReducer } from "react";
import { Snap } from "../types";
import { getSnap, isFlask } from "../utils/snap";

export type MetaMaskState = {
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
};

const initialState: MetaMaskState = {
  isFlask: false,
  installedSnap: undefined,
  error: undefined
};

type MetaMaskDispatch = { type: MetaMaskActions; payload: any };

export const MetaMaskContext = createContext<[MetaMaskState, Dispatch<MetaMaskDispatch>]>([
  initialState,
  () => {
    /* no op */
  }
]);

export enum MetaMaskActions {
  SetInstalled = "SetInstalled",
  SetFlaskDetected = "SetFlaskDetected",
  SetError = "SetError"
}

const reducer: Reducer<MetaMaskState, MetaMaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetaMaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action?.payload ?? undefined
      };

    case MetaMaskActions.SetFlaskDetected:
      return {
        ...state,
        isFlask: action.payload
      };

    case MetaMaskActions.SetError:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await isFlask();

      dispatch({
        type: MetaMaskActions.SetFlaskDetected,
        payload: isFlaskDetected
      });
    }

    async function detectSnapInstalled() {
      const installedSnap = await getSnap();
      dispatch({
        type: MetaMaskActions.SetInstalled,
        payload: installedSnap
      });
    }

    if (!state.isFlask) {
      detectFlask();
    }

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetaMaskActions.SetError,
          payload: undefined
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <MetaMaskContext.Provider value={[state, dispatch]}>{children}</MetaMaskContext.Provider>;
};
