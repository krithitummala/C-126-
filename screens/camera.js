import * as React from "react";
import {Button,View,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import { Alert } from "react-native-web";

export default class Pick_image extends React.Component{
    state = {
        image:null
    }

    getPermissionAsync = async()=>{
     if(Platform.OS !== "web"){
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status !== "granted"){
       alert("Sorry,we need camera roll permissions to make this work")
      }
     }
    }

    componentDidMount(){
        this.getPermissionAsync()
    }

    pickImage = async()=>{
     try {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.All,
          allowsEditing:true,
          aspect:[4,3],
          quality:1
      })
      if(!result.cancelled){
       this.setState({
           image:result.data
      })
      console.log(this.state.image)
      console.log(result.uri)
      this.uploadImage(result.uri)
      }
     }
     catch(E){
         console.log(E)
     }
    }

    uploadImage = async(uri)=>{
     const data = new FormData()
     let file_name = uri.split("/")[uri.split("/").length - 1]
     let type = `image/${uri.split(".")[uri.split(".").length - 1]}`
     const fileToLoad = {
         uri:uri,
         name:file_name,
         type:type}
    data.append("digit",fileToLoad)
    fetch("#",{
        method:"POST",
        body:data,
        headers:{
            "content-type":"multipart/form-data"
        }
    })
    .then((response)=>{
        response.json()
    })
    .then((result)=>{
     console.log("Success:",result)
    })

    .catch((E)=>{
      console.error(E)
    })
    }
render(){
    return(
        <View style = {{flex:1,alignItems:"center",justifyContent:"center"}}>
         <Button title = "Pick an image from camera roll"
         onPress = {
             this.pickImage
         }/>
        </View>
    )
}
}