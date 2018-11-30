// @flow
import React from "react";
import {
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
  View,
  Image,
  StyleSheet,
} from "react-native";

import Text from "./Text";
import TextInput from "./TextInput";
import { TextStyle, ViewStyle } from "./styles";
import { countryCode } from "./countryCode";
import type { CountryCode } from "./countryCode";
import type { ListRenderItemInfo } from "./types";
import withExtraText from "./withExtraText";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 19,
    paddingVertical: 8,
  },
  style: {
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    flex: 1,
  },
  searchbarContainer: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CACACA",
  },
  searchbar: {
    backgroundColor: "rgba(142, 142, 147, .12)",
    paddingHorizontal: 9,
    borderRadius: 10,
    height: 36,
  },
});

export type Props = {
  placeholder?: string,
  placeholderTextColor?: string,
  selectedValue?: string,

  style?: ViewStyle,
  textStyle?: TextStyle,
};

type State = {
  selectedValue: string | null,
  showPicker: boolean,
  countriesCode: CountryCode[],
};

const dropdownArrowIcon = require("../images/dropdown-arrow.png");

class CountryPicker extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue || null,
      showPicker: false,
      countriesCode: countryCode.sort((a, b) => {
        if (a.code == b.code) {
          return a.name > b.name ? 1 : -1;
        } else {
          return a.code > b.code ? 1 : -1;
        }
      }),
    };
  }

  openPicker = () => {
    this.setState({ showPicker: true });
  };

  onPressCountry = (item: CountryCode) => () => {
    this.setState({
      selectedValue: item.code,
      showPicker: false,
    });
  };

  search = (text: string) => {
    this.setState({
      countriesCode: countryCode
        .filter(
          item =>
            text ? item.name.includes(text) || item.code.includes(text) : true
        )
        .sort((a, b) => (a.code > b.code ? 1 : -1)),
    });
  };

  renderItem = ({ item }: ListRenderItemInfo<CountryCode>) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={this.onPressCountry(item)}
        style={defaultStyles.item}
      >
        <Text key={item.id}>{`${item.flag} ${item.name} +${item.code}`}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { placeholder, placeholderTextColor, style, textStyle } = this.props;
    const { selectedValue, showPicker, countriesCode } = this.state;
    return (
      <>
        <TouchableOpacity
          onPress={this.openPicker}
          style={[defaultStyles.style, style]}
        >
          <Text
            onFocus={this.openPicker}
            style={[
              defaultStyles.textStyle,
              textStyle,
              selectedValue ? null : { color: placeholderTextColor },
            ]}
          >
            {selectedValue ? `+${selectedValue}` : placeholder}
          </Text>
          <Image source={dropdownArrowIcon} />
        </TouchableOpacity>
        <Modal visible={showPicker} animationType="slide">
          <SafeAreaView style={defaultStyles.container}>
            <View style={defaultStyles.searchbarContainer}>
              <TextInput
                placeholder="Search"
                onChangeText={this.search}
                style={defaultStyles.searchbar}
                autoFocus={true}
              />
            </View>
            <FlatList
              data={countriesCode}
              extraData={this.state}
              renderItem={this.renderItem}
            />
          </SafeAreaView>
        </Modal>
      </>
    );
  }
}

export default withExtraText(CountryPicker);