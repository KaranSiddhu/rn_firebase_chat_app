import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { auth } from '../firebase';

const LogInScreens = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				var uid = user.uid;
				console.log('here');
				// navigation.navigate('HomeScreen');
			} else {
				console.log('signout');
				navigation.canGoBack() && navigation.popToTop();
			}
		});
	}, []);

	const signin = () => {
		auth
			.signInWithEmailAndPassword(email, password)
			.then(userCredential => {
				// Signed in
				navigation.replace('HomeScreen');

				// ...
			})
			.catch(error => {
				var errorCode = error.code;
				var errorMessage = error.message;
				Alert.alert(errorMessage);
			});
	};

	return (
		<View style={styles.container}>
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

			<Button title="Sign In" buttonStyle={styles.button} onPress={signin} />
			<Button title="Register" buttonStyle={styles.button} onPress={() => navigation.navigate('RegisterScreen')} />
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

export default LogInScreens;
