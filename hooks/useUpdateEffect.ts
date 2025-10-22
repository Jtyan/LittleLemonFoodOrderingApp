import {
    useEffect,
    useRef,
    type DependencyList,
    type EffectCallback,
} from "react";

export function useUpdateEffect(
  effect: EffectCallback,
  dependencies: DependencyList = []
) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
