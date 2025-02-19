import React, { use, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import colors from "../styles/colours";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import db from "../utils/firebase";
import {doc,getDoc,updateDoc, collection, addDoc } from "firebase/firestore";

const IlacEkle = ({ closeModal }) => {
    

        

        const [ilacAdi, setIlacAdi] = useState("");
        const [ilacLink, setIlacLink] = useState("");
        const [isMorningTrue, setIsMorningTrue] = useState(false);
        const [isNoonTrue, setIsNoonTrue] = useState(false);
        const [isEveningTrue, setIsEveningTrue] = useState(false);
        
        const [isHungry,setIsHungry] = useState(false);

        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        const [date, setDate] = useState(new Date());

        const showDatePicker = () => {
          setDatePickerVisibility(true);
        };
      
        const hideDatePicker = () => {
          setDatePickerVisibility(false);
        };
      
        const handleConfirm = (selectedDate) => {
          setDate(selectedDate);
          hideDatePicker();
        };

        const confirmCloseModal = () => {
            // Tüm alanların boş/varsayılan değerde olup olmadığını kontrol et
            const isDefault = 
                ilacAdi === "" && 
                ilacLink === "" && 
                !isMorningTrue && 
                !isNoonTrue && 
                !isEveningTrue && 
                !isHungry;

            if (!isDefault) {
                Alert.alert(
                    "Uyarı",
                    "Yaptığınız Değişiklikler Kaydedilmiyecektir yine de kapatmak istiyor musunuz?",
                    [
                        {
                            text: "Hayır",
                            onPress: () => {},
                            style: "cancel"
                        },
                        {
                            text: "Evet",
                            onPress: closeModal
                        }
                    ]
                );
            } else {
                closeModal();
            }
        };

        const saveIlac = async () => {
            // Kontrolleri yapalım
            if (!ilacAdi.trim()) {
                Alert.alert("Uyarı", "Lütfen ilaç adını giriniz");
                return;
            }

            if (!isMorningTrue && !isNoonTrue && !isEveningTrue) {
                Alert.alert("Uyarı", "Lütfen en az bir kullanım zamanı seçiniz");
                return;
            }

            if (!date) {
                Alert.alert("Uyarı", "Lütfen bitiş tarihi seçiniz");
                return;
            }

            try {
                await addDoc(collection(db, 'ilaclar'), {
                    name: ilacAdi,
                    sabah: isMorningTrue,
                    ogle: isNoonTrue,
                    aksam: isEveningTrue,
                    acKarna: isHungry,
                    bitisTarihi: date,
                    imageUrl: ilacLink,
                });
                Alert.alert("Başarılı", "İlaç başarıyla eklendi");
                closeModal();
            } catch (e) {
                console.error("Error adding document: ", e);
                Alert.alert("Hata", "İlaç eklenirken bir hata oluştu");
            }
        };


        const calculateDays = (endDate) => {
            if (!endDate || !endDate.toDate) {
                return "süre girilmedi";
            }
            const end = endDate.toDate();
            const day = String(end.getDate()).padStart(2, '0');
            const month = String(end.getMonth() + 1).padStart(2, '0');
            const year = end.getFullYear();
            return `${day}/${month}/${year}`;
        };

    return (
        <View className="justify-center bg-[#242424] h-[65%] w-[80%] rounded-2xl items-center">
            <TouchableOpacity className="absolute top-5 right-5" onPress={confirmCloseModal}>
                <Entypo name="cross" size={24} color="#A1A1A1" />
            </TouchableOpacity>
            



            <View className="absolute top-10 left-5 w-full flex-row ">
                <View className="w-2/5 mr-2">
                <Text className="text-lg font-semibold w-full text-[#E5E5E5]">İlaç Ekle</Text>
                <TextInput
                className="h-10 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-full bg-[#2C2C2C] text-[#E5E5E5]"
                placeholderTextColor="#575757"
                placeholder="İlaç ismi giriniz"
                value={ilacAdi}
                onChangeText={setIlacAdi}
                />
                </View>

                <View className="w-2/5">
                <Text className="text-lg font-semibold w-full text-[#E5E5E5]">Resim Linki</Text>
                <TextInput
                className="h-10 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-full bg-[#2C2C2C] text-[#E5E5E5]"
                placeholderTextColor="#575757"
                placeholder="Görsel linki"
                value={ilacLink}
                onChangeText={setIlacLink}
                />
                </View>
            </View>



            <View className=" left-5 absolute top-36 w-full ">
            <Text className=" text-lg font-semibold text-[#E5E5E5]">Ne Zamanlarda Kullanılıyor</Text>
                <View className="flex flex-row ">
                    <TouchableOpacity
                        className={`h-8 border mr-2 border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isMorningTrue ? "bg-[#4F46E5]" : "bg-[#575757]"} flex justify-center`}
                        onPress={() => setIsMorningTrue(!isMorningTrue)}
                    >
                        <Text className={`text-sm text-center ${isMorningTrue ? "text-white" : "text-[#E5E5E5]"}`}>Sabah</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`h-8 border mr-2 border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isNoonTrue ? "bg-[#4F46E5]" : "bg-[#575757]"} flex justify-center`}
                        onPress={() => setIsNoonTrue(!isNoonTrue)}
                    >
                        <Text className={`text-sm text-center ${isNoonTrue ? "text-white" : "text-[#E5E5E5]"}`}>Öğle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`h-8 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isEveningTrue ? "bg-[#4F46E5]" : "bg-[#575757]"} flex justify-center`}
                        onPress={() => setIsEveningTrue(!isEveningTrue)}
                    >
                        <Text className={`text-sm text-center ${isEveningTrue ? "text-white" : "text-[#E5E5E5]"}`}>Akşam</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className=" left-5 absolute top-60 w-full  flex-row">
                <View className=" mr-2 w-2/5">
                    <Text className=" w-full text-lg font-semibold text-[#E5E5E5]">Aç/tok Karna</Text>
                    <View className="flex flex-row mt-5">
                        <TouchableOpacity
                            className={`h-10 border-t border-b border-l w-1/2 border-[#3B3B3B] rounded-l-lg px-3 ${isHungry=== true ? "bg-[#4F46E5]" : "bg-[#575757]"}`}
                            onPress={() => setIsHungry (true)}
                        >
                            <Text className={`text-center ${isHungry === true ? "text-white" : "text-[#E5E5E5]"}`}>Aç Karna</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`h-10 border-t border-b border-r w-1/2 border-[#3B3B3B] rounded-r-lg px-3 ${isHungry === false ? "bg-[#4F46E5]" : "bg-[#575757]"}`}
                            onPress={() => setIsHungry(false)}
                        >
                            <Text className={`text-center ${isHungry===false ? "text-white" : "text-[#E5E5E5]"}`}>Tok Karna</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View  className=" mr-2 w-2/5">
                    <Text className=" text-lg font-semibold text-[#E5E5E5] w-full">Son Tarih</Text>
                    <TouchableOpacity
                        className="h-10 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-full bg-[#575757] flex justify-center"
                        onPress={showDatePicker}
                    >
                        <Text className="text-sm text-center text-[#E5E5E5]">Tarih Seç </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        />
                </View>
            </View>
            <View className="absolute bottom-10 w-full  justify-center items-center">
                <TouchableOpacity className="h-10 bg-[#10B981] rounded-lg px-3 mt-5 w-7/12 flex justify-center" onPress={saveIlac}>
                    <Text className="text-sm text-center text-white">Kaydet</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
    );
}

export default IlacEkle;




