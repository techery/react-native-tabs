'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const iconStyle = (index, props) => {
  return index === props.children.length - 1
    ? props.lastIconStyle
    : props.iconStyle;
};

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.children = {};
    this.selected = null;
    this.state = {};
  }

  onSelect(el) {
    this.setState(this.children);
    var func = el.props.onSelect || this.props.onSelect;
    var props = { selected: true };
    if (func) {
      props = Object.assign({}, props, func(el) || {});
    }
    props = Object.assign({}, props, el.props);
    var map = {};
    map[el.props.name] = props;
    map[el.props.name].key = el.props.name;
    this.setState(map);
  }

  _updateState(props){
    var selected = null;

    React.Children.forEach(props.children, (el) => {
      // choose first by default
      if (!selected && !props.noFirstSelect) {
        selected = el;
      }
      this.children[el.props.name] = Object.assign({}, el.props);
      this.children[el.props.name].key = el.props.name;
      if (props.selected === el.props.name) {
        selected = el;
      }
    });

    this.setState(this.children);
    if (!this.selected) {
      this.onSelect(selected);
    }
    this.selected = selected;
  }

  componentDidMount() {
    this._updateState(this.props);
  }

  render() {
    const opacity = this.props.activeOpacity == null
      ? 0.2
      : this.props.activeOpacity;

    return (
      <View style={[styles.tabbarView, this.props.style]}>
        {this.props.children.map((el, index) => (
          <TouchableOpacity
            activeOpacity={opacity}
            key={el.props.name + 'touch'}
            onPress={() => this.onSelect(el)}
            style={[styles.iconView, iconStyle(index, this.props)]}
            >
            {React.cloneElement(el, this.state[el.props.name])}
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  iconView: {
    alignItems: 'center',
    flex: 1,
  },
  tabbarView: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    bottom: 0,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    left: 0,
    opacity: 1,
    position: 'absolute',
    right: 0,
  },
});

module.exports = Tabs;
