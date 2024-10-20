import { useEffect, useRef, useState } from "react";
import { LayoutRectangle, StyleProp, View, ViewStyle } from "react-native";
import Animated, { createAnimatedPropAdapter, interpolateColor, processColor, runOnJS, SharedValue, useAnimatedProps, useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Rect } from "react-native-svg";
import { ZonesEditor } from "./AnimationMaker.tsx/ZonesEditor";
import { SliderPoint } from "../types/sliderTypes";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const adapter = createAnimatedPropAdapter(
  props => {
    if (Object.keys(props).includes('fill')) {
      props.fill = {type: 0, payload: processColor(props.fill)};
    }
  },
  ['fill'],
);

interface IAnimationPreview {
    animationModeId:number;
}

export const AnimationPreview: React.FC<IAnimationPreview> = ({animationModeId}) => {
  const [leds, setLeds] = useState<
    {id: number; progress: SharedValue<number>; point:{x: number, y:number}}[]
  >([
    {id: 0, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 1, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 2, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 3, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 4, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 5, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 6, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 7, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 8, progress: useSharedValue(0), point:{x:0, y:0}},
    {id: 9, progress: useSharedValue(0), point:{x:0, y:0}},
  ]);

  const i = useSharedValue<number>(0);
  const lastCalledId = useRef<number | undefined>(undefined);

  const handleIChange = (i: number) => {
    let id = Math.round(i);
    if (lastCalledId.current == undefined || lastCalledId.current != id) {
      fadeToblackBy(id - 1);
      lastCalledId.current = id;
    }
  };

  const shootingStar = () => {
    i.value = withTiming(7, {duration: 800}, () => {
      i.value = 0;
    });
  };

  const coals = () => {
    i.value = Math.random() * 7;
  };

  const beatSin = () => {
    i.value = withTiming(7, {duration: 700}, () => {
      i.value = withTiming(0, {duration: 700});
    });
  };

  const fadeToblackBy = (id: number) => {
    if (id >= 0) {
      leds[id].progress.value = withTiming(100, {duration: 200}, () => {
        leds[id].progress.value = withTiming(0, {duration: 500});
      });
    }
  };

  useAnimatedReaction(
    () => i.value,
    () => {
      runOnJS(handleIChange)(i.value);
    },
  );

  useEffect(() => {
    let intervalId:NodeJS.Timeout;
    if (animationModeId === 0) {
      intervalId = setInterval(() => {
        coals();
      }, 80); // call every 80ms
    } else if (animationModeId === 1) {
      intervalId = setInterval(() => {
        shootingStar();
      }, 1000); // call every 1000ms (1 second)
    } else if (animationModeId === 2) {
      intervalId = setInterval(() => {
        beatSin();
      }, 1400); // call every 1400ms
    }
  
    return () => {
      clearInterval(intervalId); // clean up when component unmounts
    };
  }, [animationModeId]);

  const handleLayout = (layout:LayoutRectangle) => {
    let points:SliderPoint[];
    points = getSliderPoints(layout,10)
    setLeds(p => p.map((res,id) => res.point.x == 0? {...res, x:points[id].x, y:layout.height/2}:res))
    console.log(leds)
  }

  return (
    <Svg style={{width:'100%', height:'100%'}} onLayout={e => handleLayout(e.nativeEvent.layout)} onTouchStart={() => console.log('asd')}>
      {leds.map((led, id) => (
        <LedCircle key={id} progress={led.progress} id={id}/>
      ))}
    </Svg>
  );
};


const LedCircle: React.FC<{progress: SharedValue<number>;id:number}> = ({progress, id}) => {
    const animatedProps = useAnimatedProps(
      () => ({
        fill: interpolateColor(
          progress.value,
          [0, 100],
          ['#1a1a1a', 'green'],
          'RGB',
        ),
      }),
      [],
      adapter,
    );
  
    return (
      <AnimatedCircle cx={`${(100/11)*(id+1)}%`} cy={'50%'} r={10} fill={'green'} />
    );
  };

  const getSliderPoints = (container: LayoutRectangle, ledCount: number) => {
    const newPoints: SliderPoint[] = [];
    for (let id = 0; id < ledCount; id++) {
      let x =
        (container.width / 100) * (id / (ledCount - 1)) * 94 +
        (container.width / 100) * 3;
      let y = container.height / 2;
      newPoints.push({id, x, y});
      if (id > 90) {
        console.log(id, x);
      }
    }
    return newPoints;
  };