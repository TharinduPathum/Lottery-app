import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@/constants/theme';

interface Ticket {
  _id: string;
  ticketNumber: string;
  luckyNumbers: number[];
  purchaseDate: string;
  status: string;
  prizeAmount?: number;
  drawId?: {
    drawDate: string;
  };
}

export default function MyTicketsScreen() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTickets = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '', 
          'user-id': user.id
        }
      });
      
      if (response.data) {
        const sortedTickets = response.data.sort((a: any, b: any) => {
          const dateA = new Date(a.purchaseDate || a.createdAt).getTime();
          const dateB = new Date(b.purchaseDate || b.createdAt).getTime();
          return dateB - dateA;
        });
        setTickets(sortedTickets);
      }
    } catch (error) {
      console.log("Error fetching my tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyTickets();
    }
  }, [user?.id, token]);

  const renderTicketItem = ({ item }: { item: any }) => {
    const currentStatus = item.status?.toUpperCase(); 
    const isWon = currentStatus === 'WON';

    // දිනපු මුදල හෝ 0 සෙට් කරනවා
    const prize = item.prizeAmount !== undefined ? item.prizeAmount : (item.prize || 0);
    
    // Invalid Date එක හදනවා
    const rawDate = item.purchaseDate || item.createdAt;
    const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'N/A';

    let ticketNumbers: number[] = [];
    const incomingNumbers = item.luckyNumbers || item.numbers;

    if (Array.isArray(incomingNumbers)) {
      ticketNumbers = incomingNumbers;
    } else if (typeof incomingNumbers === 'string') {
      ticketNumbers = incomingNumbers.split(',').map(num => parseInt(num.trim(), 10));
    }

    return (
      <View style={[styles.ticketCard, isWon && styles.wonCard]}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>
            🎫 Ticket: {item.ticketNumber || item._id.substring(0, 8).toUpperCase()}
          </Text>
          
          <View style={[
            styles.badge, 
            currentStatus === 'PENDING' && styles.badgePending,
            isWon && styles.badgeWon,
            currentStatus === 'LOST' && styles.badgeLost
          ]}>
            <Text style={[
              styles.badgeText,
              currentStatus === 'PENDING' && { color: '#0056B3' },
              currentStatus === 'LOST' && { color: '#687076' },
              isWon && { color: '#fff' }
            ]}>
              {currentStatus === 'PENDING' && '⏳ Active'}
              {isWon && `🎉 WON (Rs.${prize})`}
              {currentStatus === 'LOST' && '❌ Lost'}
            </Text>
          </View>
        </View>

        <View style={styles.ballContainer}>
          {ticketNumbers.length > 0 ? (
            ticketNumbers.map((num, idx) => (
              <View key={idx} style={styles.ball}>
                <Text style={styles.ballText}>{num}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#8A95A5', fontSize: 12 }}>අංක ලබාගත නොහැක</Text>
          )}
        </View>

        <View style={styles.ticketFooter}>
          <Text style={styles.dateText}>📅 Purchased: {formattedDate}</Text>
          {item.drawId?.drawDate && (
            <Text style={styles.dateText}>🎰 Draw: {new Date(item.drawId.drawDate).toLocaleDateString()}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>My Lottery Tickets 🎟️</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0B1E36" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item._id}
            renderItem={renderTicketItem}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={fetchMyTickets}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  ඔයා දැනට මිලදී ගත් ලොතරැයිපත් කිසිවක් නැත. 🎰
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1E36',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E1E6EB',
    elevation: 2,
  },
  wonCard: {
    borderColor: '#4CD964',
    backgroundColor: '#F0FFF4',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B1E36',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: '#E6F0FA',
  },
  badgeWon: {
    backgroundColor: '#4CD964',
  },
  badgeLost: {
    backgroundColor: '#F4F5F7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  ballContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ball: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    elevation: 1,
  },
  ballText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#8A95A5',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A95A5',
    textAlign: 'center',
  },
});