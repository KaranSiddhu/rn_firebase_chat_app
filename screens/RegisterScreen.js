import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { auth, db } from '../firebase';

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const register = async () => {
		try {
			const { user } = await auth.createUserWithEmailAndPassword(email, password);

			await user.updateProfile({
				displayName: name,
				photoURL:
					'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
			});

			db.collection('users').doc(user.uid).set({
				email: user.email,
				_id: user.uid,
				displayName: name,
				photoURL:
					'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
			});

			navigation.replace('WSHomePage');
		} catch (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log('err -', errorCode, ' - ', errorMessage);
			Alert.alert(errorMessage);
		}

	};

	return (
		<View style={styles.container}>
			<Input
				placeholder="Enter your Name"
				label="Name"
				leftIcon={{ type: 'material', name: 'badge' }}
				value={name}
				onChangeText={text => setName(text)}
			/>

			<Input
				placeholder="Enter your Email"
				label="Email"
				leftIcon={{ type: 'material', name: 'email' }}
				value={email}
				onChangeText={text => setEmail(text)}
			/>

			<Input
				placeholder="Enter your Password"
				label="Password"
				leftIcon={{ type: 'material', name: 'lock' }}
				value={password}
				onChangeText={text => setPassword(text)}
				secureTextEntry
			/>

			<Button title="Register" buttonStyle={styles.button} onPress={register} />
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 200,
		marginTop: 10
	},
	container: { alignItems: 'center', flex: 1, padding: 10 }
});

export default RegisterScreen;
