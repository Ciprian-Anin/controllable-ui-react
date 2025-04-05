"use client";

import { useState } from 'react';

import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
  Tooltip,
  useTooltipRelativeElement,
} from '../../components/Tooltip';

export const TooltipWithCloseActionDemo = (
  props:
    | Omit<
        DefaultStrategyProps,
        | "open"
        | "onOpen$"
        | "onClose$"
        | "relativeElementRef"
        | "dialogWithBridgeRef"
        | "id"
      >
    | Omit<
        KeepCurrentPlacementStrategyProps,
        | "open"
        | "onOpen$"
        | "onClose$"
        | "relativeElementRef"
        | "dialogWithBridgeRef"
        | "id"
      >
) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [leaveDelay, setLeaveDelay] = useState(300);

  const triggerActions = props.triggerActions || ["hover", "focus"];

  const handleOpen$ = () => {
    setDialogIsOpen(true);
  };

  const handleClose$ = () => {
    setLeaveDelay(300);
    setDialogIsOpen(false);
  };

  const handleClickCloseButton$ = () => {
    setLeaveDelay(0);
    setDialogIsOpen(false);
  };

  const {
    tooltipId,
    relativeElementProps,
    dialogProps: { dialogWithBridgeRef },
  } = useTooltipRelativeElement({
    triggerActions,
    onOpen$: handleOpen$,
    onClose$: handleClose$,
  });

  return (
    <>
      <button
        {...relativeElementProps}
        ref={relativeElementProps.ref as React.RefObject<HTMLButtonElement>}
        popoverTarget={tooltipId}
      >
        HTML
      </button>
      <Tooltip
        {...props}
        id={tooltipId}
        relativeElementRef={relativeElementProps.ref}
        dialogWithBridgeRef={dialogWithBridgeRef}
        triggerActions={triggerActions}
        open={dialogIsOpen}
        onOpen$={handleOpen$}
        onClose$={handleClose$}
        leaveDelay={leaveDelay}
      >
        <span>
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              Tooltip with HTML
            </span>
            <svg
              style={{ cursor: "pointer" }}
              onClick={handleClickCloseButton$}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M480-451.69 270.15-241.85q-5.61 5.62-13.77 6-8.15.39-14.53-6-6.39-6.38-6.39-14.15 0-7.77 6.39-14.15L451.69-480 241.85-689.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39L480-508.31l209.85-209.84q5.61-5.62 13.77-6 8.15-.39 14.53 6 6.39 6.38 6.39 14.15 0 7.77-6.39 14.15L508.31-480l209.84 209.85q5.62 5.61 6 13.77.39 8.15-6 14.53-6.38 6.39-14.15 6.39-7.77 0-14.15-6.39L480-451.69Z" />
            </svg>
          </p>
          <p>
            <em>And here&apos;s</em> <b>some</b> <u>amazing content</u>.
            It&apos;s very engaging. Right?
          </p>
        </span>
      </Tooltip>
    </>
  );
};

export default TooltipWithCloseActionDemo;
