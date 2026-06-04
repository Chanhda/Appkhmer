import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { type HeritageDocument } from '@/lib/heritage-repository';

import { getHeritageCoordinates } from './coordinates';

interface MapComponentProps {
  heritages: HeritageDocument[];
  onPressHeritage: (id: string) => void;
  colorScheme: 'light' | 'dark';
}

export default function MapComponent({ heritages, onPressHeritage, colorScheme }: MapComponentProps) {
  const C = Colors[colorScheme];

  // Centroid / region calculation
  let initialRegion = {
    latitude: 9.8,
    longitude: 106.1,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  if (heritages.length > 0) {
    const coords = heritages.map((h, i) => getHeritageCoordinates(h, i));
    const lats = coords.map((c) => c.latitude);
    const lngs = coords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    initialRegion = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.4),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.4),
    };
  }

  const mapStyle = colorScheme === 'dark' ? darkMapStyle : [];

  return (
    <View style={[styles.container, { borderColor: `${C.primary}30` }]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        showsUserLocation={false}
      >
        {heritages.map((heritage, index) => {
          const coords = getHeritageCoordinates(heritage, index);
          return (
            <Marker
              key={heritage.id}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
            >
              {/* Custom marker design: gold dot with white border & shadow */}
              <View style={[styles.customMarker, { backgroundColor: C.primary }]} />

              <Callout onPress={() => onPressHeritage(heritage.id)}>
                <View style={styles.calloutContainer}>
                  <ThemedText style={[styles.calloutTitle, { color: C.primary }]}>
                    {heritage.title}
                  </ThemedText>
                  <ThemedText style={styles.calloutSubtitle}>
                    {heritage.province} • {heritage.category}
                  </ThemedText>
                  <ThemedText style={[styles.calloutButtonText, { color: C.accent }]}>
                    Xem chi tiết »
                  </ThemedText>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  calloutContainer: {
    width: 200,
    padding: 6,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 11,
    color: '#8a8a8a',
    marginBottom: 6,
  },
  calloutButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

// Google Maps Dark styling
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#131313',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#131313',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2c2d30',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0e0f10',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
];
