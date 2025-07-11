"use client"

import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // Changed to 5 seconds

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  return count++
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToasterToast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action
      // ! Side effects ! - This will be executed in a separate render cycle
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
        }
      } else {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        }
      }
    }
    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const ToasterContext = React.createContext<
  { toast: (props: ToasterToast) => { id: string }; toasts: ToasterToast[] } | undefined
>(undefined)

// Export the ToasterProvider
export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const hotToast = React.useCallback(
    ({ ...props }: ToasterToast) => {
      const id = genId()

      const update = (props: ToasterToast) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss()
          },
        },
      })

      return {
        id: id,
        update,
        dismiss,
      }
    },
    [dispatch],
  )

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false) {
        // We need to remove toast from state after it's dismissed
        // otherwise it will remain in the DOM for animation purposes
        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id })
        }, TOAST_REMOVE_DELAY)
      }
    })
  }, [state.toasts])

  return (
    <ToasterContext.Provider
      value={React.useMemo(() => ({ toast: hotToast, toasts: state.toasts }), [hotToast, state.toasts])}
    >
      {children}
    </ToasterContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToasterContext)
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider")
  }
  return context
}
