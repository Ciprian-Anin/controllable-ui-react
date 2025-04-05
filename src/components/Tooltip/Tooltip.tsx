"use client";
import {
  CSSProperties,
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import useEventCallback from '../../utils/useEventCallback';
import { TooltipArrow } from './components/TooltipArrow';
import { Placement } from './types';
import {
  getAvailablePlacementFromTheOnesToBeTried,
  getDialogAvailablePositionConsideringKeepingCurrentPlacement,
} from './utils/availablePosition.utils';
import { getDialogPositionStyle } from './utils/positionStyle.utils';
import {
  getElementVisibleBoundingClientRectInsideScrollableContainer,
  getScrollableContainer,
  nextTickRender,
} from './utils/utils';

export const defaultOrderOfPlacementsToBeTried: {
  [key in Placement]: [
    preferredPlacement: Placement,
    ...restOfPlacements: Placement[]
  ];
} = {
  "top-start": ["top-start", "bottom-start", "left", "right"],
  top: ["top", "bottom", "left", "right"],
  "top-end": ["top-end", "bottom-end", "left", "right"],

  "left-start": ["left-start", "right-start", "top", "bottom"],
  left: ["left", "right", "top", "bottom"],
  "left-end": ["left-end", "right-end", "top", "bottom"],

  "right-start": ["right-start", "left-start", "top", "bottom"],
  right: ["right", "left", "top", "bottom"],
  "right-end": ["right-end", "left-end", "top", "bottom"],

  "bottom-start": ["bottom-start", "top-start", "left", "right"],
  bottom: ["bottom", "top", "left", "right"],
  "bottom-end": ["bottom-end", "top-end", "left", "right"],
};

type BaseProps = {
  id: string;
  relativeElementRef: React.RefObject<HTMLElement | null>;
  dialogWithBridgeRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpen$?: () => void;
  onClose$?: () => void;
  preferredPlacement?: Placement;
  orderOfPlacementsToBeTried?: [
    preferredPlacement: Placement,
    ...restOfPlacements: Placement[]
  ];
  triggerActions?: ("hover" | "focus" | "click")[];
  /**
   * Distance between relative element and tooltip dialog
   */
  dialogOffset?: number;
  /**
   * Open delay in ms
   */
  enterDelay?: number;
  /**
   * Close delay in ms
   */
  leaveDelay?: number;
  arrow?: boolean;
  /**
   * Scrollable container is the one used to track scroll event
   * and position dialog while scrolling inside it.
   */
  scrollableContainer?: HTMLElement;
  tooltipClass?: string;
  tooltipRootClass?: string;
};

export type KeepCurrentPlacementStrategyProps = BaseProps & {
  /**
   * Keep current placement of dialog as time as it remains in
   * min & max sizes boundaries.
   */
  placementStrategy: "considerKeepingCurrentPlacement";
  /**
   * `dialogMinMaxSizes`:
   *   > In case we need to keep current position, we will use maximum & minimum sizes
   *   > of dialog to check if it fits in current placement, without going over its minimum sizes.
   *   > In case we don't have minimum size available for current placement,
   *   > than will be tried next place from `orderOfPlacementsToBeTried`.
   *
   *   > Maximum size is used to make sure to not have a bigger maximum size on dialog popover.
   *   > (we make sure to override the maximum size in case the available space is smaller than the dialog size)
   */
  dialogMinMaxSizes?: {
    dialogMaxHeight?: number;
    dialogMinHeight?: number;
    dialogMaxWidth?: number;
    dialogMinWidth?: number;
  };
};

/**
 * Dialog placement will be recomputed immediately after we remain
 * without necessary space for dialog on current placement.
 */
export type DefaultStrategyProps = BaseProps & {
  placementStrategy: "default";
};

export type Props = DefaultStrategyProps | KeepCurrentPlacementStrategyProps;

const getDialogWithBridgeStyle = (
  dialogPositionStyle: {
    currentPlacement?: Placement;
    value: CSSProperties;
    maxHeight: string;
    maxWidth: string;
  },
  dialogOffset: number,
  leaveDelay: number,
  arrowSize: number
) => {
  return {
    ...dialogPositionStyle.value,
    maxWidth: dialogPositionStyle.maxWidth,
    "--dialog-offset": `${dialogOffset}px`,
    "--close-timeout": `${leaveDelay}ms`,
    "--arrow-size": `${arrowSize}px`,
  };
};

const getDialogWithBridgeClass = (
  tooltipRootClass: string | undefined,
  dialogPositionStyle: {
    currentPlacement?: Placement;
    value: CSSProperties;
    maxHeight: string;
    maxWidth: string;
  },
  dialogAnimationState: "initial" | "hide" | "show"
) => {
  return [
    tooltipRootClass ?? "",
    "QwikUiTooltip-dialog-with-bridge",
    dialogPositionStyle.currentPlacement
      ? `QwikUiTooltip-placement-${dialogPositionStyle.currentPlacement}`
      : "",
    dialogAnimationState === "initial" ? "QwikUiTooltip-initial" : "",
    dialogAnimationState === "show" ? "QwikUiTooltip-show" : "",
    dialogAnimationState === "hide" ? "QwikUiTooltip-hide" : "",
  ].join(" ");
};

const updateDialogWithBridgeStyle = (
  dialogWithBridgeRef: React.RefObject<HTMLElement | null>,
  dialogPositionStyle: {
    currentPlacement?: Placement;
    value: CSSProperties;
    maxHeight: string;
    maxWidth: string;
  },
  dialogOffset: number,
  leaveDelay: number,
  arrowSize: number
) => {
  if (dialogWithBridgeRef.current) {
    Object.assign(
      dialogWithBridgeRef.current.style,
      getDialogWithBridgeStyle(
        dialogPositionStyle,
        dialogOffset,
        leaveDelay,
        arrowSize
      )
    );
  }
};

export function useTooltipRelativeElement({
  triggerActions,
  onOpen$,
  onClose$,
}: {
  triggerActions: NonNullable<BaseProps["triggerActions"]>;
  onOpen$?: BaseProps["onOpen$"];
  onClose$?: BaseProps["onClose$"];
}) {
  const tooltipId = useId();

  const relativeElementRef = useRef<HTMLElement | null>(null);
  const dialogWithBridgeRef = useRef<HTMLDivElement | null>(null);

  const handleOpenAction = () => {
    onOpen$?.();
  };

  const handleRelativeElementMouseOrFocusLeave = (
    event: MouseEvent | FocusEvent
  ) => {
    if (
      dialogWithBridgeRef.current !== event.relatedTarget &&
      (!(event.relatedTarget instanceof Node) ||
        !dialogWithBridgeRef.current?.contains(event.relatedTarget))
    ) {
      onClose$?.();
    }
  };

  return {
    tooltipId,
    dialogProps: {
      dialogWithBridgeRef,
    },
    relativeElementProps: {
      ref: relativeElementRef,
      onMouseEnter: triggerActions.includes("hover")
        ? handleOpenAction
        : undefined,

      onMouseLeave: triggerActions.includes("hover")
        ? handleRelativeElementMouseOrFocusLeave
        : undefined,

      onFocus: triggerActions.includes("focus") ? handleOpenAction : undefined,

      onBlur: triggerActions.includes("focus")
        ? handleRelativeElementMouseOrFocusLeave
        : undefined,

      onClick: triggerActions.includes("click") ? handleOpenAction : undefined,
    },
  };
}

/**
 * @prop `orderOfPlacementsToBeTried`:
 *   > In case dialog will not have enough space to be positioned in
 *   > the preferred placement, we will try to position it in the rest
 *   > of placements. The first placement with enough space will be the chosen one.
 */
export const Tooltip = (props: PropsWithChildren<Props>) => {
  const {
    id: tooltipId,
    relativeElementRef,
    dialogWithBridgeRef,
    open,
    onOpen$,
    onClose$,
    preferredPlacement = "bottom-start",
    orderOfPlacementsToBeTried = defaultOrderOfPlacementsToBeTried[
      preferredPlacement
    ],
    dialogOffset = 5,
    enterDelay = 100,
    leaveDelay = 150,
    triggerActions = ["hover", "focus"],
    // triggerActions = ["click"],
    arrow = false,
    scrollableContainer,
    tooltipRootClass,
    tooltipClass,
  } = props;
  const arrowSize = arrow ? 12 : 0;
  const bridgeSize = arrow
    ? dialogOffset - arrowSize / 2 + arrowSize
    : dialogOffset;

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [dialogIsOpenLocalState, setDialogIsOpenLocalState] = useState(open);
  const [dialogPositionStyle, setDialogPositionStyle] = useState<{
    currentPlacement?: Placement;
    value: CSSProperties;
    maxHeight: string;
    maxWidth: string;
  }>({ currentPlacement: undefined, value: {}, maxHeight: "", maxWidth: "" });
  const closeDialogTimeoutID = useRef<number | undefined>(undefined);
  const openDialogTimeoutID = useRef<number | undefined>(undefined);
  const [dialogAnimationState, setDialogAnimationState] = useState<
    "show" | "hide" | "initial"
  >("initial");

  const positionDialog = useEventCallback(async () => {
    if (
      dialogWithBridgeRef.current &&
      dialogRef.current &&
      relativeElementRef.current
    ) {
      let nextDialogPositionStyle = dialogPositionStyle;
      // #region This seems to be no longer needed
      // // remove maxHeight & maxWidth to compute availableSize properly
      // dialogPositionStyle.maxHeight = "";
      // dialogPositionStyle.maxWidth = "";
      // await nextTickRender(); // wait to have dialog rendered without maxHeight & maxWidth
      // #endregion

      // compute placement of dialog using the dialogRef which doesn't include bridge,
      // which is unknown before knowing the next dialog placement.
      // We use dialogOffset to properly take the bridge into account when computing the available space & placement
      const availablePosition =
        props.placementStrategy === "considerKeepingCurrentPlacement"
          ? getDialogAvailablePositionConsideringKeepingCurrentPlacement({
              placementsToBeTried: orderOfPlacementsToBeTried,
              dialogElement: dialogRef.current,
              relativeElement: relativeElementRef.current,
              currentPlacement: nextDialogPositionStyle.currentPlacement,
              ...props.dialogMinMaxSizes,
            })
          : getAvailablePlacementFromTheOnesToBeTried(
              orderOfPlacementsToBeTried,
              dialogRef.current,
              relativeElementRef.current
            );

      if (availablePosition.type === "partial-size-available") {
        // in case of partial size available to be displayed,
        // apply the new height or width on element before computing
        // its position for available placement location
        // (for ex. if placement is left this will make sure to always
        // place on left center based on new dialog height obtained
        // after reducing the width of it)
        switch (availablePosition.placement) {
          case "top-start":
          case "top":
          case "top-end":
          case "bottom-start":
          case "bottom":
          case "bottom-end":
            // Note: maxHeight will be set on .QwikUiTooltip-tooltip
            nextDialogPositionStyle = {
              ...nextDialogPositionStyle,
              maxHeight: `${availablePosition.availableSize - bridgeSize}px`,
            };

            if (tooltipRef.current) {
              tooltipRef.current.style.maxHeight =
                nextDialogPositionStyle.maxHeight;
            }
            break;
          case "left-start":
          case "left":
          case "left-end":
          case "right-start":
          case "right":
          case "right-end":
            // Note: maxWidth will be set on .QwikUiTooltip-dialog-with-bridge
            nextDialogPositionStyle = {
              ...nextDialogPositionStyle,
              maxWidth: `${availablePosition.availableSize}px`,
            };
            updateDialogWithBridgeStyle(
              dialogWithBridgeRef,
              nextDialogPositionStyle,
              dialogOffset,
              leaveDelay,
              arrowSize
            );
            break;
        }
        await nextTickRender(); // wait for new width/height to be rendered,
        // to be able to compute properly, the position of dialog for
        // available placement location
      }

      nextDialogPositionStyle = {
        ...dialogPositionStyle,
        currentPlacement: availablePosition.placement,
      };

      if (dialogWithBridgeRef.current) {
        dialogWithBridgeRef.current.setAttribute(
          "class",
          getDialogWithBridgeClass(
            tooltipRootClass,
            nextDialogPositionStyle,
            dialogAnimationState
          )
        );
      }

      await nextTickRender(); // wait for the placement class to be rendered,
      // in order to have the bridge (padding) applied

      nextDialogPositionStyle = {
        ...nextDialogPositionStyle,
        value: {
          ...nextDialogPositionStyle.value,
          ...getDialogPositionStyle(
            availablePosition,
            dialogWithBridgeRef.current, // dialogWithBridgeRef have the bridge in place in this point
            // so we can properly compute the position, taking into account the bridge
            relativeElementRef.current,
            scrollableContainer
          ),
          "--scrollbar-height": `${
            window.innerHeight - document.documentElement.clientHeight
          }px`,
          // visibility: "visible",
        },
      };
      updateDialogWithBridgeStyle(
        dialogWithBridgeRef,
        nextDialogPositionStyle,
        dialogOffset,
        leaveDelay,
        arrowSize
      );

      await nextTickRender(); // wait for the dialog to be rendered on the computed placement

      nextDialogPositionStyle = {
        ...nextDialogPositionStyle,
        value: {
          ...nextDialogPositionStyle.value,
          ...(arrow
            ? {
                ...(() => {
                  const { x, y, width, height } =
                    getElementVisibleBoundingClientRectInsideScrollableContainer(
                      relativeElementRef.current,
                      getScrollableContainer(scrollableContainer)
                    );

                  return {
                    "--relative-x": `${x}px`,
                    "--relative-y": `${y}px`,
                    "--relative-width": `${width}px`,
                    "--relative-height": `${height}px`,
                  };
                })(),
                ...(() => {
                  const { x, y, width, height } =
                    dialogRef.current.getBoundingClientRect() ?? {};

                  return {
                    "--dialog-x": `${x}px`,
                    "--dialog-y": `${y}px`,
                    "--dialog-width": `${width}px`,
                    "--dialog-height": `${height}px`,
                  };
                })(),
              }
            : {}),
        },
      };
      updateDialogWithBridgeStyle(
        dialogWithBridgeRef,
        nextDialogPositionStyle,
        dialogOffset,
        leaveDelay,
        arrowSize
      );
      setDialogPositionStyle(nextDialogPositionStyle);
    }
  });

  const scheduleDialogOpen = useEventCallback(() => {
    // ! check again to make sure we open dialog just if external
    // ! state specify now that the dialog should be opened
    // This check is needed because due to asynchronously downloading
    // the function, it might be downloaded later than scheduleDialogClose
    // an in that case close would take place before scheduleDialogOpen,
    // and this will end up, having dialog open, even if external state
    // specify that it should be closed
    if (open) {
      const nextDialogPositionStyle: typeof dialogPositionStyle = {
        ...dialogPositionStyle,
        value: {
          ...dialogPositionStyle.value,
          visibility: "hidden" as const, // this will be applied on the next qwik render
        },
      };
      updateDialogWithBridgeStyle(
        dialogWithBridgeRef,
        nextDialogPositionStyle,
        dialogOffset,
        leaveDelay,
        arrowSize
      );

      // @ts-expect-error we expect setTimeout to return number in browser and not NodeJS.Timeout
      openDialogTimeoutID.current = setTimeout(async () => {
        // ! check again to make sure we open dialog just if external
        // ! state specify now that the dialog should be opened
        if (open) {
          await nextTickRender(); // wait for dialog to have `visibility: hidden` set
          // before showing it
          // This is important in order to avoid the display of it on a position
          // inappropriate with requested/available placement
          // * (at this moment we don't have the dialog sizes,
          // * and it is not positioned on requested/available placement)

          // const positionDialogAndMakeItVisible = new ResizeObserver(
          //   async () => {
          //     await positionDialog();
          //     await positionDialog(); // call a second time to make sure that the size of dialog is computed properly
          //     // (the first time when we call positionDialog the browser doesn't compute the height/width of dialog properly)
          //     dialogPositionStyle.value = {
          //       ...dialogPositionStyle.value,
          //       visibility: "visible",
          //     };
          //     dialogAnimationState.value = "show";
          //     positionDialogAndMakeItVisible.disconnect();
          //   }
          // );

          if (dialogRef.current) {
            // positionDialogAndMakeItVisible.observe(dialogRef.value);
            dialogWithBridgeRef.current?.showPopover();
            setDialogIsOpenLocalState(true);

            await positionDialog();
            // await positionDialog(); // call a second time to make sure that the size of dialog is computed properly
            // (the first time when we call positionDialog the browser doesn't compute the height/width of dialog properly)
            setDialogPositionStyle((prev) => ({
              ...prev,
              value: {
                ...prev.value,
                visibility: "visible",
              },
            }));
            setDialogAnimationState("show");
          }
        }
      }, enterDelay);
    }
  });

  const closeDialog = () => {
    // ! check again to make sure we close dialog just if external
    // ! state specify now that the dialog should be closed
    if (!open) {
      dialogWithBridgeRef.current?.hidePopover();
      setDialogIsOpenLocalState(false);

      setDialogPositionStyle((prev) => ({
        ...prev,
        currentPlacement: undefined,
        value: {},
        maxHeight: "",
        maxWidth: "",
      }));

      const scrollableContainerElement = scrollableContainer ?? document;
      scrollableContainerElement.removeEventListener("scroll", positionDialog);
    }
  };

  const scheduleDialogClose = useEventCallback(() => {
    // check again to make sure we close dialog just if external
    // state specify now that the dialog should be closed
    if (!open) {
      setDialogAnimationState("hide");

      // @ts-expect-error we expect setTimeout to return number in browser and not NodeJS.Timeout
      closeDialogTimeoutID.value = setTimeout(() => {
        closeDialog();
      }, leaveDelay);
    }
  });

  const cancelDialogOpen = () => {
    if (openDialogTimeoutID.current !== undefined) {
      clearTimeout(openDialogTimeoutID.current);
      openDialogTimeoutID.current = undefined;
      setDialogAnimationState("hide");
    }
  };

  const cancelDialogClose = useEventCallback(() => {
    if (closeDialogTimeoutID.current !== undefined) {
      clearTimeout(closeDialogTimeoutID.current);
      closeDialogTimeoutID.current = undefined;
      setDialogAnimationState("show");
    }
  });

  const handleClickOutsideClose = useEventCallback((event: Event) => {
    if (
      dialogWithBridgeRef.current !== event.target &&
      !dialogWithBridgeRef.current?.contains(event.target as Node) &&
      relativeElementRef.current !== event.target &&
      !relativeElementRef.current?.contains(event.target as Node)
    ) {
      onClose$?.();
    }
  });

  useEffect(() => {
    async function handleDialogState() {
      const shouldDialogOpen = open;

      if (shouldDialogOpen) {
        cancelDialogClose();
        scheduleDialogOpen();

        return () => {
          cancelDialogOpen();
        };
      } else {
        cancelDialogOpen();
        if (dialogIsOpenLocalState) {
          scheduleDialogClose();

          return () => {
            cancelDialogClose();
          };
        }
      }
    }

    handleDialogState();
  }, [
    open,
    dialogIsOpenLocalState,
    cancelDialogClose,
    scheduleDialogOpen,
    scheduleDialogClose,
  ]);

  useEffect(() => {
    const isDialogOpen = dialogIsOpenLocalState;

    if (isDialogOpen && triggerActions.includes("click")) {
      window.addEventListener("click", handleClickOutsideClose);

      return () => {
        if (triggerActions.includes("click")) {
          window.removeEventListener("click", handleClickOutsideClose);
        }
      };
    }
  }, [dialogIsOpenLocalState, handleClickOutsideClose, triggerActions]);

  useEffect(() => {
    const isDialogOpen = dialogIsOpenLocalState;

    if (isDialogOpen) {
      const scrollableContainerElement = scrollableContainer ?? document;
      scrollableContainerElement.addEventListener("scroll", positionDialog);

      return () => {
        scrollableContainerElement.removeEventListener(
          "scroll",
          positionDialog
        );
      };
    }
  }, [dialogIsOpenLocalState, scrollableContainer, positionDialog]);

  const handleMouseOrFocusLeaveDialog = async (
    event: MouseEvent | FocusEvent
  ) => {
    if (
      relativeElementRef.current !== event.relatedTarget &&
      (!(event.relatedTarget instanceof Node) ||
        !relativeElementRef.current?.contains(event.relatedTarget))
    ) {
      onClose$?.();
    }
  };

  return (
    <div
      className={getDialogWithBridgeClass(
        tooltipRootClass,
        dialogPositionStyle,
        dialogAnimationState
      )}
      ref={dialogWithBridgeRef}
      popover="manual"
      id={tooltipId}
      role="tooltip"
      data-dialog-placement={preferredPlacement}
      style={getDialogWithBridgeStyle(
        dialogPositionStyle,
        dialogOffset,
        leaveDelay,
        arrowSize
      )}
      onMouseEnter={
        triggerActions.includes("hover")
          ? () => {
              onOpen$?.(); // emit open to parent to make sure it will have open state also
              cancelDialogClose();
            }
          : undefined
      }
      onMouseLeave={
        triggerActions.includes("hover")
          ? handleMouseOrFocusLeaveDialog
          : undefined
      }
    >
      <div
        className="QwikUiTooltip-inner-dialog-with-bridge"
        ref={dialogRef}
        onBlur={
          triggerActions.includes("focus")
            ? handleMouseOrFocusLeaveDialog
            : undefined
        }
      >
        <div className="QwikUiTooltip-animated-inner-dialog-with-bridge">
          <div
            ref={tooltipRef}
            className={classNames("QwikUiTooltip-tooltip", tooltipClass)}
            style={{
              maxHeight: dialogPositionStyle.maxHeight,
            }}
          >
            {props.children}
          </div>
          {arrow && <TooltipArrow arrowSize={arrowSize} />}
        </div>
      </div>
    </div>
  );
};
