import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {

  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,

} from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';


export default function App() {
  const Stack = createNativeStackNavigator();
  //Button Counters
  const [surveyCounter, setSurveyCounter] = useState(0);
  const [feedCounter, setFeedCounter] = useState(0);
  const [postCounter, setPostCounter] = useState(0);
  const [profileCounter, setProfileCounter] = useState(0);
  
  const [graphSurvey, setGraphSurvey] = useState(0)
  const [graphFeed, setGraphFeed] = useState(0) 
  const [graphPost, setGraphPost] = useState(0)
  const [graphProfile, setGraphProfile] = useState(0)

  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = useState('')
  const [allPosts, setAllPosts] = useState('')
  
  const postUser = global.postUser
  const postSubject = global.postSubject
  const postBody = global.postBody
  
  const data = {
    labels: ["Survey", "Feed", "Post", "Profile"],
    datasets: [
      {
        data: [graphSurvey["graphSurvey"],
               graphFeed["graphFeed"],
               graphPost["graphPost"],
               graphProfile["graphProfile"]]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#db2c49",
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: "#db2c49",
    backgroundGradientToOpacity: 1,
    
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0 ,0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: .5,
    useShadowColorFromDataset: false, 
    fillShadowGradient: '#690314', 
    fillShadowGradientOpacity: 1,
    showBarTops: false,
    fromZero: true
  };

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#807a7a',
          padding: 5,
        }}
      />
    );
  };


  const reversedData = [...allPosts].reverse();

  const renderItem = ({item}) => {
    return(
      <View style={styles.listItem}>
        <Text style={styles.postUser}>{item.Username}</Text>
        <Text style={styles.postSubject}>{item.Subject}</Text>
        <Text style={styles.postBody}>{item.Body}</Text>
      </View>
    )
  }

  function GetGraphData() {
    console.log("Working")
    var SearchAPIURL="http://10.0.2.2:80/api/chirpgraph.php";
    var headers={
      'Accept':'application/json',
      'Content-Type':'application/json'
    };

    fetch(SearchAPIURL, 
    {
      method: 'POST',
      headers: headers
    }
    )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setGraphSurvey({graphSurvey:data[0].Survey})
      setGraphFeed({graphFeed:data[0].Feed})
      setGraphPost({graphPost:data[0].Post})
      setGraphProfile({graphProfile:data[0].Profile})
    })
    
  }

  //Automatically update click values every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      callFunction();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const callFunction = () => {
    insertClick();

  }
 
//Retrieves data based on images from our Funny screen
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

//Allows users to create posts and upload them to a database
const insertPost=()=> 
{
  var PostUser=global.username;
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

//Retrieves ALL posts from the database and renders them onto the 
//"Feed" screen using a FlatList
function getAllPosts() {
  var SearchAPIURL = "http://10.0.2.2:80/api/allposts.php"

  fetch(SearchAPIURL, 
    {
      method: 'POST',
    }
  )
  .then((response) => response.json())
  .then(allposts => {
    setAllPosts(allposts);
    console.log(allPosts)

  })
}

//Retrieves the current user's posts and uploads them on the "Profile"
//Screen
function getUserPosts(username) {
  var SearchAPIURL="http://10.0.2.2:80/api/userposts.php"
  var Username = username

  var Data = {
    Username: Username,
  }

  fetch(SearchAPIURL,
    {
      method: 'POST',
      body: JSON.stringify(Data)
    }
  )
  .then((response) => response.json())
  .then(posts => {
    setPosts(posts);
    console.log({posts})
  })
}

//Inserts username and password upon user registration
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

//Updates the values in our database by adding the current click values to whats already in the database. 
//Sets all click values to 0 once they are submitted so they don't get counted again on the 
//Next submission
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
      
      setProfileCounter(0);
      setFeedCounter(0);
      setSurveyCounter(0);
      setPostCounter(0);
      console.log("Click values sent to Database.")
    }

