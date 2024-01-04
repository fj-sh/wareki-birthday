import Animated, { useSharedValue } from 'react-native-reanimated';
import { data, type HeaderListItem, isHeader, type ListItem } from '../../constants/sample';
import { useHeaderStyle } from '../../hooks/useHeaderStyle';
import { useCallback, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, StyleSheet, TextInput, View } from 'react-native';
import { useHeaderLayout } from '../../hooks/useHeaderLayout';
import { MeasureableAnimatedView } from '../MeasureableAnimatedView';
import { SectionListItem } from '../SectionListItem';
import { EvilIcons } from '@expo/vector-icons';

const HeaderHeight = 65;
const ItemHeight = 50;

const headers = data.filter(isHeader) as HeaderListItem[];

const FriendListScreen = () => {
  const [searchText, setSearchText] = useState('');
  const contentOffsetY = useSharedValue(0);
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
  });

  const flatlistRef = useRef<FlatList<ListItem | HeaderListItem>>(null);

  const onSelectHeaderItem = useCallback((headerItem: string) => {
    const headerIndex = data.findIndex((_item) => (_item as HeaderListItem).header === headerItem);
    flatlistRef.current?.scrollToIndex({
      index: headerIndex,
    });
  }, []);

  const onChangeSearchText = useCallback((value: string) => {
    setSearchText(value);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.textInputContainer}>
          <EvilIcons name="search" size={24} color="#BDBDBD" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            onEndEditing={(e) => {
              onChangeSearchText(e.nativeEvent.text);
            }}
          />
        </View>
        {/* Animated Header Section */}
        <Animated.View style={[{ flexDirection: 'row' }, rHeaderListStyle]}>
          {headers.map(({ header }, index) => {
            return (
              <MeasureableAnimatedView
                key={header}
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
        ref={flatlistRef}
        scrollEventThrottle={16}
        data={data}
        contentContainerStyle={{
          paddingBottom: 400,
        }}
        renderItem={({ item }) => {
          return (
            <SectionListItem item={item} height={isHeader(item) ? HeaderHeight : ItemHeight} />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    width: '95%',

    marginVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
});

export { FriendListScreen };
