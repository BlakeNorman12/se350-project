import * as React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {

  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  Image,
  Touchable,
  



} from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const Stack = createNativeStackNavigator();
  //Button Counters
  const [surveyCounter, setSurveyCounter] = React.useState(0);
  const [feedCounter, setFeedCounter] = React.useState(0);
  const [postCounter, setPostCounter] = React.useState(0);
  const [profileCounter, setProfileCounter] = React.useState(0);
  
  const [user, setUser] = React.useState(null);

  const postUser = global.postUser
  const postSubject = global.postSubject
  const postBody = global.postBody
  

  /*
  const useFunctionEvery30Seconds = () => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCount(count => count + 1);
      }, 10000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    const every30Seconds = () => {
      console.log(count)
      insertClick()
    };
  
    return every30Seconds;
  };

  const every30Seconds = useFunctionEvery30Seconds();

  useEffect(() => {
    const intervalId = setInterval(() => {
      every30Seconds();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [every30Seconds]);
 
  */
async function getData(charstr)
{

  console.log("Working...")
  var SearchAPIURL="http://10.0.2.2:80/api/getdata.php";
  var header={
    'Accept':'application/json',
    'Content-Type':'application/json'
  };

  var Data={
    FindCharacter:charstr 
  };

  await fetch(
    SearchAPIURL,
    {
      method:'POST',
      headers:header,
      body: JSON.stringify(Data)
    }
  )
  .then((response)=> response.json(Data))
  .then((response)=> 
  {

    global.Subject = response[0].Subject
    global.Body = response[0].Body
  })
  
};

const insertPost=()=> 
{
  var PostUser=global.postUser;
  var PostSubject=global.postSubject;
  var PostBody=global.postBody;

  var InsertAPIURL="http://10.0.2.2:80/api/postdata.php";
  var headers={
        'Accept':'application/json',
        'Content-Type':'application/json'
  };

  var Data={
    PostUser:PostUser,
    PostSubject:PostSubject,
    PostBody:PostBody,
  };

  fetch(InsertAPIURL,
    {
        method: 'POST',
        headers:headers,
        body: JSON.stringify(Data)
    }  
    )
  console.log("Post submitted to Database.")
}

function insertData(username, password) {
  var Username=(username);
  var Password=(password);

  var InsertAPIURL="http://10.0.2.2:80/api/signup.php";
  var headers={
        'Accept':'application/json',
        'Content-Type':'application/json'
  };

  var Data={
    Username:Username,
    Password:Password,
  };

  fetch(InsertAPIURL,
    {
        method: 'POST',
        headers:headers,
        body: JSON.stringify(Data)
    }  
    )
  console.log("User info submitted to Database.")
}

/*
function verifyData(username, password) {

  var InsertAPIURL="http://10.0.2.2:80/api/verifylogin.php";
  var headers = {
    'Accept':'application/json',
    'Content-Type':'application/json'
  };

  var Data = {
    Username: username,
    Password: password,
  };

  fetch(InsertAPIURL,
    {
      method: 'POST',
      headers:headers,
      body: JSON.stringify(Data)
    }
    )
  .then((response) => response.text())
  .then((responseJson) => {
    if (responseJson === 'success'){
      navigation.navigate("Home")
    } else {
      Alert.alert("Incorrect Username or Password. Please try again.")
    }
  })
}
*/


const insertClick=()=>
  {
    var SurveyClicks=surveyCounter;
    var FeedClicks=feedCounter;
    var PostClicks=postCounter;
    var ProfileClicks=profileCounter;

    var InsertAPIURL="http://10.0.2.2:80/api/clicks.php";
    var headers={
        'Accept':'application/json',
        'Content-Type':'application/json'
    };

    var Data={
        SurveyClicks:SurveyClicks,
        FeedClicks:FeedClicks,
        PostClicks:PostClicks,
        ProfileClicks:ProfileClicks
    };

    fetch(InsertAPIURL,
      {
        method: 'POST',
        headers:headers,
        body: JSON.stringify(Data)
      }  
      )
    
      console.log("Click values sent to Database.")
      /*
      .then((response)=>response.json())
      .then((response)=>
      {
        alert(response[0].Message);
      })
      .catch((error)=>
      {
        alert("prob"+error);
      })
      */
      
      
    }

    /*const handleAppStateChange = (appState) => {
      if (appState === 'background') {
        insertClick();
      } else if (appState === 'inactive') {
        console.log('App is inactive!');
      }
    };
  
    useEffect(() => {
      AppState.addEventListener('change', handleAppStateChange);
  
      return () => {
        AppState.removeEventListener('change', handleAppStateChange);
      };
    }, []);*/
  