//Construction of each of our screens
function MyStack () {

    return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
    headerShown: true
  }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{
              headerShown: false}}/>
            <Stack.Screen name="Log Out" component={Root}/>
            <Stack.Screen name="Survey" component={SurveyScreen}/>
            <Stack.Screen name="Peter" component={PeterScreen} options={{headerStyle: {
              backgroundColor: "#373b40"
           } }}/>
            <Stack.Screen name="Homer" component={HomerScreen} options={{headerStyle: {
              backgroundColor: "#373b40"
           } }}/>
            <Stack.Screen name="Roger" component={RogerScreen} options={{headerStyle: {
              backgroundColor: "#373b40"
           } }}/>
            <Stack.Screen name="Stewie" component={StewieScreen} options={{headerStyle: {
              backgroundColor: "#373b40"
           } }}/>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Password Recovery" component={ForgotScreen} options={{headerStyle: {
              backgroundColor: "#373b40"
           } }}/>
            <Stack.Screen name="Graph Data" component={GraphScreen}/>
          </Stack.Navigator>
       </NavigationContainer>
      )}

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

//Homescreen
  const HomeScreen = ({navigation}) => {
    

    const [postUser, setPostUser] = useState("")
    const [postSubject, setPostSubject] = useState("")
    const [postBody, setPostBody] = useState("")

    return (
      <View style = {styles.container}>
        <View style = {styles.buttonContainer}>
          <TouchableOpacity
            style={styles.graphButton}
            onPress = { () => {navigation.navigate('Survey'); incrementSurvey();setUser(true)}}><Text>Survey</Text></TouchableOpacity>
            </View>
            <View style = {styles.buttonContainer}>
          <TouchableOpacity
          style={styles.graphButton}
          onPress={insertClick}><Text>Send clicks to database</Text></TouchableOpacity>
          </View>
          <View>
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
            <TouchableOpacity
              style={styles.graphButton}
              onPress={ () => {insertPost()}}
            ><Text>Post</Text></TouchableOpacity>
          </View>
        <View style = {styles.container}>
          <Text>{user}</Text>
        </View>
      </View>
    );
  };

//Funny guy screen
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

//Funny guy screen
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

//Funny guy screen
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

//Funny guy screen
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

//Screen for our graph
  const GraphScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <BarChart
          data={data}
          width={350}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          label
          style={styles.graph}/>
          <TouchableOpacity onPress={() => 
                  {GetGraphData()}} style={styles.graphButton}><Text>Refresh Graph</Text></TouchableOpacity>
      </View>
    )
  }

//Screen for our signup page
  const SignupScreen = ({navigation}) => {

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState('');

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
      <TouchableOpacity onPress={() => insertData(global.username, password)}><Text>Sign up</Text></TouchableOpacity>
      </View>
    </>
    )
  }

//Screen for the forgot password page **HAS YET TO BE IMPLEMENTED**
  const ForgotScreen = ({navigation}) => {
    return(
      <>
        <View style={styles.container}>
          <Text>This is the forgot password screen</Text>
        </View>
      </>
    )
  }

  const FunnyGuys = ({navigation}) => {

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

//Screen for rendering all the posts that the current user has submitted in the database
  const ProfileScreen = ({}) => {
    return (
      <View style={styles.container}>
      <Text style={styles.header}>Welcome {global.username}! Below are your recent posts.</Text>
      <FlatList
        style={styles.flatlist} 
        data={posts}
        ItemSeparatorComponent={listViewItemSeparator}
        keyExtractor={item=>item.ID}
        renderItem={renderItem}
        />
      <TouchableOpacity onPress={() => getUserPosts(global.username)}><Text>Refresh</Text></TouchableOpacity>
      </View>
    );
  };

//Screen for rendering all posts by ALL users
  const FeedScreen = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => getAllPosts()}><Text>Refresh</Text></TouchableOpacity>
        <FlatList
          style={styles.flatlist}
          data={reversedData}
          ItemSeparatorComponent={listViewItemSeparator}
          keyExtractor={item=>item.ID}
          renderItem={renderItem}
          reverse={true}
          />
      </View>
    )
  }

//Main navigator
  function Root() {
    
      return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {

            return <Text></Text>

          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {marginBottom: 15, fontSize: 14, marginRight: 2, fontWeight: "bold", color: "#d42e22"}
          
        })}>
          <Tab.Screen name="Post" component={HomeScreen} listeners={() => ({
    tabPress: e => {
      
          incrementClips(); setUser(true)
      
    },
  })}/>
          <Tab.Screen name="Feed" component={FeedScreen} listeners={() => ({
    tabPress: e => {
      
          incrementFeed(); setUser(true)
      
    },
  })}/>
          <Tab.Screen name="Funny" component={FunnyGuys} listeners={() => ({
    tabPress: e => {
      
          setUser(true)
      
    },
  })}/>
        <Tab.Screen name="Profile" component={ProfileScreen} listeners={() => ({
    tabPress: e => {
      
          incrementProfile(); setUser(true)
      
    },
  })}/>
        <Tab.Screen name="Graph" component={GraphScreen}  listeners ={() => ({
          tabPress: e => {

          }
        })}/>
        </Tab.Navigator>
      );
  };

  const Tab = createBottomTabNavigator();

