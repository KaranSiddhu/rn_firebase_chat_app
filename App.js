import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogInScreens from './screens/LogInScreens';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import PersonalChatScreen from './screens/PersonalChatScreen';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="LogInScreens" component={LogInScreens} />
				<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
				<Stack.Screen name="ChatScreen" component={ChatScreen} />
				<Stack.Screen name="HomeScreen" component={HomeScreen} />
				<Stack.Screen name="PersonalChatScreen" component={PersonalChatScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
