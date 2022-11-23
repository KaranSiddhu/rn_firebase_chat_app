import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { Avatar, Button, Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
	const [usersData, setUsersData] = useState([]);

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
		db.collection('users').onSnapshot(snap =>
			setUsersData(
				snap.docs.map(doc => ({
					...doc.data()
				}))
			)
		);
	}, []);

	console.log('iu- ', usersData);
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
					onPress={() => navigation.navigate('ChatScreen')}
					buttonStyle={{ width: 200, marginTop: 20 }}
				/>
				<Text style={{ fontSize: 25, marginVertical: 20 }}>Chat with different user</Text>

				{usersData.map((data, i) => {
					if (data._id === auth?.currentUser?.uid) {
						return; // skip
					}
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