//Screen for our user survey
  const SurveyScreen = ({navigation}) => {
    return (
      <View style={styles.container}>  
        <View style={styles.buttonContainer}>  
            <TouchableOpacity style={styles.graphButton} onPress={() => Alert.alert('Survey', 'Thank you for your feedback! We are glad you love it.',
            [
              {text: 'OK', onPress: () => console.log('LOVE Pressed')},
            ])}><Text>I LOVE IT!</Text></TouchableOpacity>
            <TouchableOpacity style={styles.graphButton} onPress={() => Alert.alert('Survey', 'Thank you for your feedback! We are glad you think its okay.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ])}><Text>ITS OK.</Text></TouchableOpacity>
            <TouchableOpacity style={styles.graphButton} onPress={() => Alert.alert('Survey', 'Thank you for your feedback. We are working to make Chirp better.',
            [
              {text: 'OK', onPress: () => console.log('NEEDS WORK Pressed')},
            ])}><Text>IT NEEDS SOME WORK</Text></TouchableOpacity>
            <TouchableOpacity style={styles.graphButton} onPress={() => Alert.alert('Survey', 'Thank you for your feedback. We are sorry you hate it. We are working to make Chirp better.',
            [
              {text: 'OK', onPress: () => console.log('HATE Pressed')},
            ])}><Text>I HATE IT.</Text></TouchableOpacity>        
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
      backgroundColor: "#807a7a",
    },

    graph: {
      borderRadius: 10,
      padding: 15,
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

    header: {
      fontSize: 30,
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
      width:"110%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10

    },

    graphButton: {
      backgroundColor: "#d42e22",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      marginTop: 10,
    },

    flatlist: {
      width: '100%',
      padding: 10,
    },

    logo: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      width:100,
      height: 100,
      marginTop:100,
      borderRadius: 5,
      
    },

    tab: {
      backgroundColor: '#373b40',
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
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      margin: 10,
      paddingLeft: 5,
      height: 30,
      borderWidth: 1.3,
    },

    bodyInput: {
      height: 110,
      width: 200,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      margin: 10,
      paddingLeft: 5,
      textAlignVertical: 'top',
      paddingVertical: 5,
      borderWidth: 1.3,
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

    postUser: {
      fontSize: 24,
      padding: 5,
      textDecorationLine: 'underline',
    },

    postSubject: {
      fontSize: 16,
      padding: 5,
    },

    postBody: {
      fontSize: 12,
      padding: 5,
    },

    listItem: {
      borderWidth: 3,
      borderColor: '#d42e22',
      borderRadius: 10,
      padding: 10,
    }
  }); 


  //  *****LOGIN CODE*****

  
  const LoginScreen = ({navigation}) => {

      const username = global.username;
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
            navigation.navigate("Log Out")
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
              onChangeText={(username) => global.username = username} />
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
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 0, backgroundColor: "#807a7a"}}>Or, log in with Google!</Text>
              <TouchableOpacity
                onPress={() => {
                  promptAsync();
                } }
              ><Image source={require("./assets/btn.png")} style={{width: 72, height: 72, borderRadius: 10}}/>
              </TouchableOpacity>

        </View>

        
        </>
      );
      
    
  }

  return (
  MyStack()
 )
}



//GORILLA
/*
                _
            ,.-" "-.,
           /   ===   \
          /  =======  \
       __|  (o)   (0)  |__      
      / _|    .---.    |_ \         
     | /.----/ O O \----.\ |       
      \/     |     |     \/        
      |                   |            
      |                   |           
      |                   |          
      _\   -.,_____,.-   /_         
  ,.-"  "-.,_________,.-"  "-.,
 /          |       |          \  
|           l.     .l           | 
|            |     |            |
l.           |     |           .l             
 |           l.   .l           | \,     
 l.           |   |           .l   \,    
  |           |   |           |      \,  
  l.          |   |          .l        |
   |          |   |          |         |
   |          |---|          |         |
   |          |   |          |         |
   /"-.,__,.-"\   /"-.,__,.-"\"-.,_,.-"\
  |            \ /            |         |
  |             |             |         |
   \__|__|__|__/ \__|__|__|__/ \_|__|__/ 
*/