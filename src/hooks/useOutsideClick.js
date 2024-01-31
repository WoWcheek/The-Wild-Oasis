import { useEffect, useRef } from "react";

export function useOutsideClick(action, listenCapturing = true) {
    const ref = useRef();

    useEffect(
        function () {
            function handler(e) {
                if (ref.current && !ref.current.contains(e.target)) action();
            }

            document.addEventListener("click", handler, listenCapturing);
            return () =>
                document.removeEventListener("click", handler, listenCapturing);
        },
        [action, listenCapturing]
    );

    return ref;
}
