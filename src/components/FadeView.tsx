import React from "react";
import { Animated, Easing, EasingFunction, StyleProp, ViewProps, ViewStyle } from "react-native";

export enum Bearing {
  Top,
  Bottom,
  Left,
  Right,
  Center,
}

type Props = ViewProps & {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  entranceBearing?: Bearing;
  easing?: EasingFunction;
  leaveBearing?: Bearing;
  fadeOutScale?: number;
  duration?: number;
  shouldEnterWithAnimation?: boolean;
  bearingMoveDistance?: number
  removeChildrenAfterDisapearance?: boolean
  animationFinished?: (isVisble: boolean) => void;
  // All other props
  [x: string]: any;
};

const FadeView = ({
    style,
    visible,
    children,
    duration = 200,
    easing = Easing.inOut(Easing.linear),
    fadeOutScale = 1.1,
    shouldEnterWithAnimation,
    bearingMoveDistance = 50,
    leaveBearing = Bearing.Center,
    entranceBearing = Bearing.Center,
    removeChildrenAfterDisapearance = false,
    animationFinished,
    ...rest
}: Props) => {
  const [visibleState, setVisibleState] = React.useState<boolean>(
    shouldEnterWithAnimation === true ? !visible : visible,
  );
  const [visibilityAnimValue] = React.useState(
    new Animated.Value(
      shouldEnterWithAnimation === true ? (visible ? 0 : 1) : visible ? 1 : 0,
    ),
  );
  const theAnimation = React.useRef<Animated.CompositeAnimation | null>(null);
  const applyingVisibleState = React.useRef<boolean>(
    shouldEnterWithAnimation === true ? !visible : visible,
  );

  React.useEffect(() => {
    if (applyingVisibleState.current === visible) {
      return;
    }
    if (theAnimation && applyingVisibleState.current !== visible) {
      theAnimation.current?.stop();
      theAnimation.current = null;
    }
    applyingVisibleState.current = visible;

    theAnimation.current = Animated.timing(visibilityAnimValue, {
      easing,
      duration,
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });

    if (visible && !visibleState) {
      setVisibleState(true);
    }
    theAnimation.current.start(({ finished }) => {
      theAnimation.current = null;
      if (finished) {
        setVisibleState(visible);
        animationFinished?.(visible);
      }
    });
  }, [visible]);

  const transforms: any[] = [];

  if (
    entranceBearing !== Bearing.Center && visible === true
  ) {
    if (entranceBearing === Bearing.Left || entranceBearing === Bearing.Right) {
      transforms.push({
        translateX: visibilityAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [entranceBearing === Bearing.Left ? -bearingMoveDistance : bearingMoveDistance, 0],
        }),
      });
    }

    if (entranceBearing === Bearing.Top || entranceBearing === Bearing.Bottom) {
      transforms.push({
        translateY: visibilityAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [entranceBearing === Bearing.Top ? -bearingMoveDistance : bearingMoveDistance, 0],
        }),
      });
    }
  } else if (visible === false && leaveBearing !== Bearing.Center) {
    if (leaveBearing === Bearing.Left || leaveBearing === Bearing.Right) {
      transforms.push({
        translateX: visibilityAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [leaveBearing === Bearing.Left ? -bearingMoveDistance : bearingMoveDistance, 0],
        }),
      });
    }

    if (leaveBearing === Bearing.Top || leaveBearing === Bearing.Bottom) {
      transforms.push({
        translateY: visibilityAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [leaveBearing === Bearing.Top ? -bearingMoveDistance : bearingMoveDistance, 0],
        }),
      });
    }
  }

  const containerStyle = {
    opacity: visibilityAnimValue,
    transform: [
      ...transforms,
      {
        scale: visibilityAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [fadeOutScale, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View
      pointerEvents={visibleState ? "auto" : "none"}
      style={[style, containerStyle]}
      {...rest}
    >
        { 
            removeChildrenAfterDisapearance ?
            visibleState && children
            : children
        }
    </Animated.View>
  );
};

export default FadeView;
