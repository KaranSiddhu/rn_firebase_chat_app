import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth, db } from '../firebase';

const PersonalChatScreen = ({ route }) => {
	const selectedUserInfo = route.params.userInfo;

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const docId =
			selectedUserInfo._id > auth?.currentUser?.uid
				? auth?.currentUser?.uid + '-' + selectedUserInfo._id
				: selectedUserInfo._id + '-' + auth?.currentUser?.uid;

		db.collection(`personalchat`)
			.doc(docId)
			.collection('messages')
			.orderBy('createdAt', 'desc')
			.onSnapshot(snap =>
				setMessages(
					snap.docs.map(doc => ({
						_id: doc.data()._id,
						createdAt: doc.data().createdAt.toDate(),
						text: doc.data().text,
						user: doc.data().user,
						sentTo: doc.data().sentTo
					}))
				)
			);
	}, []);

	const onSend = useCallback((messages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

		const { _id, createdAt, text, user } = messages[0];

		const docId =
			selectedUserInfo._id > auth?.currentUser?.uid
				? auth?.currentUser?.uid + '-' + selectedUserInfo._id
				: selectedUserInfo._id + '-' + auth?.currentUser?.uid;

		db.collection(`personalchat`).doc(docId).collection('messages').add({
			_id,
			createdAt,
			text,
			sentTo: selectedUserInfo,
			user
		});
		// db.collection(`personalchat`).doc(docId).set({
		// 	chatRoomId: docId
		// });
	}, []);

	return (
		<GiftedChat
			messages={messages}
			onSend={messages => onSend(messages)}
			showAvatarForEveryMessage={true}
			user={{
				_id: auth?.currentUser?.uid,
				name: auth?.currentUser?.displayName,
				avatar: auth?.currentUser?.photoURL
			}}
			renderUsernameOnMessage={true}
		/>
	);
};

const styles = StyleSheet.create({});

export default PersonalChatScreen;
