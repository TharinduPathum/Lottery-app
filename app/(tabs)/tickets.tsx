import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Colors, API_URL } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '../../context/AuthContext'; 

interface LuckySet {
  _id: string; 
  setName: string;
  numbers: number[];
  description?: string;
  createdAt: string;
}

export default function LuckyNumbersScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user, token } = useAuth(); 

  const [luckySets, setLuckySets] = useState<LuckySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  
  const [editingSet, setEditingSet] = useState<LuckySet | null>(null);
  const [formName, setFormName] = useState('');
  const [formNumbers, setFormNumbers] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const fetchLuckyNumbers = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/lucky-numbers/user/${user.id}`);
      if (response.data.success) {
        setLuckySets(response.data.data);
      }
    } catch (error: any) {
      console.log('Fetch Error:', error);
      Alert.alert('Error', 'දත්ත ලබාගැනීමට නොහැකි විය.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLuckyNumbers();
  }, [user?.id]);

  const generateRandomNumbers = () => {
    const randoms: number[] = [];
    while (randoms.length < 5) {
      const r = Math.floor(Math.random() * 49) + 1;
      if (!randoms.includes(r)) randoms.push(r);
    }
    setFormNumbers(randoms.join(', '));
  };

  const openModal = (luckySet: LuckySet | null = null) => {
    if (luckySet) {
      setEditingSet(luckySet);
      setFormName(luckySet.setName);
      setFormNumbers(luckySet.numbers.join(', '));
      setFormDesc(luckySet.description || '');
    } else {
      setEditingSet(null);
      setFormName('');
      setFormNumbers('');
      setFormDesc('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName || !formNumbers) {
      Alert.alert('Error', 'කරුණාකර නමක් සහ අංක ඇතුළත් කරන්න.');
      return;
    }

    const numArray = formNumbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (numArray.length !== 5) {
      Alert.alert('Error', 'කරුණාකර නිවැරදිව අංක 5ක් ඇතුළත් කරන්න.');
      return;
    }

    setButtonLoading(true);
    try {

      if (editingSet) {
        const response = await axios.put(`${API_URL}/lucky-numbers/update/${editingSet._id}`, {
          setName: formName,
          numbers: numArray,
          description: formDesc,
        });

        if (response.data.success) {
          Alert.alert('Success', 'සාර්ථකව සංස්කරණය කරන ලදී!');
          fetchLuckyNumbers(); 
          setModalVisible(false);
        }
      } else {
        const response = await axios.post(`${API_URL}/lucky-numbers/add`, {
          userId: user?.id, 
          setName: formName,
          numbers: numArray,
          description: formDesc,
        });

        if (response.data.success) {
          Alert.alert('Success', 'වාසනාවන්ත අංක කට්ටලය සේව් කරන ලදී!');
          fetchLuckyNumbers(); 
          setModalVisible(false);
        }
      }
    } catch (error: any) {
      console.log('Save Error:', error);
      Alert.alert('Error', 'සේව් කිරීමට නොහැකි විය.');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Set', 'මෙම වාසනාවන්ත අංක කට්ටලය මකා දැමීමට තහවුරු කරන්නද?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            const response = await axios.delete(`${API_URL}/lucky-numbers/delete/${id}`);
            if (response.data.success) {
              Alert.alert('Deleted', 'සාර්ථකව මකා දමන ලදී.');
              fetchLuckyNumbers(); 
            }
          } catch (error) {
            console.log('Delete Error:', error);
            Alert.alert('Error', 'මකා දැමීමට නොහැකි විය.');
          }
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔮 My Lucky Numbers ({luckySets.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ New Set</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
          <Text style={{ marginTop: 10, color: '#687076' }}>දත්ත ලෝඩ් වෙමින් පවතී...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionSubtitle}>ඔබේ වාසනාවන්ත අංක මෙතැනින් කළමනාකරණය කර, වෙබ් අඩවියෙන් ලොතරැයි මිලදී ගැනීමේදී භාවිතා කරන්න.</Text>
          
          {luckySets.length === 0 ? (
            <Text style={styles.emptyText}>දැනට වාසනාවන්ත අංක කිසිවක් නැත. අලුත් කට්ටලයක් එකතු කරන්න! ✨</Text>
          ) : (
            luckySets.map((set) => (
              <View key={set._id} style={styles.luckyCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{set.setName}</Text>
                  <Text style={styles.dateText}>{new Date(set.createdAt).toLocaleDateString()}</Text>
                </View>

                <View style={styles.ballContainer}>
                  {set.numbers.map((num, idx) => (
                    <View key={idx} style={styles.ball}>
                      <Text style={styles.ballText}>{num}</Text>
                    </View>
                  ))}
                </View>

                {set.description ? <Text style={styles.descText}>💡 {set.description}</Text> : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openModal(set)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(set._id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSet ? 'Edit Lucky Numbers' : 'Save New Lucky Numbers'}</Text>
            
            <Text style={styles.label}>කට්ටලයේ නම (Set Name)</Text>
            <TextInput style={styles.input} value={formName} onChangeText={setFormName} placeholder="e.g. My Dream Numbers" />

            <Text style={styles.label}>වාසනාවන්ත අංක 5 (කමා වලින් වෙන් කරන්න)</Text>
            <View style={styles.inputRow}>
              <TextInput style={[styles.input, { flex: 1 }]} value={formNumbers} onChangeText={setFormNumbers} placeholder="e.g. 7, 32, 28, 30, 1" keyboardType="numeric" />
              <TouchableOpacity style={styles.magicButton} onPress={generateRandomNumbers}>
                <Text style={styles.magicButtonText}>🎲 Auto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>විස්තරය (Description)</Text>
            <TextInput style={styles.input} value={formDesc} onChangeText={setFormDesc} placeholder="e.g. සෙනසුරාදා දිනුම් ඇදීමට" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#687076' }]} onPress={() => setModalVisible(false)} disabled={buttonLoading}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF7A00' }]} onPress={handleSave} disabled={buttonLoading}>
                {buttonLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonText}>Save Set</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#0B1E36' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  addButton: { backgroundColor: '#FF7A00', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  container: { padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionSubtitle: { fontSize: 13, color: '#687076', marginBottom: 20, lineHeight: 18 },
  emptyText: { textAlign: 'center', color: '#9BA1A6', marginTop: 40, fontSize: 14, fontStyle: 'italic' },
  luckyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0B1E36' },
  dateText: { fontSize: 11, color: '#9BA1A6' },
  ballContainer: { flexDirection: 'row', marginBottom: 15 },
  ball: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFB800', justifyContent: 'center', alignItems: 'center', marginRight: 10, elevation: 2 },
  ballText: { color: '#0B1E36', fontWeight: 'bold', fontSize: 15 },
  descText: { fontSize: 13, color: '#555', fontStyle: 'italic', marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F5F7FA', paddingTop: 10 },
  editButton: { marginRight: 20, paddingVertical: 4, paddingHorizontal: 10 },
  editButtonText: { color: '#2F80ED', fontWeight: 'bold' },
  deleteButton: { paddingVertical: 4, paddingHorizontal: 10 },
  deleteButtonText: { color: '#ff4d4d', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B1E36', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#687076', marginBottom: 5, marginTop: 12 },
  input: { height: 45, borderColor: '#e1e1e1', borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, backgroundColor: '#f9f9f9', fontSize: 15 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  magicButton: { backgroundColor: '#0B1E36', height: 45, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15, borderRadius: 6, marginLeft: 10 },
  magicButtonText: { color: '#FFB800', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  modalButton: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginHorizontal: 5 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});