
# React Native FadeView

 FadeView is a handy component written in [TypeScript](https://www.typescriptlang.org/) in order to handle the fade animations more easier for every react native component.

![](https://github.com/aliunco/react-native-fadeview/blob/main/demo.gif?raw=true)

## Installing

For the latest stable version:

using npm:
```bash
npm install --save react-native-fadeview-wrapper
```

using yarn:
```bash
yarn add react-native-fadeview-wrapper
```

## Usage

```tsx
import React, { Component } from 'react';
import FadeView, { Bearing } from 'react-native-fadeview-wrapper';

const Example = () => {

    const [isVisible, setIsVisible] = React.useState<boolean>(false)

    return (
      <FadeView 
          visible={visible} 
          bearingMoveDistance={20}
          leaveBearing={Bearing.Top} 
          entranceBearing={Bearing.Bottom}>
          {/** any components can be used here in order to have the fade animation */}    
      </FadeView>
    );
}
```

## Documentation

here is the properties and the descriptions of it: 


| Props Name | Default | Type | isRequired | Description |
| :--: | :----- | :--: | :--: | :------------------------- |
| visible | | **it's required** | `boolean` | `YES` | changing this param would initiate the fade animation |
| shouldEnterWithAnimation | `false` | `boolean` | `NO` | if it's `true`, then the first state of `visible` would be presented by animation |
| style | `undefined` | `ViewStyle` | `NO` | optinal style for the fadeview itself |
| bearingMoveDistance| 50 | `number` | `NO` | option distance when you pass the directional Bearing for entrance or leave |
| removeChildrenAfterDisapearance| `false` | `boolean` | `NO` | you can choose if you want the children view to be removed after disappearance | 
| children | `undefined` | `JSX.Element` | `JSX.Element[]` | `NO` | child component(s) in order to have the fade animation |
| entranceBearing | `Bearing.Center` | `Bearing` | `NO` | entrance animation with can be determined by `Bearing` enum from the lib, values: `Top`, `Bottom`, `Left`, `Right` , `Center` |
| leaveBearing | `Bearing.Center` | `Bearing` | `NO` | leave animation with can be determined by `Bearing` enum from the lib, values: `Top`, `Bottom`, `Left`, `Right` , `Center` |
| fadeOutScale | 1.1 | `number` | `NO` | scale of fade out state of the animation |
| duration | 200 | `number` | `NO` | milliseconds of the fade animation |
| animationFinished | `undefined` | `(visible: boolean) => void` | `NO` | call back closure in order to do something after each animation is finished |
