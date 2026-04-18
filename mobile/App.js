import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ModuleScreen from './src/screens/ModuleScreen';
import TopicScreen from './src/screens/TopicScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Baza Wiedzy' }} />
        <Stack.Screen name="Module" component={ModuleScreen} options={{ title: 'Moduł' }} />
        <Stack.Screen name="Topic" component={TopicScreen} options={{ title: 'Temat' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
