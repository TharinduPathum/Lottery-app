// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  const latestResults = [47, 1, 9, 7, 48];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.headerCard}>
          <Text style={styles.welcomeText}>ආයුබෝවන්, {user?.name || 'Anura Dissanayake'}</Text>
          <View style={styles.walletBadge}>
            <Text style={styles.walletText}>💰 Wallet Balance: Rs. {user?.walletBalance ?? '8,500'}/-</Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeHeading}>🎰 ඔබේ වාසනාවන්ත ලොතරැයි පත අදම තෝරාගන්න!</Text>
          <Text style={styles.noticePrice}>ටිකට්පතක් රු. 100/- ක් පමණි.</Text>
          <View style={styles.divider} />
          <Text style={styles.noticeBody}>
            මෙම ජංගම යෙදුම (App) හරහා ලොතරැයිපත් මිලදී ගත නොහැකි බැවින්, ඔබ තෝරාගත් වාසනාවන්ත අංක භාවිතා කර ලොතරැයිපත් මිලදී ගැනීම සඳහා කරුණාකර අපගේ නිල වෙබ් අඩවිය වෙත පිවිසෙන්න.
          </Text>
          <Text style={styles.webLink}>🌐 lankalottery.xyz</Text>
        </View>

        <Text style={styles.sectionTitle}>🍀 Digital Lottery Store</Text>
        <Text style={styles.subtitle}>ලොතරැයි ප්‍රතිඵල සහ ඔබේ වාසනාවන්ත අංක එකම තැනකින් කළමනාකරණය කරගන්න.</Text>

        <View style={styles.resultsCard}>
          <Text style={styles.resultsHeader}>LATEST DRAW RESULTS HISTORY</Text>
          <Text style={styles.resultsDate}>📅 අවසන් වරට ඇදුණේ: 7/7/2026, 12:37 PM</Text>
          
          <View style={styles.ballContainer}>
            {latestResults.map((num, index) => (
              <View key={index} style={styles.ball}>
                <Text style={styles.ballText}>{num}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statsText}>Checked: <Text style={{fontWeight:'bold'}}>57</Text></Text>
            <Text style={styles.statsText}>Winners: <Text style={{fontWeight:'bold', color: '#FF7A00'}}>29</Text></Text>
            <Text style={[styles.statsText, {color: '#4CD964'}]}>Total Payout: Rs. 3400.00</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#0B1E36', 
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletBadge: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  walletText: {
    color: '#0B1E36',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noticeBox: {
    backgroundColor: '#FFF9E6', 
    borderWidth: 1,
    borderColor: '#FFB800', 
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noticeHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D48C00',
    textAlign: 'center',
    marginBottom: 4,
  },
  noticePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B1E36',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFE6A3',
    marginVertical: 8,
  },
  noticeBody: {
    fontSize: 13,
    color: '#4F5E71',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'System',
  },
  webLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2F80ED',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1E36',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#687076',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  resultsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  resultsHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0B1E36',
    letterSpacing: 1,
    marginBottom: 5,
  },
  resultsDate: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 20,
  },
  ballContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ball: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
  },
  ballText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#EBEFF5',
    paddingTop: 15,
  },
  statsText: {
    fontSize: 11,
    color: '#687076',
  }
});