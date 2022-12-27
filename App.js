import 'react-native-gesture-handler';
import * as encoding from 'text-encoding';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogInScreens from './screens/LogInScreens';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import PersonalChatScreen from './screens/PersonalChatScreen';
import WSHomePage from './screens/spring-boot/WSHomePage';
import WSCommonChatRoom from './screens/spring-boot/WSCommonChatRoom';
import WsPersonalChatRoom from './screens/spring-boot/WsPersonalChatRoom';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="LogInScreens" component={LogInScreens} />
				<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
				{/* <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
				{/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
				{/* <Stack.Screen name="PersonalChatScreen" component={PersonalChatScreen} /> */}
				<Stack.Screen name="WSHomePage" component={WSHomePage} />
				<Stack.Screen name="WSCommonChatRoom" component={WSCommonChatRoom} />
				<Stack.Screen name="WsPersonalChatRoom" component={WsPersonalChatRoom} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
