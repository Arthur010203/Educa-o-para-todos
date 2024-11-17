import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, FlatList,TouchableOpacity  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';
import Video from 'react-native-video';

// Tela de Cadastro
function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Lógica para registrar o usuário (com Firebase ou outro backend)
    Alert.alert('Cadastro realizado', `Bem-vindo, ${name}!`);
    navigation.navigate('Login'); // Redireciona para a tela de login após o cadastro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastre-se</Text>
      <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

// Tela de Login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      Alert.alert('Login realizado', `Bem-vindo, ${email}!`);
      navigation.navigate('ContentLibrary'); // Navega para a biblioteca de conteúdo após o login
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./Imagens/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Educação para Todos</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar-se" onPress={() => navigation.navigate('Register')} color="#6A5ACD" />
    </View>
  );
}

// Tela da Biblioteca de Conteúdo (Substituindo a tela Home)
function ContentLibraryScreen({ navigation }) {
  const [audio, setAudio] = useState(null);

  const contentData = [
    { id: '1', title: 'Introdução à Matemática', type: 'text', content: 'Este é um texto educativo sobre a introdução à matemática...' },
    { id: '2', title: 'Aula de Ciências: A Terra', type: 'video', content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: '3', title: 'Áudio: Como estudar melhor', type: 'audio', content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  ];

  const playAudio = async (url) => {
    const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    setAudio(sound);
  };

  const renderContentItem = ({ item }) => {
    if (item.type === 'text') {
      return (
        <TouchableOpacity style={styles.card}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text style={styles.contentText}>{item.content}</Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'video') {
      return (
        <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Vídeo', `Abra o link para assistir: ${item.content}`)}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text>Toque para assistir ao vídeo</Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'audio') {
      return (
        <TouchableOpacity style={styles.card} onPress={() => playAudio(item.content)}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text>Toque para ouvir o áudio</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Conteúdo</Text>
      <FlatList data={contentData} renderItem={renderContentItem} keyExtractor={(item) => item.id} />
      {audio && (
        <View style={styles.audioPlayer}>
          <Button title="Parar Áudio" onPress={() => audio.stopAsync()} />
        </View>
      )}
    </View>
  );
}

// Navegação entre as telas
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ContentLibrary" component={ContentLibraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  audioPlayer: {
    marginTop: 16,
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 8,
  },
});
