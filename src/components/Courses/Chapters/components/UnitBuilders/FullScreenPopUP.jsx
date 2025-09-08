import React, { useEffect, useRef, useState } from "react";

/**
 * FullscreenPopup
 * ----------------
 * Reusable component that renders a trigger (button/icon) and when activated
 * opens a fullscreen popup (modal-like) that centers a scrollable panel with
 * configurable max width & height. Works well for builders/editors.
 *
 * Props:
 * - trigger: React element to use as the trigger. If not provided, a default
 *            fullscreen icon button is rendered.
 * - title: optional title shown in the panel header
 * - maxWidth: tailwind-friendly width class or plain CSS value (default: 'max-w-5xl')
 * - maxHeight: CSS value for max height (default: '90vh')
 * - children: content to render inside the popup
 * - className: extra classes for the content panel
 *
 * Example usage (wrap your builder):
 *
 * <FullscreenPopup>
 *   <TextBuilder unit={selectedUnit} />
 * </FullscreenPopup>
 *
 * Or provide a custom trigger:
 *
 * <FullscreenPopup trigger={<MyIconButton />} title="Editor">
 *   <TextBuilder unit={selectedUnit} />
 * </FullscreenPopup>
 */

export default function FullscreenPopup({
  trigger,
  title,
  maxWidth = "98%",
  maxHeight = "98vh",
  children,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // prevent background scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const defaultTrigger = (
    <button
      type="button"
      aria-label="Open fullscreen"
      title="Open fullscreen"
      onClick={() => setOpen(true)}
      className="inline-flex items-center justify-center rounded-md border border-transparent p-2 bg-white/90 text-gray-700 shadow hover:shadow-md transition"
    >
      {/* simple fullscreen icon (SVG) */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3" />
      </svg>
    </button>
  );

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger ?? defaultTrigger}</span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* content panel */}
          <div
            ref={panelRef}
            className={`relative z-10 w-full ${maxWidth} mx-auto rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col ${className}`}
            style={{ maxHeight }}
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                {title ? <h3 className="text-sm font-semibold text-gray-800">{title}</h3> : null}
                <div className="text-xs text-gray-500">(Esc to close)</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // toggle fullscreen if you want to implement nested behaviour later
                    setOpen(false);
                  }}
                  className="rounded-md px-3 py-1 text-sm font-medium bg-gray-50 border hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* scrollable body */}
            <div className="p-4 overflow-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

/*
  Quick usage notes:

  1) To add the fullscreen icon inside your existing builder header (for example
     the green header in TextBuilder), render the FullscreenPopup's trigger in
     the header. Example inside the header's JSX:

     <div className="flex items-center justify-between">
       <h2>Editor</h2>
       <div className="flex items-center gap-2">
         <FullscreenPopup title="Editor" maxWidth="max-w-6xl">
           <TextBuilder unit={selectedUnit} />
         </FullscreenPopup>
       </div>
     </div>

  2) If you want the trigger to be separate from the wrapped children (i.e.
     you don't want FullscreenPopup to render children inline), you can instead
     pass a custom trigger prop and render the content only inside the popup.

  3) The panel uses CSS maxHeight (default 90vh) and overflow-auto to remain
     scrollable. Adjust `maxHeight` & `maxWidth` props for different sizes.

  4) Accessibility: ESC closes, backdrop click closes, role=dialog + aria-modal
     are set. If you need focus-trap behavior, integrate `focus-trap-react`.
*/
