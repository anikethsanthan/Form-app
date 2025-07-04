import { apiUrls } from "@/apis/apis";
import usePostQuery from "@/hooks/post-query.hook";
import useToast from "@/hooks/toast";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import CustomDropdown from "../components/CustomDropdown";
import Header from "../components/Header";
import { stateNames } from "../utils/states";

interface FormData {
  name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phoneNumber: string;
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name is a required field"),
  address: Yup.string()
    .required("Please enter your address")
    .min(10, "Address is a required field"),
  state: Yup.string()
    .required("Please enter your state")
    .min(2, "State is a required field"),
  city: Yup.string()
    .required("Please enter your city")
    .min(2, "City is a required field"),
  pincode: Yup.string()
    .required("Please enter pincode")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  phoneNumber: Yup.string()
    .required("Please enter phone number")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export default function FormScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [cities, setCities] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { postQuery } = usePostQuery();
  const { showToast } = useToast();

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const errorMessages: Record<string, string> = {};
      if (validationErrors instanceof Yup.ValidationError) {
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            errorMessages[error.path] = error.message;
          }
        });
      }
      setErrors(errorMessages);
      return false;
    }
  };

  const handleStateSelect = async (selectedState: string) => {
    setCities([]);
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: "", // Reset city when state changes
    }));

    // Clear errors for state and city
    if (errors.state || errors.city) {
      setErrors((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
    }

    try {
      await postQuery({
        url: apiUrls?.common.getCities,
        postData: { country: "India", state: selectedState },
        onSuccess: (res: any) => {
          console.log("Cities fetched successfully:", res);
          setCities(res.data || []);
        },
        onFail: (error: any) => {
          console.error("Error fetching cities:", error);
          showToast(
            "error",
            "Error",
            "Failed to fetch cities for the selected state."
          );
        },
      });
    } catch (error) {
      console.error("Error selecting state:", error);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Reset form after submission
    setFormData({
      name: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
      phoneNumber: "",
    });
    setErrors({});
    setCities([]); // Reset cities as well
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
        style={styles.MainContainer}
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Personal Information </Text>
                <Text style={styles.subtitle}>
                  Please fill in your details below
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.multilineInput,
                    errors.address && styles.inputError,
                    focusedField === "address" && styles.inputFocused,
                  ]}
                  value={formData.address}
                  onChangeText={(text) => updateField("address", text)}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your complete address"
                  placeholderTextColor="#A0AEC0"
                  multiline
                  numberOfLines={3}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>State *</Text>
                <CustomDropdown
                  data={stateNames}
                  value={formData.state}
                  onSelect={handleStateSelect}
                  placeholder="Select your state"
                  error={!!errors.state}
                  focused={focusedField === "state"}
                />
                {errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City *</Text>
                <CustomDropdown
                  data={cities}
                  value={formData.city}
                  onSelect={(selectedCity) => updateField("city", selectedCity)}
                  placeholder="Select your city"
                  error={!!errors.city}
                  focused={focusedField === "city"}
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.pincode && styles.inputError,
                    focusedField === "pincode" && styles.inputFocused,
                  ]}
                  value={formData.pincode}
                  onChangeText={(text) => updateField("pincode", text)}
                  onFocus={() => setFocusedField("pincode")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter 6-digit pincode"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  maxLength={6}
                />
                {errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.phoneNumber && styles.inputError,
                    focusedField === "phoneNumber" && styles.inputFocused,
                  ]}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField("phoneNumber", text)}
                  onFocus={() => setFocusedField("phoneNumber")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButtonContainer}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Submit Form</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGradient}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>🚀 Submitted!</Text>

                <View style={styles.modalDetailsContainer}>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Name:</Text>
                    <Text style={styles.modalDetailValue}>{formData.name}</Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Address:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formData.address}
                    </Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>City:</Text>
                    <Text style={styles.modalDetailValue}>{formData.city}</Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>State:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formData.state}
                    </Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Pincode:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formData.pincode}
                    </Text>
                  </View>

                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Phone:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formData.phoneNumber}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleModalClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  MainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 18,
    paddingTop: 32,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Quicksand_Medium",
    color: "#718096",
    textAlign: "center",
    fontWeight: "300",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Quicksand_Medium",
    marginBottom: 10,
    color: "#4A5568",
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontFamily: "Quicksand_Medium",
    backgroundColor: "#FAFAFA",
    color: "#2D3748",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#667eea",
    backgroundColor: "#FFFFFF",
    shadowColor: "#667eea",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  inputError: {
    borderColor: "#F56565",
    backgroundColor: "#fff",
    shadowColor: "#E53E3E",
    shadowOpacity: 0.2,
  },
  errorText: {
    color: "#F56565",
    fontSize: 13,
    fontFamily: "Quicksand_Medium",
    marginTop: 6,
    fontWeight: "600",
    marginLeft: 4,
  },
  multilineInput: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  submitButtonContainer: {
    marginTop: 32,
    borderRadius: 16,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Quicksand_Medium",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalGradient: {
    borderRadius: 20,
  },
  modalContent: {
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Quicksand_Medium",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalDetailsContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  modalDetailLabel: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Quicksand_Medium",
    color: "#4A5568",
    width: 80,
    letterSpacing: 0.3,
  },
  modalDetailValue: {
    fontSize: 16,
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
    flex: 1,
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Quicksand_Medium",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
