import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner-native';

interface ShareQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  bookId: string;
  cardId: string;
  quoteContent: string;
}

const { width } = Dimensions.get('window');

const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({ 
  visible, 
  onClose, 
  bookId, 
  cardId, 
  quoteContent 
}) => {
  const { addQuote } = useAppContext();
  
  const handleShare = () => {
    addQuote(bookId, cardId, quoteContent);
    toast.success('Quote shared to your profile!');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Share Quote</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.quoteContainer}>
                <Feather name="quote" size={24} color="#888" style={styles.quoteIcon} />
                <Text style={styles.quoteText}>{quoteContent}</Text>
              </View>
              
              <View style={styles.shareOptions}>
                <Text style={styles.shareText}>Share as Quote of the Day</Text>
                <Text style={styles.shareSubtext}>
                  This will appear on your profile for 24 hours
                </Text>
              </View>
              
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonText}>Share to Profile</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quoteContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  quoteIcon: {
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    fontStyle: 'italic',
  },
  shareOptions: {
    marginBottom: 20,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shareSubtext: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    backgroundColor: '#4A6FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareQuoteModal;