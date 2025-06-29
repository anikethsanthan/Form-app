import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomDropdownProps {
  data: string[];
  value: string;
  onSelect: (item: string) => void;
  placeholder: string;
  error?: boolean;
  focused?: boolean;
}

export default function CustomDropdown({
  data,
  value,
  onSelect,
  placeholder,
  error,
  focused,
}: CustomDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          focused && styles.dropdownFocused,
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    value === item && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      value === item && styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownFocused: {
    borderColor: "#667eea",
    backgroundColor: "#FFFFFF",
    shadowColor: "#667eea",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  dropdownError: {
    borderColor: "#F56565",
    backgroundColor: "#fff",
    shadowColor: "#E53E3E",
    shadowOpacity: 0.2,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
    fontWeight: "500",
    flex: 1,
  },
  placeholderText: {
    color: "#A0AEC0",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#718096",
    fontWeight: "600",
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  selectedItem: {
    backgroundColor: "#EDF2F7",
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
    fontWeight: "500",
  },
  selectedItemText: {
    color: "#667eea",
    fontWeight: "700",
  },
});
