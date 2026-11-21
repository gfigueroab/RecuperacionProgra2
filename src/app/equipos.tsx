
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { supabase } from '../config/supabase';
import { useRouter } from 'expo-router';

export default function EquiposScreen() {
  const router = useRouter();

  const [equipos, setEquipos] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);

  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('equipos')
      .select('*');

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEquipos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const agregarEquipo = async () => {
    if (!nombre.trim()) {
      Alert.alert('Atención', 'Escribe el nombre del equipo.');
      return;
    }

    const { error } = await supabase
      .from('equipos')
      .insert({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        disponibilidad: true,
      });

    if (error) {
      Alert.alert('Error al guardar', error.message);
      return;
    }

    setNombre('');
    setDescripcion('');
    Alert.alert('Correcto', 'Equipo registrado.');
    cargarEquipos();
  };

  const eliminarEquipo = (id: string | number) => {
    Alert.alert(
      'Eliminar equipo',
      '¿Seguro que deseas eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('equipos')
              .delete()
              .eq('id', id);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              cargarEquipos();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Administrar equipos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del equipo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={agregarEquipo}
      >
        <Text style={styles.textoBoton}>+ Registrar equipo</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Equipos registrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={equipos}
          keyExtractor={(item, index) =>
            String(item.id ?? index)
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>
                  {item.descripcion || 'Sin descripción'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => eliminarEquipo(item.id)}
                style={styles.eliminar}
              >
                <Text style={styles.textoBoton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  volver: {
    color: '#2563eb',
    marginBottom: 15,
    fontSize: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  input: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 18,
  },
  card: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  descripcion: {
    color: '#64748b',
    marginTop: 5,
  },
  eliminar: {
    backgroundColor: '#dc2626',
    padding: 10,
    borderRadius: 7,
  },
});
