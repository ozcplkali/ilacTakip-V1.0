import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import IlacEkle from './components/ilacEkle';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ilaclar from './components/ilaclar'; // Import the Ilaclar component

const App = () => {
  const [showIlacEkle, setShowIlacEkle] = useState(false);

  const closeModal = () => {
    setShowIlacEkle(false);
  };

  return (
    <View className="flex-1 mt-10">

        <View className="flex-1 justify-center items-center">
          <TouchableOpacity className="absolute z-40 bottom-5 right-5" onPress={() => setShowIlacEkle(!showIlacEkle)}>
            <AntDesign name="pluscircle" size={56} color="brown" />    
          </TouchableOpacity>
          {showIlacEkle && (
            <View className="absolute z-50">
              <IlacEkle closeModal={closeModal} />
            </View>
          )}

          <ScrollView className="flex-1 w-full h-full">
          <Ilaclar />
            {/* Temporary Solution */}
          <View className="h-44 mb-[200%] "></View>
          <View className="h-44 mb-[200%] "></View>


          </ScrollView>
        </View>
    </View>
  );
};

export default App;