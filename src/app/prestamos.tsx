
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useRouter } from 'expo-router';

export default function PrestamosScreen() {
  const router = useRouter();
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPrestamos = async () => {
    const { data, error } = await supabase
      .from('prestamos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setPrestamos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gestión de préstamos</Text>
      <Text style={styles.subtitulo}>
        Solicitudes registradas: {prestamos.length}
      </Text>

      <FlatList
        data={prestamos}
        keyExtractor={(item, index) =>
          String(item.id ?? index)
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>
              Préstamo #{item.id ?? 'Sin ID'}
            </Text>

            <Text>Usuario: {item.usuario_id ?? 'No indicado'}</Text>
            <Text>Equipo: {item.equipo_id ?? 'No indicado'}</Text>
            <Text>
              Estado: {item.estado ?? item.status ?? 'Sin estado'}
            </Text>
            <Text>
              Fecha: {item.fecha_prestamo
                ? String(item.fecha_prestamo).slice(0, 10)
                : 'No indicada'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Todavía no hay solicitudes de préstamo.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 18,
    paddingTop: 55,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volver: {
    color: '#2563eb',
    fontSize: 16,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitulo: {
    color: '#64748b',
    marginVertical: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
});
