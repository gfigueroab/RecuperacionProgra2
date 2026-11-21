
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { useRouter } from 'expo-router';
import { supabase } from '../config/supabase';

import EquipmentCard, {
  Equipo,
} from '../components/EquipmentCard';

export default function HomeScreen() {
  const router = useRouter();

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEquipos(
        (data || []).map((e: any) => ({
          ...e,
          id: String(e.id),
        }))
      );
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const solicitarPrestamo = async (equipo: Equipo) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Necesitas iniciar sesión para solicitar un equipo.'
      );
      return;
    }

    const fecha = new Date();
    const devolucion = new Date();

    devolucion.setDate(devolucion.getDate() + 7);

    const { error } = await supabase
      .from('prestamos')
      .insert({
        usuario_id: user.id,
        equipo_id: Number(equipo.id),
        fecha_prestamo: fecha.toISOString(),
        fecha_devolucion_programada: devolucion.toISOString(),
        estado: 'Pendiente',
      });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert(
      'Solicitud enviada',
      'Tu solicitud de préstamo está pendiente de aprobación.'
    );
  };

  if (loading) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Cargando equipos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Sistema de Préstamos
      </Text>

      <Text style={styles.subtitulo}>
        Catálogo de equipos disponibles
      </Text>

      <TouchableOpacity
        style={styles.botonPrestamos}
        onPress={() => router.push('//prestamos')}
      >
        <Text style={styles.textoBoton}>
          Ver solicitudes de préstamos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonEquipos}
        onPress={() => router.push('//equipos')}
      >
        <Text style={styles.textoBoton}>
          Administrar equipos
        </Text>
      </TouchableOpacity>

      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EquipmentCard
            equipo={item}
            onSolicitar={solicitarPrestamo}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No hay equipos registrados.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              cargarEquipos();
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 5,
    marginBottom: 15,
  },
  botonPrestamos: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  botonEquipos: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  textoBoton: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
});
