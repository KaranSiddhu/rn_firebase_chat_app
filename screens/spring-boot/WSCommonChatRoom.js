import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Client } from '@stomp/stompjs';
import { auth } from '../../firebase';

const WSCommonChatRoom = () => {
	const [messages, setMessages] = useState([]);

	let stompClient = new Client({
		connectHeaders: {},
		brokerURL: 'ws://127.0.0.1:8080/ws',
		debug: function (str) {
			console.log('STOMP: ' + str);
		},
		reconnectDelay: 200,
		forceBinaryWSFrames: true,
		appendMissingNULLonIncoming: true,
		onConnect: function (frame) {
			console.log('websocket connected');
			stompClient.subscribe('/chatroom/public', function (message) {
                // This will run when user sends a messages
				const payloadData = JSON.parse(message.body);
				setMessages(prevMsg => [
					{
						_id: payloadData.messageId,
						createdAt: payloadData.date,
						text: payloadData.message,
						user: {
							_id: payloadData.senderId,
							name: payloadData.senderName
						}
					},
					...prevMsg
				]);
			});
		},
		onStompError: frame => {
			console.log('Additional details: ' + frame.body);
		}
	});

	useEffect(() => {
		stompClient.activate();
	}, []);

	const sendValue = useCallback(msg => {
		if (stompClient) {
			const { _id, createdAt, text, user } = msg[0];

			var chatMessage = {
				messageId: _id,
				senderName: user.name,
				senderId: user._id,
				message: text,
				status: 'MESSAGE',
				date: createdAt
			};

			stompClient.publish({
				destination: '/app/message',
				body: JSON.stringify(chatMessage)
			});
		}
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<GiftedChat
				messages={messages}
				onSend={sendValue}
				user={{
					_id: auth.currentUser?.uid,
					name: auth.currentUser?.displayName
				}}
				renderUsernameOnMessage
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default WSCommonChatRoom;
