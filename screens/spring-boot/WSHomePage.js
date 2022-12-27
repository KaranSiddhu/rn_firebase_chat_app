import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
// import WebSocketClient from '../../WebSocketClient';
import { auth, db } from '../../firebase';
import { Avatar, Button, Card } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import Modal from 'react-native-modal';

const WSHomePage = ({ navigation }) => {
	const [usersData, setUsersData] = useState([]);
	const [selectedUserData, setSelectedUserData] = useState();

	const [isReceivedMessageModalVisible, setIsReceivedMessageModalVisible] = useState(false);
	const [message, setMessage] = useState();

	const [isSendMessgaeModalVisible, setIsSendMessgaeModalVisible] = useState(false);

	// http://enjrhappcds01dev.cswg.com/
	// brokerURL: 'ws://enjrhappcds01dev.cswg.com/ws',
	// brokerURL: 'ws://127.0.0.1:8080/ws',

	let stompClient = new Client({
		connectHeaders: {},
		brokerURL: 'ws://enjrhappcds01dev.cswg.com:8080/ws',
		debug: function (str) {
			console.log('STOMP: ' + str);
		},
		reconnectDelay: 200,
		forceBinaryWSFrames: true,
		appendMissingNULLonIncoming: true,
		onConnect: function (frame) {
			console.log('websocket connected');

			stompClient.subscribe('/user/' + auth.currentUser?.uid + '/private', function (message) {
				// This will run when user sends a messages
				const payloadData = JSON.parse(message.body);
				console.log('hi from ', auth.currentUser.displayName, ' - ', auth.currentUser.uid, ' - ', payloadData);
				if (payloadData.receiverId === auth.currentUser.uid) {
					setMessage(payloadData);
					setIsReceivedMessageModalVisible(true);
				}
			});
		},
		onStompError: frame => {
			console.log('Additional details: ' + frame.body);
		}
	});

	useEffect(() => {
		stompClient.activate();

		db.collection('users')
			.where('_id', '!=', auth.currentUser.uid)
			.onSnapshot(snap => {
				return setUsersData(
					snap.docs.map(doc => ({
						...doc.data()
					}))
				);
			});
	}, []);

	const onSend = useCallback((selectedUser, message) => {
		console.log('🚀 ~ onSend ~ message', message);
		console.log('🚀 ~ onSend ~ selectedUser', selectedUser);
		if (stompClient) {
			let chatMessage = {
				// senderName: auth.currentUser?.displayName,
				// senderId: auth.currentUser?.uid,
				message: message,
				status: 'MESSAGE',
				// receiverName: selectedUser.displayName,
				receiverId: selectedUser._id,
				date: new Date()
			};
			console.log('🚀 ~ onSend ~ chatMessage', chatMessage);

			stompClient.publish({
				destination: '/app/private-message',
				body: JSON.stringify(chatMessage),
				headers: { 'Content-Type': 'application/json' }
			});

			setIsSendMessgaeModalVisible(false);
			setMessage('');
		}
	}, []);

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{
				alignItems: 'center'
			}}
		>
			{isReceivedMessageModalVisible && (
				<Modal isVisible={isReceivedMessageModalVisible}>
					<View style={{ padding: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
						<Text>From: {message.senderName}</Text>
						<Text>Message: {message.message}</Text>
						<Button title="close modal" onPress={() => setIsReceivedMessageModalVisible(false)} />
					</View>
				</Modal>
			)}

			{isSendMessgaeModalVisible && (
				<Modal isVisible={isSendMessgaeModalVisible}>
					<View style={{ padding: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ margin: 10, fontSize: 20 }}>Send message to {selectedUserData.displayName}</Text>
						<TextInput
							style={{ margin: 20, borderColor: 'red', borderWidth: 2, width: '100%', padding: 20 }}
							value={message}
							onChangeText={val => setMessage(val)}
							placeholder="message..."
						/>
						<Button title="Send Message" onPress={() => onSend(selectedUserData, message)} />
					</View>
				</Modal>
			)}
			<Text style={{ fontSize: 25 }}>Hey {auth.currentUser?.displayName}</Text>
			<Button
				title="Common Chat room"
				onPress={() => navigation.navigate('WSCommonChatRoom')}
				buttonStyle={{ width: 200, marginTop: 20 }}
			/>

			<Text style={{ fontSize: 25, marginVertical: 20 }}>Chat with different user. </Text>
			{usersData.map((data, i) => {
				return (
					<Card key={i} containerStyle={{ width: '80%' }}>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => {
								// navigation.navigate('WsPersonalChatRoom', { userInfo: data })
								setSelectedUserData(data);
								setIsSendMessgaeModalVisible(true);
							}}
						>
							<Avatar rounded source={{ uri: data.photoURL }} />

							<View>
								<Text style={{ fontSize: 20 }}>{data.displayName}</Text>
								<Text style={{ fontSize: 20 }}>{data.email}</Text>
							</View>
						</TouchableOpacity>
					</Card>
				);
			})}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	textInput: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		width: '50%'
	}
});

export default WSHomePage;
