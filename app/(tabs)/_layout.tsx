import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, useRouter } from 'expo-router';
import { Button, Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import { i18n } from '../../lib/i18n/i18n';
import Register from './register';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        title: i18n.t('birthdayList.title'),
        headerRight: () => (
          <Link href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="bars"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="register"
        // options={{
        //   title: i18n.t('register.add'),
        //   headerRight: () => (
        //     <Button title={i18n.t('register.save')} onPress={onSaveButtonPress}></Button>
        //   ),
        // }}
      />
    </Stack>
  );
}
