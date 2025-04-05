"use client"

import React, {
  useCallback,
  useRef,
} from 'react';

const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
export default function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef<typeof fn>(() => {
    // throw error in order to ensure that we can't call this on the render phase
    throw new Error(
      'Cannot call function obtained from useEventCallback while rendering.'
    );
  });
  // ref.current will be the function throwing an Error if we call returned function from this hook during render phase (as a render function)

  useEnhancedEffect(() => {
    ref.current = fn;
  });

  return useCallback(

    (...args: Args) => ref.current.apply(undefined, args), // make sure that the value of `this` provided for the call to fn is not `ref`
    []
  );
}