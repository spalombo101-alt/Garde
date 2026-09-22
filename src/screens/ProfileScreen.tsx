import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { useClosetStore } from '@stores/closetStore';
import { ClothingItem } from '@types/index';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { items, isLoading, fetchUserCloset } = useClosetStore();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserCloset(user.id);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.profileHeader}>
              {user.avatar && (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.displayName}>{user.displayName}</Text>
                <Text style={styles.username}>@{user.username}</Text>
                {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
              </View>
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{items.length}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, isFollowing && styles.buttonFollowing]}
                onPress={handleFollow}
              >
                <Text style={[styles.buttonText, isFollowing && styles.buttonFollowingText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
                <Text style={styles.buttonSecondaryText}>Message</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.closetHeader}>
              <Text style={styles.closetTitle}>Closet</Text>
            </View>
          </>
        }
        data={items}
        renderItem={renderClothingItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonFollowing: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonFollowingText: {
    color: '#000',
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  buttonSecondaryText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  closetHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  itemBrand: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
});
