import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = ({ navigation }) => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		db.collection('chats')
			.orderBy('createdAt', 'desc')
			.onSnapshot(snap =>
				setMessages(
					snap.docs.map(doc => ({
						_id: doc.data()._id,
						createdAt: doc.data().createdAt.toDate(),
						text: doc.data().text,
						user: doc.data().user
					}))
				)
			);
	}, []);

	const onSend = useCallback((messages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

		const { _id, createdAt, text, user } = messages[0];
		db.collection('chats').add({
			_id,
			createdAt,
			text,
			user
		});
	}, []);

	return (
		<GiftedChat
			messages={messages}
			onSend={messages => onSend(messages)}
			showAvatarForEveryMessage={true}
			user={{
				_id: auth?.currentUser?.email,
				name: auth?.currentUser?.displayName,
				avatar: auth?.currentUser?.photoURL
			}}
			renderUsernameOnMessage={true}
		/>
	);
};

const styles = StyleSheet.create({});

export default ChatScreen;
