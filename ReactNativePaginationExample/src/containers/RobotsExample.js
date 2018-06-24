/* @flow */
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import _ from 'lodash';

import { MockRobotsList } from '../mocks';
import Pagination, { Dot } from 'react-native-pagination';
const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 100;
export default class RobotsExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeId: null,
      activeItem: null,
      items: MockRobotsList
    };



  }

  getFlatListItems=()=> {
    this.setState({ isLoading: true });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTimeout(() => {
      this.setState({
        isLoading: false,
        items: MockRobotsList
      });
    }, 2000);
  }

  setItemAsActive(activeItem) {
    this.setState({ scrollToItemRef: activeItem });
    this.setState({
      activeId: activeItem.index,
      activeItem: activeItem.item
    });
  }
  renderItem = (o, i) => {
    return (
	<View
        style={{
          flex: 1,
          height,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
		<TouchableOpacity
          onPress={() => this.setItemAsActive(o)}
          style={[
            s.renderItem,
            this.state.activeId === _.get(o, 'item.id', false)
              ? { backgroundColor: '#01a699' }
              : { backgroundColor: '#ff5b5f' }
          ]}
        >
			<Image
            resizeMode="center"
            style={s.image}
            source={{
              uri: `https://robohash.org/${o.item.name}?size=350x350&set=set1`
            }}
          />
			<Text
            style={[
              s.name,
              this.state.activeId === o.item.id
                ? { color: '#01a699' }
                : { color: '#ff5b5f' }
            ]}
          >
				{o.item.name ? o.item.name : 'no name attrabute'}
			</Text>
		</TouchableOpacity>
	</View>
    );
  }

  clearList() {
    this.setState({ items: [] });
  }
  onEndReached(o) {
    console.log(' reached end: ', o);
  }

  onViewableItemsChanged = ({ viewableItems }) =>
    this.setState({ viewableItems });
  renderDot=(o, i) =>{
    const dotComponent = (
	<Animated.Image
        source={{
          uri: `https://robohash.org/${_.get(
            o,
            'item.name',
            'default'
          )}?size=350x350&set=set1`
        }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          width: o.isViewable ? 30 : 15,
          height: o.isViewable ? 30 : 15,
          opacity: o.isViewable ? 1 : 0.5,
          borderRadius: o.isViewable ? 15 : 7.5
        }}
      />
    );
    return (
	<Dot
        onPress={() => {
          try {
            this.refs.scrollToItem(o);
          } catch (e) {
            console.log(' e: ', e);
          }
        }}
        dotComponent={dotComponent}
        isViewable={o.isViewable}
        size={o.isViewable ? 20 : 15}
        textStyle={{ color: 'rgba(0,0,0,0.6)', fontSize: 8, width, margin: 5 }}
        text={_.get(o, 'item.name', '').split(' ')[0]}
        style={{
          margin: 1,
          marginBottom: 5,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    );
  }

  render() {
    const ListEmptyComponent = () => (
	<View
        style={{
          flex: 1,
          height,
          width,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
		<TouchableOpacity onPress={() => this.getFlatListItems()}>
			<Text
            style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: 20,
              textAlign: 'center',
              margin: 10
            }}
          >
            Nothing is Here!
			</Text>
			<Text
            style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: 15,
              textAlign: 'center'
            }}
          >
            Try Again?
			</Text>
		</TouchableOpacity>
	</View>
    );
    return (
	<View style={[s.container]}>
		<View style={s.innerContainer}>
			{!this.state.activeItem && (
			<View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}
            >
				<Text
                style={{
                  textAlignVertical: 'center',
                  color: 'rgba(0,0,0,.4)',
                  textAlign: 'center',
                  fontWeight: '400',
                  fontSize: 15
                }}
              >
                Make a Selection!
				</Text>
			</View>
          )}

			{this.state.activeItem && (
			<TouchableOpacity
              onPress={() => this.setItemAsActive(o)}
              style={[s.renderItem, s.activeItem]}
            >
				<Image
                resizeMode="center"
                style={s.image}
                source={{
                  uri: `https://robohash.org/r${_.get(
                    this.state.activeItem,
                    'name',
                    'default'
                  )}?size=350x350&set=set1`
                }}
              />
				<Text style={[s.name, { color: '#fff' }]}>
					{_.get(this.state.activeItem, 'name', 'No Default')}
				</Text>
			</TouchableOpacity>
          )}

			<TouchableOpacity
            onPress={() => this.clearList()}
            style={s.trashButton}
          >
				<Ionicons
              name={'ios-trash-outline'}
              size={25}
              color="rgba(0,0,0,0.5)"
            />
			</TouchableOpacity>
		</View>

		<View style={{flex: 1,height,width}}>
			<FlatList
            ListEmptyComponent={ListEmptyComponent}
            //  initialNumToRender={5}
            horizontal
            ref={r => (this.refs = r)}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index
            })}
            //onEndReached={this._onEndReached}
            onRefresh={o => alert('onRefresh:', o)}
            initialScrollIndex={0}
            refreshing={this.state.isLoading}
            onEndReached={o => this.onEndReached}
            keyExtractor={o => o.key.toString()}
            data={this.state.items}
            scrollRenderAheadDistance={width * 2}
            renderItem={this.renderItem}
            onViewableItemsChanged={this.onViewableItemsChanged}
          />
			<TouchableOpacity
            onPress={() => this.clearList()}
            style={{
              position: 'absolute',
              right: 35,
              top: 0,
              margin: 10,
              zIndex: 3,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
          >
				<Ionicons
              name={'ios-refresh-outline'}
              size={25}
              color="rgba(0,0,0,0.5)"
            />
			</TouchableOpacity>
			<TouchableOpacity
            onPress={() => this.clearList()}
            style={{
              position: 'absolute',
              backgroundColor: 'ff5b5f',
              right: 0,
              top: 0,
              margin: 10,
              zIndex: 3,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
          >
				<Ionicons
              name={'ios-trash-outline'}
              size={25}
              color="rgba(0,0,0,0.5)"
            />
			</TouchableOpacity>

			<Pagination
            horizontal
            // to allow React Native Pagination to scroll
            // (make sure list has "ref={r=>this.refs=r}")
            refs={this.refs}
            pagingEnabled
            // paginationContainerStyle={{paddingRight:40,paddingLeft:40}}
            //loadingComponent={loadingComponent}
            renderDot={this.renderDot}
            dotIconSizeActive={25}
            paginationVisibleItems={this.state.viewableItems} //needs to track what the user sees
            paginationItems={this.state.items} //pass the same list as data
            paginationItemPadSize={2} //num of items to pad above and bellow your visable items
          />
		</View>
	</View>
    );
  }
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  innerContainer: { flex: 1,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01a699' },
  text: {
    fontWeight: '600',
    fontSize: 100,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  renderItem: {
    width: ITEM_HEIGHT,
    borderColor: 'rgba(0,0,0,.3)',
    shadowColor: 'rgba(0,0,0,.3)',
    height: ITEM_HEIGHT,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 6,
    shadowOpacity: 0.8
  },
  activeItem: { borderColor: 'rgba(255,255,255,1)',
    backgroundColor: '#f5fcff',
    shadowColor: 'rgba(255,255,255,1)' },
  name: {
    position: 'absolute',
    bottom: -34,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    fontSize: 12,
    width: 100,
    textAlign: 'center',
    fontWeight: '600'
  },
  trashButton: { position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 10,
    zIndex: 3,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent' },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48
  }
});
