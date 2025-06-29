import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import Header from "../components/Header";

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

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      Alert.alert(
        "Form Submitted Successfully!",
        `Name: ${formData.name}\nAddress: ${formData.address}\nCity: ${formData.city}\nState: ${formData.state}\nPincode: ${formData.pincode}\nPhone: ${formData.phoneNumber}`,
        [
          {
            text: "OK",
            onPress: () => {
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
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <LinearGradient
        style={styles.MainContainer}
        colors={["#EAE7F0", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Personal Information Form</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
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
                  ]}
                  value={formData.address}
                  onChangeText={(text) => updateField("address", text)}
                  placeholder="Enter your complete address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={[styles.input, errors.state && styles.inputError]}
                  value={formData.state}
                  onChangeText={(text) => updateField("state", text)}
                  placeholder="Enter your state"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={formData.city}
                  onChangeText={(text) => updateField("city", text)}
                  placeholder="Enter your city"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                  style={[styles.input, errors.pincode && styles.inputError]}
                  value={formData.pincode}
                  onChangeText={(text) => updateField("pincode", text)}
                  placeholder="Enter 6-digit pincode"
                  placeholderTextColor="#9CA3AF"
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
                  ]}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField("phoneNumber", text)}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAE7F0",
  },
  MainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#6B46C1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 26,
    fontWeight: "bold",
    color: "#6B46C1",
    textShadowColor: "rgba(107, 70, 193, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#5B21B6",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#374151",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(254, 242, 242, 0.8)",
    shadowColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
