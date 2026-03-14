import { useCallback } from "react";

/**
 * Custom hook that provides a function to prevent form submission
 * while executing the provided callback.
 *
 * @returns {Object} Object containing preventSubmit function
 */
export const usePreventFormSubmit = () => {
  const preventSubmit = useCallback(
    (callback: () => void) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
    },
    []
  );

  return { preventSubmit };
};
