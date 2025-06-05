import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { generateBulkData } from "../../utils/dataGenerator";
import {
  getUserData,
  createBulkData,
  clearAllUserData,
  deleteDataEntry,
} from "../../services/dataService";
import { exportToExcel, exportToPDF } from "../../services/exportService";
import { getColors } from "../../constants/Colors";

function TableScreen() {
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { currentUser, userProfile } = useAuth();
  const colors = getColors(theme);

  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const loadData = async () => {
    if (!currentUser?.uid) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getUserData(currentUser.uid, sortOrder);

    if (result.success) {
      setData(result.data);
    } else {
      console.warn("Failed to load data:", result.error);
      setData([]);
      if (result.error !== "Firestore not available") {
        Alert.alert(t("common.error"), t("table.loadError"));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.uid) {
      loadData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [currentUser, sortOrder]);

  const handleGenerateData = () => {
    if (!currentUser?.uid) {
      Alert.alert(t("common.error"), "Please login to generate data");
      return;
    }

    Alert.alert(t("table.generateTitle"), t("table.generateMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("table.generate"),
        onPress: async () => {
          setGenerating(true);
          const newData = generateBulkData(10);

          const result = await createBulkData(currentUser.uid, newData);

          if (result.success) {
            await loadData();
            Alert.alert(t("common.success"), t("table.generateSuccess"));
          } else {
            Alert.alert(t("common.error"), t("table.saveError"));
          }
          setGenerating(false);
        },
      },
    ]);
  };

  const handleClearData = () => {
    if (!currentUser?.uid) return;

    Alert.alert(t("table.clearTitle"), t("table.clearMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("table.clear"),
        style: "destructive",
        onPress: async () => {
          setClearing(true);
          const result = await clearAllUserData(currentUser.uid);

          if (result.success) {
            setData([]);
            Alert.alert(t("common.success"), t("table.clearSuccess"));
          } else {
            Alert.alert(t("common.error"), t("table.saveError"));
          }
          setClearing(false);
        },
      },
    ]);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
  };

  const handleExportExcel = async () => {
    if (!data || data.length === 0) {
      Alert.alert(t("common.error"), t("table.noDataToExport"));
      return;
    }

    setExportingExcel(true);
    const result = await exportToExcel(data, userProfile);

    if (result.success) {
      Alert.alert(t("common.success"), t("table.exportSuccess"));
    } else {
      Alert.alert(t("common.error"), t("table.exportError"));
    }
    setExportingExcel(false);
  };

  const handleExportPdf = async () => {
    if (!data || data.length === 0) {
      Alert.alert(t("common.error"), t("table.noDataToExport"));
      return;
    }

    setExportingPdf(true);
    const result = await exportToPDF(data, userProfile);

    if (result.success) {
      Alert.alert(t("common.success"), t("table.exportSuccess"));
    } else {
      Alert.alert(t("common.error"), t("table.exportError"));
    }
    setExportingPdf(false);
  };

  const handleEdit = (item) => {
    Alert.alert(
      t("table.editTitle"),
      `${t("table.editMessage")}\nDate: ${item.date}\nValue 1: ${
        item.value1
      }\nValue 2: ${item.value2}`
    );
  };

  const handleDelete = (item) => {
    if (!currentUser?.uid) return;

    Alert.alert(
      t("table.deleteTitle"),
      `${t("table.deleteMessage")}\nDate: ${item.date}`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            const result = await deleteDataEntry(currentUser.uid, item.id);

            if (result.success) {
              await loadData();
              Alert.alert(t("common.success"), t("table.deleteSuccess"));
            } else {
              Alert.alert(t("common.error"), t("table.saveError"));
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner text={t("common.loading")} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("table.title")}</Text>
        <Text style={styles.subtitle}>{t("table.subtitle")}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsContainer}>
          <Button
            title={generating ? t("table.generating") : t("table.generateData")}
            onPress={handleGenerateData}
            style={styles.generateButton}
            disabled={generating || clearing || exportingExcel || exportingPdf}
          />

          {data.length > 0 && (
            <>
              <View style={styles.exportContainer}>
                <Button
                  title={
                    exportingExcel
                      ? t("table.exporting")
                      : t("table.exportExcel")
                  }
                  onPress={handleExportExcel}
                  variant="secondary"
                  style={styles.exportButton}
                  disabled={
                    generating || clearing || exportingExcel || exportingPdf
                  }
                />

                <Button
                  title={
                    exportingPdf ? t("table.exporting") : t("table.exportPdf")
                  }
                  onPress={handleExportPdf}
                  variant="secondary"
                  style={styles.exportButton}
                  disabled={
                    generating || clearing || exportingExcel || exportingPdf
                  }
                />
              </View>

              <Button
                title={clearing ? "Clearing..." : t("table.clearData")}
                onPress={handleClearData}
                variant="outline"
                style={styles.clearButton}
                disabled={
                  generating || clearing || exportingExcel || exportingPdf
                }
              />
            </>
          )}

          {data.length > 0 && (
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>{t("table.sortByDate")}:</Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={handleSortToggle}
                disabled={
                  generating || clearing || exportingExcel || exportingPdf
                }
              >
                <Text style={styles.sortButtonText}>
                  {sortOrder === "desc"
                    ? t("table.newestFirst")
                    : t("table.oldestFirst")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.tableContainer}>
          {data.length > 0 ? (
            <DataTable
              headers={[
                t("table.date"),
                t("table.value1"),
                t("table.value2"),
                t("table.status"),
                t("common.actions"),
              ]}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
              keyExtractor={(item, index) => item.id || `table-item-${index}`}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("table.noData")}</Text>
              <Text style={styles.emptySubtext}>{t("table.noDataDesc")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.white,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.gray900,
      textAlign: "center",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray600,
      textAlign: "center",
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 24,
    },
    actionsContainer: {
      marginBottom: 24,
    },
    generateButton: {
      marginBottom: 12,
    },
    exportContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    exportButton: {
      flex: 1,
    },
    clearButton: {
      marginBottom: 16,
    },
    sortContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.white,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    sortLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.gray700,
    },
    sortButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    sortButtonText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: "600",
    },
    tableContainer: {
      flex: 1,
    },
    emptyContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 32,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.gray700,
      marginBottom: 8,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.gray500,
      textAlign: "center",
      lineHeight: 20,
    },
  });

export default TableScreen;
