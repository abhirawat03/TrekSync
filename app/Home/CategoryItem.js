import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../components/Colors'

export default function CategoryItem({category}) {


  return (
    <View style={{padding:5,alignItems:'center',
    margin:5,width:95,height:95,justifyContent:'center',
    borderRadius:15,
    backgroundColor: '#D8E3D9'}}>
        <Image source={category.icon}
            style={{width:50,height:50,marginBottom: 10,resizeMode: 'contain',}}
        />
      <Text style={{fontSize:13}}>
        {category.name}</Text>
    </View>
  )
}