import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Client } from '@stomp/stompjs';
import { auth } from '../../firebase';
import axios from 'axios';

const WsPersonalChatRoom = ({ route }) => {
	const selectedUserInfo = route.params.userInfo;
	// const stompClient = route.params.stompClient;
	const [messages, setMessages] = useState([]);

	let stompClient = new Client({
		connectHeaders: {
			token: 'ihdiuwacguiahckuashiuchiaskcba'
		},
		brokerURL: 'ws://127.0.0.1:8080/ws',
		debug: function (str) {
			console.log('STOMP: ' + str);
		},
		reconnectDelay: 200,
		forceBinaryWSFrames: true,
		appendMissingNULLonIncoming: true,
		onConnect: function (frame) {
			console.log('websocket connected');

			stompClient.subscribe('/user/' + auth.currentUser?.uid + '/', function (message) {
				// This will run when user sends a messages
				const payloadData = JSON.parse(message.body);

				setMessages(previousMessages =>
					GiftedChat.append(previousMessages, {
						_id: payloadData.messageId,
						createdAt: payloadData.date,
						text: payloadData.message,
						user: {
							_id: payloadData.senderId,
							name: payloadData.senderName
						},
						sentTo: {
							_id: payloadData.receiverId,
							name: payloadData.receiverName
						}
					})
				);
			});
		},
		onStompError: frame => {
			console.log('Additional details: ' + frame.body);
		}
	});

	useEffect(() => {
		stompClient.activate();

		// const getMsg = async () => {
		// 	const chatRoomId =
		// 		selectedUserInfo._id > auth?.currentUser?.uid
		// 			? auth?.currentUser?.uid + '-' + selectedUserInfo._id
		// 			: selectedUserInfo._id + '-' + auth?.currentUser?.uid;

		// 	const { data } = await axios.get(`http://localhost:8080/msg/${chatRoomId}`);
		// 	setMessages(
		// 		data.map(doc => ({
		// 			_id: doc.messageId,
		// 			createdAt: doc.date,
		// 			text: doc.message,
		// 			user: {
		// 				_id: doc.senderId,
		// 				name: doc.senderName
		// 			},
		// 			sentTo: {
		// 				_id: doc.receiverId,
		// 				name: doc.receiverName
		// 			}
		// 		}))
		// 	);
		// };

		// getMsg();
	}, []);

	const onSend = useCallback(msg => {
		if (stompClient) {
			const { _id, createdAt, text, user } = msg[0];
			setMessages(previousMessages =>
				GiftedChat.append(previousMessages, {
					_id,
					createdAt,
					text,
					user: {
						_id: user._id,
						name: user.name
					},
					sentTo: {
						_id: selectedUserInfo._id,
						name: selectedUserInfo.displayName
					}
				})
			);

			// const chatRoomId =
			// 	selectedUserInfo._id > auth?.currentUser?.uid
			// 		? auth?.currentUser?.uid + '-' + selectedUserInfo._id
			// 		: selectedUserInfo._id + '-' + auth?.currentUser?.uid;

			let chatMessage = {
				// chatRoomId,
				messageId: _id,
				senderName: user.name,
				senderId: user._id,
				message: text,
				status: 'MESSAGE',
				date: createdAt,
				receiverName: selectedUserInfo.displayName,
				receiverId: selectedUserInfo._id
			};

			stompClient.publish({
				destination: '/app/private-message',
				body: JSON.stringify(chatMessage),
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<GiftedChat
				messages={messages}
				onSend={messages => onSend(messages)}
				user={{
					_id: auth?.currentUser?.uid,
					name: auth?.currentUser?.displayName
				}}
				renderUsernameOnMessage
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default WsPersonalChatRoom;
