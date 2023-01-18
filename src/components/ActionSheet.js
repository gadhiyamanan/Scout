import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../constants/colors';
export default function CTActionSheet({
  isVisible,
  data,
  itemContainerStyle,
  itemStyle,
  itemTextStyle,
  onCancelPress,
  containerStyle,

}) {
  return (
    <Modal
      isVisible={isVisible}
      backdropColor={colors.black}
      backdropOpacity={0.5}
      onBackdropPress={() => onCancelPress()}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      useNativeDriverForBackdrop
      useNativeDriver
      onSwipeComplete={() => onCancelPress()}
      swipeDirection={['down']}>

      <View style={[styles.container, containerStyle]}>
        <View style={[styles.itemContainer, itemContainerStyle]}>
          <TouchableOpacity
            onPress={() => onCancelPress()}
            style={{
              width: '15%',
              alignSelf: 'center',
              marginBottom: 10,
              height: 2,
              backgroundColor: colors.gray,
            }}
          />
          {data.map((item, index) => (
            <View key={String(index)}>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.item, itemStyle]}
                onPress={item.onPress}>
                {item.icon && (
                  <Image
                    source={item.icon}
                    style={{
                      tintColor: colors.gray,
                      width: 20,
                      height: 20,
                      marginHorizontal: 15,
                      resizeMode: 'contain',
                    }}
                  />
                )}

                <Text
                  style={{
                    textAlign: !item.icon ? 'center' : 'left',
                    fontSize: 15,
                    color: colors.gray,
                    flex: 1,
                    ...itemTextStyle,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>

      </View>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
  },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  horizontalLine: {
    borderTopColor: '#efefef',
    borderTopWidth: 0.5,
  },
  cancleText: {
    color: 'red',
  },
  cancelContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {

    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  title: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
