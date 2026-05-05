import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const QUEUE_KEY = 'offline_action_queue';

const OfflineManager = {
  addToQueue: async (actionType, payload) => {
    try {
      const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = existingQueue ? JSON.parse(existingQueue) : [];
      const newTask = {
        id: Date.now().toString(),
        type: actionType,
        payload: payload,
        timestamp: new Date().toISOString(),
      };
      queue.push(newTask);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (error) {
      console.error("Failed to save offline action", error);
      return false;
    }
  },

  getQueueLength: async () => {
    const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
    const queue = existingQueue ? JSON.parse(existingQueue) : [];
    return queue.length;
  },

  syncQueue: async () => {
    try {
      const existingQueue = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = existingQueue ? JSON.parse(existingQueue) : [];
      if (queue.length === 0) return { success: true, count: 0 };

      const failedItems = [];
      let successCount = 0;

      for (const task of queue) {
        try {
          if (task.type === 'UPDATE_STOCK') {
            const { id, amount, action } = task.payload;
            await client.post(`/products/${id}/update_stock/`, { amount, action });
            successCount++;
          }
        } catch (error) {
          console.error(`Failed to sync task ${task.id}`, error);
          failedItems.push(task);
        }
      }

      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(failedItems));
      return { success: true, count: successCount, remaining: failedItems.length };
    } catch (error) {
      return { success: false };
    }
  }
};

export default OfflineManager;
