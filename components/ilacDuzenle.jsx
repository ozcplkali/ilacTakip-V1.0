import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import colors from "../styles/colours";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import db from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

const IlacDuzenle = ({ ilac, closeModal, onSave }) => {
    const [ilacAdi, setIlacAdi] = useState(ilac.name);
    const [ilacLink, setIlacLink] = useState(ilac.imageUrl);
    const [isMorningTrue, setIsMorningTrue] = useState(ilac.sabah);
    const [isNoonTrue, setIsNoonTrue] = useState(ilac.ogle);
    const [isEveningTrue, setIsEveningTrue] = useState(ilac.aksam);
    const [isHungry, setIsHungry] = useState(ilac.acKarna);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(ilac.bitisTarihi.toDate());

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
        // Değişiklik yapılmış mı kontrol et
        const isChanged = 
            ilacAdi !== ilac.name ||
            ilacLink !== ilac.imageUrl ||
            isMorningTrue !== ilac.sabah ||
            isNoonTrue !== ilac.ogle ||
            isEveningTrue !== ilac.aksam ||
            isHungry !== ilac.acKarna ||
            date.getTime() !== ilac.bitisTarihi.toDate().getTime();

        if (isChanged) {
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

    const calculateDays = (endDate) => {
        if (!endDate || !endDate.toDate) {
            return "süre girilmedi";
        }
        const end = endDate.toDate();
        console.log(endDate)
        const day = String(end.getDate()).padStart(2, '0');
        const month = String(end.getMonth() + 1).padStart(2, '0');
        const year = end.getFullYear();
        return `${day}/${month}/${year}`;
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
            const ilacRef = doc(db, 'ilaclar', ilac.id);
            await updateDoc(ilacRef, {
                name: ilacAdi,
                sabah: isMorningTrue,
                ogle: isNoonTrue,
                aksam: isEveningTrue,
                acKarna: isHungry,
                bitisTarihi: date,
                imageUrl: ilacLink,
            });
            Alert.alert("Başarılı", "İlaç başarıyla güncellendi");
            closeModal();
            onSave(); // Listeyi yenilemek için onSave fonksiyonunu çağırın
        } catch (e) {
            console.error("Error updating document: ", e);
            Alert.alert("Hata", "İlaç güncellenirken bir hata oluştu");
        }
    };

    return (
        <View className="justify-between bg-[#242424] w-[90%] rounded-2xl p-5">
            <TouchableOpacity className="absolute top-5 right-5" onPress={confirmCloseModal}>
                <Entypo name="cross" size={24} color="#A1A1A1" />
            </TouchableOpacity>

            <View className="w-full flex-row">
                <View className="w-2/5 mr-2">
                    <Text className="text-lg font-semibold w-full text-[#E5E5E5]">İsmi Düzenle</Text>
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

            <View className="w-full">
                <Text className="text-lg font-semibold text-[#E5E5E5]">Ne Zamanlarda Kullanılıyor</Text>
                <View className="flex flex-row">
                    <TouchableOpacity
                        className={`h-8 border mr-2 border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isMorningTrue ? "bg-blue-500" : "bg-[#3B3B3B]"} flex justify-center`}
                        onPress={() => setIsMorningTrue(!isMorningTrue)}
                    >
                        <Text className={`text-sm text-center ${isMorningTrue ? "text-white" : "text-[#E5E5E5]"}`}>Sabah</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`h-8 border mr-2 border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isNoonTrue ? "bg-blue-500" : "bg-[#3B3B3B]"} flex justify-center`}
                        onPress={() => setIsNoonTrue(!isNoonTrue)}
                    >
                        <Text className={`text-sm text-center ${isNoonTrue ? "text-white" : "text-[#E5E5E5]"}`}>Öğle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`h-8 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-3/12 ${isEveningTrue ? "bg-blue-500" : "bg-[#3B3B3B]"} flex justify-center`}
                        onPress={() => setIsEveningTrue(!isEveningTrue)}
                    >
                        <Text className={`text-sm text-center ${isEveningTrue ? "text-white" : "text-[#E5E5E5]"}`}>Akşam</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="w-full flex-row">
                <View className="mr-2 w-2/5">
                    <Text className="w-full text-lg font-semibold text-[#E5E5E5]">Aç/tok Karna</Text>
                    <View className="flex flex-row mt-5">
                        <TouchableOpacity
                            className={`h-10 border-t border-b border-l w-1/2 border-[#3B3B3B] rounded-l-lg px-3 ${isHungry === true ? "bg-blue-500" : "bg-[#3B3B3B]"}`}
                            onPress={() => setIsHungry(true)}
                        >
                            <Text className={`text-center ${isHungry === true ? "text-white" : "text-[#E5E5E5]"}`}>Aç Karna</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`h-10 border-t border-b border-r w-1/2 border-[#3B3B3B] rounded-r-lg px-3 ${isHungry === false ? "bg-blue-500" : "bg-[#3B3B3B]"}`}
                            onPress={() => setIsHungry(false)}
                        >
                            <Text className={`text-center ${isHungry === false ? "text-white" : "text-[#E5E5E5]"}`}>Tok Karna</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View className="mr-2 w-2/5">
                    <Text className="text-lg font-semibold text-[#E5E5E5] w-full">Son Tarih</Text>
                    <TouchableOpacity
                        className="h-10 border border-[#3B3B3B] rounded-lg px-3 mt-5 w-full bg-[#3B3B3B] flex justify-center"
                        onPress={showDatePicker}
                    >
                        <Text className="text-sm text-center text-[#E5E5E5]">{date ? calculateDays(date) : "Tarih Seçiniz"}</Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            </View>

            <View className="w-full justify-center items-center my-5">
                <TouchableOpacity 
                    className="h-10 bg-[#10B981] rounded-lg px-3 w-7/12 flex justify-center" 
                    onPress={saveIlac}
                >
                    <Text className="text-sm text-center text-white">Düzenlenenleri Kaydet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default IlacDuzenle;




