import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import { RFValue } from "react-native-respontive-fontsize";
import Ionicons from "re-native-vector-icon/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from "expo-speech";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": requestAnimationFrame("../assets/fonts/BubblegumSane-Regular.ttf")
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: "purple",
      speakerIcon: "volume-high-outline",
      light_theme: true,
      like: this.props.route.params.story.story.likes,
      is_liked: false
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentdidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  async initiateTTS(title, author, story, moral) {
    console.log(title);
    const current_color = this.state.speakerColor;
    this.setState({
      speakerColor: current_color === "purple" ? "#a649ee" : "purple"
    });
    if (current_color === "purple") {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak("The moral of the story is!");
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  likeAction = () => {
    console.log("here");
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.props.route.params.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.icrement(-1));
      this.setState({ likes: (this.state.likes -= 1), is_likes: false });
    } else {
      firebase
        .database
        .ref("posts")
        .child(this.props.roite.params.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }
              >
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardLight
                  : styles.storyCard
              }
            >
              <Image
                source={require("../assets/story_image_1.png")}
                style={styles.image}
              ></Image>
              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyTitleTextLight
                        : styles.storyTitleText
                    }
                  >
                    {this.props.route.params.story.title}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }
                  >
                    {this.props.route.story.author}
                    </Text>
                    <Text
                      style={
                        this.state.light_theme
                          ? styles.storyAuthorTextLight
                          : styles.storyAuthorText
                      }
                    >
                      {this.props.route.params.story.created_on}
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.initiateTTS(
                        this.props.route.params.title,
                        this.props.route.params.author,
                        this.props.route.params.story,
                        this.props.route.params.moral
                      )
                    }
                  >
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.storyTextLight
                      : styles.storyText
                  }
                >
                  {this.props.roite.params.story.story}
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.moralTextLight
                      : styles.moralText
                  }
                >
                  Moral - {this.props.route.params.story.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={
                    this.state.is_liked
                      ? styles.likeButtonLiked
                      : styles.likeButtonDisliked
                  }
                  onPress={() => this.likeAction()}
                >
                  <Ionicons
                    name={"heart"}
                    size={RFValue(30)}
                    color={this.state.light_theme ? "black" : "white"}
                  />

                  <Text
                    style={
                      this.state.light_theme
                        ? styles.likeTextLight
                        : styles.likeText
                    }
                  >
                    {this.state.likes}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    baclgroundColor: "#2d153c"
  },
containerLight: {
  flex: 1,
  backgroundColor: "white"
},
droidSafeArea: {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
},
appTitle: {
  flex: 0.07,
  flexDirection: "row"
},
appIcon: {
  flex: 0.3,
  justifyContent: "center",
  alignItems: "center"
},
iconImage: {
  width: "100%",
  height: "100%",
  resizeMode: "contain",
},
appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
},
appTitleText: {
  color: "lightpurple",
  fontSize: RFValue(28),
  fontFamily: "Bubblegum-Sans"
},
appTutleTextLight: {
  color: "darkpurple",
  fontSize: RFValue(28),
  fontFamily: "Bubblegum-Sans"
},
storyContainer: {
  flex: 1
},
storyCard: {
  margin: RFValue(20),
  backgroundColor: "#4a2f5d",
  borderRadius: RFValue(20)
},
storyCardLight: {
  margin: RFValue(20),
  backgroundColor: "lightpurple",
  borderRadius: RFValue(20),
  shadowColor: "rgb(0, 0, 0",
  shadowOffset: {
    width: 3,
    height: 3,
  },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: 2
},
})