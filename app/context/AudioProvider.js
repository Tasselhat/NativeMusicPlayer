import * as MediaLibrary from 'expo-media-library'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class AudioProvider extends Component {

	// {"canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}

	constructor(props) {
		super(props)
	}

	getPermission = async () => {
		const permission = await MediaLibrary.getPermissionsAsync()
		console.log(permission)
		if (permission.granted) {
			return true
		}
		if (permission.canAskAgain) {
			const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()
			if (status === 'denied' && canAskAgain) {
				// display alert that user must allow permissions
			}
			if (status === 'granted') {
				return true
			}
			if (status === 'denied' && !canAskAgain) {
				// display alert that user must allow permissions
			}
		}
		if (!permission.canAskAgain) {
			// display alert that user must allow permissions
		}
	}

	componentDidMount() {
		this.getPermission()
	}

	render() {
		return (
	  		<View>
				<Text>AudioProvider</Text>
	  		</View>
		)
  	}
}

export default AudioProvider