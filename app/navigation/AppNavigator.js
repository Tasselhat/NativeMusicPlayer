import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AudioList from '../screens/AudioList'
import Player from '../screens/Player'
import Playlist from '../screens/Playlist'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  return (
		<Tab.Navigator>
			<Tab.Screen name="AudioList" component={AudioList} />
			<Tab.Screen name="Player" component={Player} />
			<Tab.Screen name="Playlist" component={Playlist} />
		</Tab.Navigator>
  )
}

export default AppNavigator
