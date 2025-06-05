import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Button from "./Button";
import { Colors } from "../../constants/Colors";

const WeighingResultModal = ({ visible, data, onClose }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "sehat":
        return Colors.success;
      case "tidak sehat":
        return Colors.warning;
      case "obesitas":
        return Colors.error;
      default:
        return Colors.gray700;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "sehat":
        return "✅";
      case "tidak sehat":
        return "⚠️";
      case "obesitas":
        return "❌";
      default:
        return "❓";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!data) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>📊 Measurement Results</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {formatDateTime(data.dateTime)}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(data.nutritionStatus) },
                ]}
              >
                <Text style={styles.statusIcon}>
                  {getStatusIcon(data.nutritionStatus)}
                </Text>
                <Text style={styles.statusText}>
                  {data.nutritionStatus || "Unknown"}
                </Text>
              </View>
            </View>

            <View style={styles.measurementsGrid}>
              <View style={styles.measurementCard}>
                <Text style={styles.measurementIcon}>⚖️</Text>
                <Text style={styles.measurementLabel}>Weight</Text>
                <Text style={styles.measurementValue}>
                  {data.weight ? `${data.weight} kg` : "N/A"}
                </Text>
              </View>

              <View style={styles.measurementCard}>
                <Text style={styles.measurementIcon}>📏</Text>
                <Text style={styles.measurementLabel}>Height</Text>
                <Text style={styles.measurementValue}>
                  {data.height ? `${data.height} cm` : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.additionalInfo}>
              <Text style={styles.sectionTitle}>Additional Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🍽️</Text>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Pola Makan</Text>
                    <Text style={styles.infoValue}>
                      {data.eatingPattern || "Not specified"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🏃‍♂️</Text>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Respon Anak</Text>
                    <Text style={styles.infoValue}>
                      {data.childResponse || "Not specified"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {data.nutritionStatus && (
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationTitle}>
                  💡 Recommendation
                </Text>
                <Text style={styles.recommendationText}>
                  {getRecommendation(data.nutritionStatus)}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Close"
              onPress={onClose}
              style={styles.closeButtonAction}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getRecommendation = (status) => {
  switch (status?.toLowerCase()) {
    case "sehat":
      return "Pertahankan pola makan dan aktivitas yang sehat. Lanjutkan dengan gizi seimbang dan olahraga teratur.";
    case "tidak sehat":
      return "Perlu perhatian khusus pada pola makan dan aktivitas. Konsultasikan dengan ahli gizi untuk program yang tepat.";
    case "obesitas":
      return "Diperlukan intervensi segera dengan program diet dan aktivitas fisik yang disesuaikan. Konsultasi dengan dokter direkomendasikan.";
    default:
      return "Lakukan pemeriksaan rutin dan konsultasi dengan tenaga kesehatan untuk evaluasi lebih lanjut.";
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    maxHeight: "90%",
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.gray600,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dateContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: Colors.gray600,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  measurementsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  measurementCard: {
    flex: 1,
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  measurementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  additionalInfo: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray900,
    textTransform: "capitalize",
  },
  recommendationContainer: {
    backgroundColor: Colors.primary + "10",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  closeButtonAction: {
    marginBottom: 0,
  },
});

export default WeighingResultModal;
