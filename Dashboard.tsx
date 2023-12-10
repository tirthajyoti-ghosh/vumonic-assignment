import * as React from 'react';
import { StatusBar, Image, FlatList, Dimensions, Animated, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('screen');
const WINDOW_WIDTH = Dimensions.get('window').width;

// https://www.creative-flyers.com
const DATA = [
    {
        title: 'Afro vibes',
        location: 'Mumbai, India',
        date: 'Nov 17th, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/07/Afro-vibes-flyer-template.jpg',
    },
    {
        title: 'Jungle Party',
        location: 'Unknown',
        date: 'Sept 3rd, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2019/11/Jungle-Party-Flyer-Template-1.jpg',
    },
    {
        title: '4th Of July',
        location: 'New York, USA',
        date: 'Oct 11th, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/06/4th-Of-July-Invitation.jpg',
    },
    {
        title: 'Summer festival',
        location: 'Bucharest, Romania',
        date: 'Aug 17th, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/07/Summer-Music-Festival-Poster.jpg',
    },
    {
        title: 'BBQ with friends',
        location: 'Prague, Czech Republic',
        date: 'Sept 11th, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/06/BBQ-Flyer-Psd-Template.jpg',
    },
    {
        title: 'Festival music',
        location: 'Berlin, Germany',
        date: 'Apr 21th, 2021',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/06/Festival-Music-PSD-Template.jpg',
    },
    {
        title: 'Beach House',
        location: 'Liboa, Portugal',
        date: 'Aug 12th, 2020',
        poster: 'https://www.creative-flyers.com/wp-content/uploads/2020/06/Summer-Beach-House-Flyer.jpg',
    },
];

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;

export default function App() {
    const [data, setData] = React.useState(DATA);
    const scrollXIndex = React.useRef(new Animated.Value(0)).current;
    const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
    const [index, setIndex] = React.useState(0);
    const setActiveIndex = React.useCallback(activeIndex => {
        scrollXIndex.setValue(activeIndex);
        setIndex(activeIndex);
    }, []);

    React.useEffect(() => {
        if (index === data.length - 1) {
            setIndex(0);
        }
    }, [index]);

    React.useEffect(() => {
        Animated.spring(scrollXAnimated, {
            toValue: scrollXIndex,
            useNativeDriver: true,
        }).start();
    });

    return (
        <FlingGestureHandler
            key="left"
            direction={Directions.LEFT}
            onHandlerStateChange={ev => {
                if (ev.nativeEvent.state === State.END) {
                    if (index === data.length - 1) {
                        return;
                    }
                    setActiveIndex(index + 1);
                }
            }}>
            <FlingGestureHandler
                key="right"
                direction={Directions.RIGHT}
                onHandlerStateChange={ev => {
                    if (ev.nativeEvent.state === State.END) {
                        if (index === 0) {
                            return;
                        }
                        setActiveIndex(index - 1);
                    }
                }}>
                    {/* <OverflowItems data={data} scrollXAnimated={scrollXAnimated} /> */}
                    <FlatList
                        data={data}
                        keyExtractor={(_, index) => String(index)}
                        horizontal
                        inverted
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'center',
                            padding: SPACING * 2,
                            marginTop: 50,
                        }}
                        scrollEnabled={false}
                        removeClippedSubviews={false}
                        CellRendererComponent={({ item, index, children, style, ...props }) => {
                            const newStyle = [style, { zIndex: data.length - index }];
                            return (
                                <View style={newStyle} {...props}>
                                    {children}
                                </View>
                            );
                        }}
                        renderItem={({ item, index }) => {
                            const inputRange = [index - 1, index, index + 1];
                            const translateX = scrollXAnimated.interpolate({
                                inputRange,
                                outputRange: [0, 0, -WINDOW_WIDTH], // modified outputRange
                            });
                            const scale = scrollXAnimated.interpolate({
                                inputRange,
                                outputRange: [1, 1, 0.9], // modified outputRange
                            });
                            const opacity = scrollXAnimated.interpolate({
                                inputRange,
                                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
                            });
                        
                            return (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        left: -ITEM_WIDTH / 2,
                                        opacity,
                                        transform: [
                                            {
                                                translateX,
                                            },
                                            { scale },
                                        ],
                                    }}>
                                    <Image
                                        source={{ uri: item.poster }}
                                        style={{
                                            width: ITEM_WIDTH,
                                            height: ITEM_HEIGHT,
                                            borderRadius: 14,
                                        }}
                                    />
                                </Animated.View>
                            );
                        }}
                    />
            </FlingGestureHandler>
        </FlingGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -1,
    },
    location: {
        fontSize: 16,
    },
    date: {
        fontSize: 12,
    },
    itemContainer: {
        height: OVERFLOW_HEIGHT,
        padding: SPACING * 2,
    },
    itemContainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overflowContainer: {
        height: OVERFLOW_HEIGHT,
        overflow: 'hidden',
    },
});