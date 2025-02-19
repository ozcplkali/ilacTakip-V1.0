import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';

import db from "../utils/firebase";
import {doc,getDoc,updateDoc, collection, addDoc,getDocs } from "firebase/firestore";

import { useState, useEffect } from "react";
import IlacDuzenle from './ilacDuzenle';

const Ilaclar = () => {
    const [ilaclar, setIlaclar] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIlac, setSelectedIlac] = useState(null);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    const openEditModal = (ilac) => {
        setSelectedIlac(ilac); // İlgili ilacı seçili ilac olarak ayarla
        setEditModalVisible(true); // Modal'ı aç
    };

    const closeEditModal = () => {
        setSelectedIlac(null);
        setEditModalVisible(false);
    };

    const fetchIlaclar = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "ilaclar"));
            const ilaclarData = [];
            querySnapshot.forEach((doc) => {
                ilaclarData.push({ id: doc.id, ...doc.data() }); // id bilgisini ekleyin
            });
            setIlaclar(ilaclarData);
        } catch (err) {
            console.error("Error fetching ilaclar: ", err);
            setError(err.message);
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


    useEffect(() => {
        fetchIlaclar();
    }, []);

    return (
        <View className="flex-1">
                {ilaclar.map((ilac, index) => (
                    <View key={index} className="flex-row  justify-between items-center w-full h-[7%] my-2">
                        
                        <View className=" ilac-container flex-row justify-between  h-[100%] items-center w-[85%]  bg-gray-200 rounded-lg mx-2">
                            {/* İsim Alanı*/}
                            <View className="w-1/4  border-l-2  justify-center h-full border-gray-400 rounded-lg">
                                <TouchableOpacity>
                                    <Text className='text-center text-lg'>{ilac.name}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Sabah Öğle Akşam alanı*/}
                            <View className="w-1/3  border-l-2  justify-center h-full border-gray-400 rounded-lg flex-row items-center">
                                {ilac.sabah && <Fontisto style={{ marginRight: 5 }} name="coffeescript" size={22} color="black" />}
                                {ilac.ogle && <FontAwesome5 style={{ marginRight: 5 }} name="sun" size={22} color="black" />}
                                {ilac.aksam && <Entypo  name="moon" size={22} color="black" />}
                            </View>
                            {/* Aç-Tok alanı*/}
                            <View className="w-1/6  border-l-2  justify-center h-full border-gray-400 rounded-lg">
                                <Text className='text-center text-lg'>{ilac.acKarna ? 'Aç' : 'Tok'}</Text>
                            </View>
                            {/* Tarih Alanı*/}
                            <View className="w-1/4  border-x-2  justify-center h-full border-gray-400 rounded-lg">
                                <Text className='text-center font-bold text-md'>{calculateDays(ilac.bitisTarihi)}</Text>
                            </View>
                        </View>
                        <View className="justify-center items-center m-auto">
                            <TouchableOpacity onPress={() => openEditModal(ilac,closeEditModal)}>
                                <FontAwesome name="pencil" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            {isEditModalVisible && (
                <View style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '23%', 
                    transform: [{ translateX: -50 }, { translateY: -50 }], 
                    zIndex: 1000 
                }}>
                    <IlacDuzenle
                        ilac={selectedIlac}
                        closeModal={closeEditModal}
                        onSave={fetchIlaclar} // Listeyi yenilemek için fetchIlaclar fonksiyonunu geçin
                    />
                </View>
            )}
        </View>
    );
};

export default Ilaclar;
