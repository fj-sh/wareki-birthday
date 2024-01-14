import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { data, type HeaderListItem, isHeader } from '../../constants/sample';
import { useHeaderStyle } from '../../hooks/useHeaderStyle';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useHeaderLayout } from '../../hooks/useHeaderLayout';
import { MeasureableAnimatedView } from '../MeasureableAnimatedView';
import { SectionListItem } from '../SectionListItem';
import { EvilIcons } from '@expo/vector-icons';
import { BottomFloatingButton } from '../UIParts/FloatingButton';
import { Palette } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { i18n } from '../../lib/i18n/i18n';
import { type Friend } from '../../lib/interfaces/friend';
import { SwipeableListItem } from '../UIParts/SwipeableListItem';
import { HeaderHeight, ItemHeight } from '../../constants/itemHeight';
import { useFriendStore } from '../../lib/store/friendStore';

const headers = data.filter(isHeader) as HeaderListItem[];

const FriendListScreen = () => {
  const { friends } = useFriendStore();

  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();
  const contentOffsetY = useSharedValue(0);
  const { bottom: safeBottom } = useSafeAreaInsets();
  const isScrolling = useSharedValue(false);
  const router = useRouter();

  const textInputContainerStyle = [
    localStyles.textInputContainer,
    {
      borderColor: colorScheme === 'dark' ? '#424242' : '#E0E0E0',
      backgroundColor: colorScheme === 'dark' ? '#424242' : '#F5F5F5',
    },
  ];

  const textInputStyle = [
    localStyles.textInput,
    {
      backgroundColor: colorScheme === 'dark' ? '#424242' : '#F5F5F5',
    },
  ];

  // Where the magic happens :)
  const { headerRefs, headersLayoutX, headersLayoutY } = useHeaderLayout({
    headers,
    data,
    headerHeight: HeaderHeight,
    itemHeight: ItemHeight,
  });

  const { rHeaderListStyle, rIndicatorStyle } = useHeaderStyle({
    contentOffsetY,
    headersLayoutX,
    headersLayoutY,
    colorSchemeName: colorScheme,
  });

  const flatlistRef = useRef<FlatList<Friend | HeaderListItem>>(null);

  const onSelectHeaderItem = useCallback((headerItem: string) => {
    const headerIndex = data.findIndex((_item) => (_item as HeaderListItem).header === headerItem);
    flatlistRef.current?.scrollToIndex({
      index: headerIndex,
    });
  }, []);

  const onChangeSearchText = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  // Define the animated style for the floating action button
  const rFloatingActionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isScrolling.value ? 0 : 1, {
            overshootClamping: true,
          }),
        },
      ],
    };
  }, []);

  const onAddButtonPress = useCallback(() => {
    router.push('/(tabs)/register');
  }, []);

  return (
    <SafeAreaView style={localStyles.container}>
      <>
        <View style={textInputContainerStyle}>
          <EvilIcons name="search" size={24} color="#BDBDBD" style={localStyles.icon} />
          <TextInput
            style={textInputStyle}
            onEndEditing={(e) => {
              onChangeSearchText(e.nativeEvent.text);
            }}
            placeholder={i18n.t('birthdayList.searchPlaceholder')}
          />
        </View>
        {/* Animated Header Section */}
        <Animated.View style={[{ flexDirection: 'row' }, rHeaderListStyle]}>
          {headers.map(({ header }, index) => {
            return (
              <MeasureableAnimatedView
                key={`${header}-${index}`}
                onTouchStart={() => {
                  onSelectHeaderItem(header);
                }}
                ref={headerRefs[index]}
                style={{
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                  key={`${header}-${index}-header-text`}
                >
                  {header}
                </Text>
              </MeasureableAnimatedView>
            );
          })}
        </Animated.View>
        <Animated.View style={rIndicatorStyle} />
      </>
      {/* List */}
      <FlatList
        onScroll={(e) => {
          contentOffsetY.value = e.nativeEvent.contentOffset.y;
        }}
        onMomentumScrollBegin={() => {
          isScrolling.value = true;
        }}
        onMomentumScrollEnd={() => {
          isScrolling.value = false;
        }}
        ref={flatlistRef}
        scrollEventThrottle={16}
        data={data}
        contentContainerStyle={{
          paddingBottom: 400,
        }}
        renderItem={({ item }) => {
          if (isHeader(item)) {
            const header = item as HeaderListItem;
            return (
              <SectionListItem
                item={header}
                height={HeaderHeight}
                key={`${header.id}-rendered-header`}
              />
            );
          }

          const friend = item as Friend;
          return (
            <SwipeableListItem
              simultaneousHandlers={flatlistRef}
              friend={friend}
              onDismiss={() => {
                console.log('onDismiss');
              }}
              key={friend.id}
            />
          );
        }}
      />
      <BottomFloatingButton
        onSelect={onAddButtonPress}
        style={[
          {
            position: 'absolute',
            bottom: safeBottom / 2,
            right: 16,
            height: 64,
            aspectRatio: 1,
            backgroundColor: colorScheme === 'dark' ? '#455A64' : Palette.primary,
            borderRadius: 32,
          },
          rFloatingActionStyle,
        ]}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 0.5,
    borderRadius: 5,
    marginVertical: 6,
    marginHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
  },
  textInput: {
    height: 30,
    fontSize: 16,
    width: '85%',
    marginVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
  },
});

export { FriendListScreen };
