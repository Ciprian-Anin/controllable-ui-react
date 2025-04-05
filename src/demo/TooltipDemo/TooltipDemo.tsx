"use client";
import React, {
  PropsWithChildren,
  useState,
} from 'react';

import {
  DefaultStrategyProps,
  KeepCurrentPlacementStrategyProps,
  Tooltip,
  useTooltipRelativeElement,
} from '../../components/Tooltip';

export const TooltipDemo = (
  props: PropsWithChildren<
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
  > & {
    message: React.ReactNode;
  }
) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const triggerActions = props.triggerActions || ["hover", "focus"];

  const handleOpen$ = () => {
    setDialogIsOpen(true);
  };

  const handleClose$ = () => {
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
      <span {...relativeElementProps} popoverTarget={tooltipId}>
        {props.children}
      </span>
      <Tooltip
        {...props}
        id={tooltipId}
        relativeElementRef={relativeElementProps.ref}
        dialogWithBridgeRef={dialogWithBridgeRef}
        triggerActions={triggerActions}
        open={dialogIsOpen}
        onOpen$={handleOpen$}
        onClose$={handleClose$}
      >
        {props.message}
      </Tooltip>
    </>
  );
};

export default TooltipDemo;