function MyStack () {
  
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{
              headerShown: false}}/>
            <Stack.Screen name="Home" component={Root} />
            <Stack.Screen name="Survey" component={SurveyScreen} />
            <Stack.Screen name="Peter" component={PeterScreen} />
            <Stack.Screen name="Homer" component={HomerScreen} />
            <Stack.Screen name="Roger" component={RogerScreen} />
            <Stack.Screen name="Stewie" component={StewieScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Password Recovery" component={ForgotScreen} />
          </Stack.Navigator>
       </NavigationContainer>
      )}

    

  const getPost = async () => {

    const values = await AsyncStorage.multiGet(['@surveyCount', '@greeting', '@postCount', '@feedCount', '@profileCount']);

    values.forEach(value => {
      if (value[0] === '@surveyCount') {
        const surveyCount = parseInt(value[1]);
        setSurveyCounter(isNaN(surveyCount) ? 0 : surveyCount);
      } else if (value[1] === '@greeting') {
        setGreeting(JSON.parse(value[1]));
      } else if (value[2] === '@feedCount') {
        const postCount = parseInt(value[1]);
        setPostCounter(isNaN(postCount) ? 0 : postCount);
      } else if (value[3] === '@feedCount') {
        const feedCount = parseInt(value[1]);
        setFeedCounter(isNaN(feedCount) ? 0 : feedCount);
      } else if (value[4] === '@profileCount') {
        const profileCount = parseInt(value[1]);
        setProfileCounter(isNaN(profileCount) ? 0 : profileCount);
  }});

    console.log(values)
    return(
      values
    )
  };

  const setData = async () => {
    const surveyPair = ["@surveyCount", "0"]
    const feedPair = ["@feedCount", "0"]
    const postPair = ["@postCount", "0"]
    const profilePair = ["@profileCount", "0"]

    await AsyncStorage.multiSet([surveyPair, feedPair, postPair, profilePair])


  console.log("Storage init 0.")
  }

  //Button Incrementations
  const incrementSurvey = async () => {
    await AsyncStorage.setItem('@surveyCount', (surveyCounter + 1).toString());
    setSurveyCounter(surveyCounter + 1);
  }

  const incrementFeed = async () => {
    await AsyncStorage.setItem('@feedCount', (feedCounter + 1).toString());
    setFeedCounter(feedCounter + 1);
  }

  const incrementClips = async () => {
    await AsyncStorage.setItem('@postCount', (postCounter + 1).toString());
    setPostCounter(postCounter + 1);
  }

  const incrementProfile = async () => {
    await AsyncStorage.setItem('@profileCount', (profileCounter + 1).toString());
    setProfileCounter(profileCounter + 1);
  }
  
  //User info functions
  const storeUserData = async (user) => {
    await AsyncStorage.setItem('@userData', user)
  }

  const fetchUserData = async (user) => {
    setUser (await AsyncStorage.getItem('@userData'))
  }

  /*Navigable Screens
  const LoginScreen = () => {
    return (
      Login() //this is normally Login(), but switched to Root to ignore logging in every time during testing
    );
  };
  */
  

  const HomeScreen = ({navigation}) => {
    

    const [postUser, setPostUser] = useState("")
    const [postSubject, setPostSubject] = useState("")
    const [postBody, setPostBody] = useState("")

    return (
      <View style = {styles.container}>
        <View style = {styles.buttonContainer}>
          <Button
            style={styles.button}
            title="Survey"
            onPress = { () => {navigation.navigate('Survey'); incrementSurvey();setUser(true)}}/>
            </View>
            <View style = {styles.buttonContainer}>
          <Button
          style={styles.button}
          title="Send clicks to DB"
          onPress={insertClick}/>
          </View>
          <View>
            <TextInput
              style = {styles.input}
              placeholder={"Username"}
              placeholderTextColor={"#000000"}
              onChangeText={newText => global.postUser = newText}
              />
            <TextInput
              style = {styles.input}
              placeholder={"Subject"}
              placeholderTextColor={"#000000"}
              onChangeText={newText => global.postSubject = newText}
              />
            <TextInput
              style = {styles.bodyInput}
              placeholder={"Body"}
              placeholderTextColor={"#000000"}
              onChangeText={newText => global.postBody = newText}
              />
            <Button
              style={styles.button}
              title="Post"
              onPress={ () => {insertPost()}}
            />
          </View>
        <View style = {styles.container}>
          <Text>{user}</Text>
        </View>
      </View>
    );
  };

  const PeterScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.peterGuy}
          source={require('./assets/Peter_Griffin.png')}
        />
        
        <Text>{global.Subject}</Text>
        <Text>{global.Body}</Text>
      </View>
    );
  };

  const HomerScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.peterGuy}
          source={require('./assets/HomerSimpson.png')}
        />
        <Text>{global.Subject}</Text>
        <Text>{global.Body}</Text>
      </View>
    );
  };

  const RogerScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.peterGuy}
          source={require('./assets/Roger_Smith.png')}
        />
        <Text>{global.Subject}</Text>
        <Text>{global.Body}</Text>
      </View>
    );
  };

  const StewieScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.peterGuy}
          source={require('./assets/StewieG.png')}
        />
        <Text>{global.Subject}</Text>
        <Text>{global.Body}</Text>
      </View>
    );
  };

  const SignupScreen = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
      <>
      <View style={styles.signup}>
        <Image source={require("./assets/ChirpLOGO.png")} style={styles.logo}/>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="#000"
            onChangeText={(username) => setUsername(username)} />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#000"
            onChangeText={(password) => setPassword(password)} />
      </View>
      <TouchableOpacity onPress={() => insertData(username, password)}><Text>Sign up</Text></TouchableOpacity>
      </View>
    </>
    )
  }

  const ForgotScreen = ({navigation}) => {
    return(
      <>
        <View style={styles.container}>
          <Text>This is the forgot password screen</Text>
        </View>
      </>
    )
  }

  const FeedScreen = ({navigation}) => {

    const Col = ({ numRows, children }) => {
      return  (
        <View style={styles[`${numRows}col`]}>{children}</View>
      )
    }
    
    const Row = ({ children }) => (
      <View style={styles.row}>{children}</View>
    )

  
    
    return (
      <View style={styles.app}>
      <Row>
        <Col numRows={1}>
          <TouchableOpacity onPress={() => 
                  {getData('"Peter"'),
                  console.log("Fetching Peter's data..."),
                  navigation.navigate('Peter')}}>
            <Image source={require("./assets/Peter_Griffin.png")} style={styles.peterGuy}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
          getData('"Peter"')}><Text>Peter</Text></TouchableOpacity>
        </Col>
        <Col numRows={1}>
          <TouchableOpacity onPress={() =>
                  {getData('"Homer"'),
                  console.log("Fetching Homer's data..."),
                  navigation.navigate('Homer')}}>
            <Image source={require("./assets/HomerSimpson.png")} style={styles.peterGuy}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
          getData('"Homer"')}><Text>Homer</Text></TouchableOpacity>
        </Col>
      </Row>
      <Row>
        <Col numRows={1}>
          <TouchableOpacity onPress={() =>
                  {getData('"Roger"'),
                  console.log("Fetching Roger's data..."),
                  navigation.navigate('Roger')}}>
            <Image source={require("./assets/Roger_Smith.png")} style={styles.peterGuy}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
          getData('"Roger"')}><Text>Roger</Text></TouchableOpacity>
        </Col>
        <Col numRows={1}>
          <TouchableOpacity onPress={() =>
                  {getData('"Stewie"'),
                  console.log("Fetching Stewie's data..."),
                  navigation.navigate('Stewie')}}>
            <Image source={require("./assets/StewieG.png")} style={styles.peterGuy}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
          getData('"Stewie"')}><Text>Stewie</Text></TouchableOpacity>
        </Col>
      </Row>
    </View>
      
    );
  };

  const ProfileScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
      <Text>Profile here</Text>
      <Text>Survey Clicks: {surveyCounter}</Text>
      <Text>Post Clicks: {postCounter}</Text>
      <Text>Feed Clicks: {feedCounter}</Text>
      <Text>Profile Clicks: {profileCounter}</Text>
      </View>
    );
  };

  function Root() {
    
      return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {


            return <Ionicons name="md-home" size={24}/>;

          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          
        })}>
          <Tab.Screen name="Post" component={HomeScreen}  listeners={() => ({
    tabPress: e => {
      
          incrementClips(); setUser(true)
      
    },
  })}/>
          <Tab.Screen name="Feed" component={FeedScreen} listeners={() => ({
    tabPress: e => {
      
          incrementFeed(); setUser(true)
      
    },
  })}/>
        <Tab.Screen name="Profile" component={ProfileScreen} listeners={() => ({
    tabPress: e => {
      
          incrementProfile(); setUser(true)
      
    },
  })}/>
        </Tab.Navigator>
      );
  };

  const Tab = createBottomTabNavigator();

  const SurveyScreen = ({navigation}) => {
    return (
      <View style={styles.container}>  
        <View style={styles.buttonContainer}>  
            <Button  
                title="I love it!" 
                onPress={() =>
                  Alert.alert('Survey', 'Thank you for your feedback! We are glad you love it.', [
                    {text: 'OK', onPress: () => console.log('LOVE Pressed')},
                  ])
                  
                }   
            />  
        </View>  
        <View style={styles.buttonContainer}>  
            <Button    
                title="It's ok."  
                onPress={() =>
                  Alert.alert('Survey', 'Thank you for your feedback! We are working hard to make Chirp better.', [
                    {text: 'OK', onPress: () => console.log('OK OK Pressed')},
                  ])
                } 
            />  
        </View>  
        <View style={styles.buttonContainer}>  
            <Button   
                title="It needs some work."  
                onPress={() =>
                  Alert.alert('Survey', 'Thank you for your feedback! We are working hard to make Chirp better.', [
                    {text: 'OK', onPress: () => console.log('NEEDS WORK OK Pressed')},
                  ])
                }   
            />  
        </View>  
        <View style={styles.buttonContainer}>  
            <Button   
                title="I hate it."  
                onPress={() =>
                  Alert.alert('Survey', 'Thank you for your feedback! We are working hard to make Chirp better.', [
                    {text: 'OK', onPress: () => console.log('HATE OK Pressed')},
                  ])
                }    
            />  
        </View> 
    </View>  
    );
  };

  //CSS Styles
  const styles = StyleSheet.create({  
    container: {  
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    signup: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: "60%", 
    },
    
    googleStuff: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 75
    },

    buttonContainer: {  
        margin: 20

    },  

    page: {
      justifyContent: 'center',
      alignItems: 'center',

    },

    inputView: {
      backgroundColor: "#d42e22",
      borderRadius: 10,
      width: "75%",
      height: 45,
      marginBottom: 10,
      alignItems: "center",
    

    },
    
    TextInput: {
      height:30,
      flex: 0,
      padding: 5,
      marginLeft: 0,
      marginRight: 0,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 7,
      textAlign: "center",

    },

    forgotButton: {
      height: 30,
      marginBottom: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 0
    },

    loginButton: {
      height:33,
      padding: 5,
      backgroundColor: "#d42e22",
      borderRadius: 10,
      width:"100%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10

    },

    
    logo: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      width:100,
      height: 100,
      marginTop:100,
      
    },

    profilePic: {
      width: 50,
      height: 50

    },

    userInfo: {
      alignItems: 'center',
      justifyContent: 'center'

    },

    button: {
      padding: 20,
      margin: 20
    },

    input: {
      height: 40,
      width: 200,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      margin: 20,
      paddingLeft: 5,
      height: 30
    },

    bodyInput: {
      height: 150,
      width: 200,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      margin: 20,
      paddingLeft: 5,
      textAlignVertical: 'top',
      paddingVertical: 5
    },

    app: {
      flex: 2,
      marginHorizontal: "auto",
      width: 420,
      alignItems: 'center',
      justifyContent: 'center'
    },

    peterGuy: {
      width: 160,
      height: 160,
    },

    row: {
      flexDirection: "row"
    },
    
    "1col":  {
      flex:  1,
      alignItems: 'center',
      justifyContent: 'center'
    },

    "2col":  {
      flex:  2
    },
  }); 


  //  *****LOGIN CODE*****

  
  const LoginScreen = ({navigation}) => {

      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");

      function verifyData(username, password) {

        var InsertAPIURL="http://10.0.2.2:80/api/verifylogin.php";
        var headers = {
          'Accept':'application/json',
          'Content-Type':'application/json'
        };
      
        var Data = {
          Username: username,
          Password: password,
        };
      
        fetch(InsertAPIURL,
          {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(Data)
          }
          )
        .then((response) => response.text())
        .then((response) => {
          if (response === 'successful login.'){
            navigation.navigate("Home")
            console.log("Login Successful")
          } else {
            Alert.alert("Incorrect Username or Password. Please try again.")
            console.log("Login Failed")
          }
        })
      }
      
      return (
        <><View style={styles.container}>

          <StatusBar style="auto" />

          <Image source={require("./assets/ChirpLOGO.png")} style={styles.logo}/>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Username"
              placeholderTextColor="#000"
              onChangeText={(username) => setUsername(username)} />
          </View>


          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#000"
              onChangeText={(password) => setPassword(password)} />
          </View>

          
          <TouchableOpacity onPress={() => {navigation.navigate('Password Recovery')}}>
            <Text style={styles.forgotButton}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {navigation.navigate('Signup')}}>
            <Text style={styles.forgotButton}>Sign up here!</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => verifyData(username, password)}>
            <Text style={styles.loginButton}>Login</Text> 
          </TouchableOpacity>


        </View>

        
        </>
      );
      
    
  }

  return (
  MyStack()
 )
}

//, verifyData()