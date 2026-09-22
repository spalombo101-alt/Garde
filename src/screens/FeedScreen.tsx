import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useClosetStore } from '@stores/closetStore';
import { Feed } from '@types/index';

export default function FeedScreen() {
  const { feed, isLoading, fetchFeed, likeItem } = useClosetStore();

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLike = async (itemId: string) => {
    await likeItem(itemId);
  };

  const renderFeedItem = ({ item }: { item: Feed }) => (
    <View style={styles.feedCard}>
      <View style={styles.header}>
        {item.user.avatar && (
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.displayName}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {item.content.imageUri && (
        <Image source={{ uri: item.content.imageUri }} style={styles.contentImage} />
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleLike(item.contentId)}>
          <Text style={[styles.likeButton, item.liked && styles.liked]}>
            ❤️ {item.likes}
          </Text>
        </TouchableOpacity>
      </View>

      {item.type === 'item' && item.content.brand && (
        <Text style={styles.brand}>{item.content.brand}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Garde</Text>
      </View>
      <FlatList
        data={feed}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  feedCard: {
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  contentImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
  },
  footer: {
    padding: 12,
    flexDirection: 'row',
  },
  likeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  liked: {
    color: '#e74c3c',
  },
  brand: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
