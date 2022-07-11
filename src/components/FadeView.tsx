import React from 'react'
import {
    Animated,
    Easing,
    ViewStyle
} from 'react-native'

export enum Bearing {
    Top, Bottom, Left, Right, Center
}

type Props = {
    visible: boolean
    style?: ViewStyle,
    children?: JSX.Element | JSX.Element[],
    entranceBearing?: Bearing
    leaveBearing?: Bearing
    fadeOutScale?: number
    duration?: number
    shouldEnterWithAnimation?: boolean
    animationFinished?: (isVisible: boolean) => void
    // All other props
    [x: string]: any
}

export const FadeView = ({ 
    style, 
    visible, 
    children, 
    shouldEnterWithAnimation, 
    fadeOutScale = 1.1, 
    duration = 200, 
    entranceBearing = Bearing.Center, 
    leaveBearing = Bearing.Center, 
    animationFinished, 
    ...rest 
}: Props) => {

    const [visibleState, setVisibleState] = React.useState<boolean>(shouldEnterWithAnimation == true ? !visible : visible)
    const [visibilityAnimValue] = React.useState(new Animated.Value(shouldEnterWithAnimation == true ? (visible ? 0 : 1) : (visible ? 1 : 0)))
    const theAnimation = React.useRef<Animated.CompositeAnimation | null>(null)
    const applyingVisibleState = React.useRef<Boolean>(shouldEnterWithAnimation == true ? !visible : visible)

    React.useEffect(() => {
        if (applyingVisibleState.current == visible) { return }
        if (theAnimation && applyingVisibleState.current != visible) {
            theAnimation.current?.stop()
            theAnimation.current = null
        }
        applyingVisibleState.current = visible

        theAnimation.current = Animated.timing(visibilityAnimValue, {
            toValue: visible ? 1 : 0,
            duration,
            easing: Easing.inOut(Easing.linear),
            useNativeDriver: true
        })

        if (visible && !visibleState) { setVisibleState(true) }
        theAnimation.current.start(({ finished }) => {
            theAnimation.current = null
            if (finished) {
                setVisibleState(visible)
                animationFinished && animationFinished(visible)
            }
        })
    }, [visible])

    var transforms: any[] = []

    if (entranceBearing != Bearing.Center || (applyingVisibleState.current == false && leaveBearing == entranceBearing)) {
        if (entranceBearing == Bearing.Left || entranceBearing == Bearing.Right)
            transforms.push({ translateX: visibilityAnimValue.interpolate({ inputRange: [0, 1], outputRange: [entranceBearing == Bearing.Left ? -50 : 50, 0] }) })

        if (entranceBearing == Bearing.Top || entranceBearing == Bearing.Bottom)
            transforms.push({ translateY: visibilityAnimValue.interpolate({ inputRange: [0, 1], outputRange: [entranceBearing == Bearing.Top ? -50 : 50, 0] }) })
    } else if (applyingVisibleState.current == false && leaveBearing != Bearing.Center) {
        if (leaveBearing == Bearing.Left || leaveBearing == Bearing.Right)
            transforms.push({ translateX: visibilityAnimValue.interpolate({ inputRange: [0, 1], outputRange: [leaveBearing == Bearing.Left ? -50 : 50, 0] }) })

        if (leaveBearing == Bearing.Top || leaveBearing == Bearing.Bottom)
            transforms.push({ translateY: visibilityAnimValue.interpolate({ inputRange: [0, 1], outputRange: [leaveBearing == Bearing.Top ? -50 : 50, 0] }) })
    }

    var containerStyle = {
        opacity: visibilityAnimValue,
        transform: [
            ...transforms,
            {
                scale: visibilityAnimValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [fadeOutScale, 1],
                })
            }
        ]
    }

    return (
        <Animated.View pointerEvents={visibleState ? 'auto' : 'none'} style={[style, containerStyle]} {...rest}>
            { visibleState && children }
        </Animated.View>
    )
};