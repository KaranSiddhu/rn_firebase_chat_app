import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Avatar, Button, Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
	const [usersData, setUsersData] = useState([]);
	const [oldMessageInfo, setOldMessageInfo] = useState([]);

	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<View style={{ marginLeft: 10 }}>
					<Avatar rounded source={{ uri: auth.currentUser?.photoURL }} />
				</View>
			),
			headerRight: () => (
				<TouchableOpacity onPress={signout} style={{ marginRight: 20 }}>
					<MaterialIcons name="logout" size={24} color="black" />
				</TouchableOpacity>
			)
		});
	}, []);

	useEffect(() => {
		// db.collectionGroup('messages')
		// 	.get()
		// 	.then(d => {
		// 		console.log('d - ', d.docs[0].data()._id);
		// 	});

		// db.getDocs()

		// db.collection('personalchat')
		// 	.get()
		// 	.then(data => console.log('d - ', data.collection));

		// db.collectionGroup('messages')
		// 	.getCollections()
		// 	.then(querySnapshot => {
		// 		querySnapshot.forEach(collection => {
		// 			console.log('collection: ' + collection.id);
		// 		});
		// 	});

		const getOlderChatUser = async () => {
			const query = await db.collection('personalchat').get();
			query.forEach(doc => {
				let chatRoomId = doc.data().chatRoomId;

				if (chatRoomId.split('-').includes(auth.currentUser?.uid)) {
					const id = chatRoomId.split('-').find(ele => ele !== auth.currentUser?.uid);
					console.log(id);
					db.collection('users')
						.where('_id', '==', id)
						.onSnapshot(snap => {
							console.log(snap.docs.length);
							// return setOldMessageInfo(
							// 	snap.docs.map(doc => ({
							// 		...doc.data()
							// 	}))
							// );
						});
				}
			});
		};

		// getOlderChatUser();
	}, []);

	useEffect(() => {
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

	const signout = () => {
		auth
			.signOut()
			.then(() => {
				console.log('Sign-out successful');
				navigation.navigate('LogInScreens');
			})
			.catch(error => {
				console.log('err - ', error);
			});
	};

	return (
		<ScrollView>
			<View style={{ alignItems: 'center' }}>
				<Text style={{ fontSize: 25 }}>Hello {auth.currentUser?.displayName}</Text>
				<Button
					title="Common Chat room"
					onPress={() => navigation.navigate('WSCommonChatRoom')}
					buttonStyle={{ width: 200, marginTop: 20 }}
				/>

				{/* <Text style={{ fontSize: 25 }}>Older chats</Text>
				{oldMessageInfo.length ? (
					<>
						{oldMessageInfo.map((data, i) => {
							return (
								<Card key={i}>
									<TouchableOpacity
										style={{ flexDirection: 'row', alignItems: 'center' }}
										onPress={() => navigation.navigate('PersonalChatScreen', { userInfo: data })}
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
					</>
				) : (
					<Text style={{ fontSize: 20, textAlign: 'center', padding: 10 }}>
						you dont have any old chat. Select the user from below to chat
					</Text>
				)} */}

				<Text style={{ fontSize: 25, marginVertical: 20 }}>Chat with different user. </Text>
				{usersData.map((data, i) => {
					return (
						<Card key={i} containerStyle={{ width: '80%' }}>
							<TouchableOpacity
								style={{ flexDirection: 'row', alignItems: 'center' }}
								onPress={() => navigation.navigate('PersonalChatScreen', { userInfo: data })}
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
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({});

export default HomeScreen;
