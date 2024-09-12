import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const ViewCVScreen = ({ route }) => {
  const { pdfUri } = route.params;

  return (
    <View style={styles.container}>
      {pdfUri ? (
        <WebView 
          source={{ uri: pdfUri }} 
          startInLoadingState={true} 
          renderLoading={() => <ActivityIndicator size="large" color="#6D28D9" />}
        />
      ) : (
        <ActivityIndicator size="large" color="#6D28D9" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViewCVScreen;
